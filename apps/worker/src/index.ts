import { ethicsCheck, REJECT_MESSAGES } from './ethics/guard.js';
import { checkAndIncrement } from './ethics/rateLimit.js';
import { hashIp } from './util/ipHash.js';
import { pickClient } from './llm/router.js';
import { preCheck, recordUsage, wouldExceedProjectCap } from './router/quota.js';
import { routeOnce } from './router/styleRouter.js';
import { withMutex } from './router/usageMutex.js';
import { sanitize } from './sanitizer/responseSanitizer.js';
import { FALLBACK_LETTERS } from './killSwitch/templates.js';
import { preflight, withCors } from './util/cors.js';
import {
  kvUsageKey, todayUtc, monthUtc,
  nextDailyResetUtc, nextMonthlyResetUtc,
  makeUsageBucket, type Usage,
} from './router/usage.js';
import { GenerateRequestSchema, type ModelId, STYLES } from '@sry/shared';

const MODELS: ModelId[] = ['workers-ai', 'gemini-flash', 'claude-haiku', 'ollama', 'openai-compatible'];

function getClientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0'
  );
}

function jsonError(reason: string, message: string, status: number): Response {
  return new Response(JSON.stringify({ error: reason, message }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function jsonOk(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const path = url.pathname;

    if (req.method === 'OPTIONS') return preflight();

    if (req.method === 'GET' && path === '/api/usage') {
      const now = new Date();
      const dailyUsedRaw = await env.RL.get(kvUsageKey('daily', todayUtc(now)));
      const monthlyUsedRaw = await env.RL.get(kvUsageKey('monthly', monthUtc(now)));
      const dailyUsed = Number(dailyUsedRaw ?? 0);
      const monthlyUsed = Number(monthlyUsedRaw ?? 0);
      const dailyCap = Number(env.PROJECT_DAILY_NEURONS_CAP ?? 8000);
      const monthlyCap = Number(env.PROJECT_MONTHLY_NEURONS_CAP ?? 240000);
      const usage: Usage = {
        daily: makeUsageBucket(dailyCap, dailyUsed, nextDailyResetUtc(now)),
        monthly: makeUsageBucket(monthlyCap, monthlyUsed, nextMonthlyResetUtc(now)),
      };
      return withCors(jsonOk(usage));
    }

    if (req.method === 'GET' && path === '/api/health') {
      return withCors(jsonOk({ ok: true, ts: Date.now() }));
    }

    if (req.method === 'POST' && path === '/api/gen') {
      const ip = getClientIp(req);
      const ipHash = await hashIp(ip);

      // 1. ethics guard
      let body: unknown;
      try { body = await req.json(); } catch { return withCors(jsonError('too-short', 'invalid json', 400)); }
      const ethics = ethicsCheck(body);
      if (!ethics.ok) {
        const status = ethics.reason === 'too-long' || ethics.reason === 'too-short' ? 400 : 422;
        return withCors(jsonError(ethics.reason, REJECT_MESSAGES[ethics.reason], status));
      }

      // re-parse to get the validated situation/personality
      const parsed = GenerateRequestSchema.safeParse(body);
      if (!parsed.success) {
        return withCors(jsonError('too-short', 'invalid json', 400));
      }
      const { situation, personality } = parsed.data;

      // 2. rate limit
      const rl = await checkAndIncrement(ip, env.RL, 10, 60);
      if (!rl.ok) {
        return withCors(new Response(JSON.stringify({ error: 'rate-limit', message: '请求太快,请稍后再试', retryAfterSec: rl.retryAfterSec }), {
          status: 429,
          headers: { 'content-type': 'application/json', 'retry-after': String(rl.retryAfterSec ?? 60) },
        }));
      }

      // 3. quota pre-check
      const modelHeader = (req.headers.get('x-model') ?? env.DEFAULT_MODEL) as ModelId;
      const model: ModelId = MODELS.includes(modelHeader) ? modelHeader : 'workers-ai';
      const isLocal = model === 'ollama' || model === 'openai-compatible';
      // Local providers do NOT touch the project neuron caps. We still
      // run preCheck for cloud cases (workers-ai / gemini-flash /
      // claude-haiku).
      const mode = model === 'claude-haiku' ? 'byok' : 'self';
      if (!isLocal) {
        const qc = await preCheck(ipHash, mode, env.RL);
        if (!qc.ok) {
          return withCors(jsonError('quota-exceeded', qc.message, 429));
        }
      }

      // === Project-level free-tier cap (pre-check + reserve) ===
      // Local providers skip the cap entirely.
      const dailyCap = Number(env.PROJECT_DAILY_NEURONS_CAP ?? 8000);
      const monthlyCap = Number(env.PROJECT_MONTHLY_NEURONS_CAP ?? 240000);
      const estimatedNeurons = 2000;  // Conservative pre-check estimate
      const dayKey = kvUsageKey('daily', todayUtc(new Date()));
      const monthKey = kvUsageKey('monthly', monthUtc(new Date()));

      let reserveFailed = false;
      if (!isLocal) {
        await withMutex(`reserve:${dayKey}:${monthKey}`, async () => {
          const dailyUsed = Number(await env.RL.get(dayKey) ?? 0);
          const monthlyUsed = Number(await env.RL.get(monthKey) ?? 0);
          if (wouldExceedProjectCap(dailyCap, dailyUsed, estimatedNeurons) ||
              wouldExceedProjectCap(monthlyCap, monthlyUsed, estimatedNeurons)) {
            reserveFailed = true;
            return;
          }
          // Pre-reserve: bump counters by the estimate so concurrent requests see it
          await env.RL.put(dayKey, String(dailyUsed + estimatedNeurons), { expirationTtl: 86400 + 3600 });
          await env.RL.put(monthKey, String(monthlyUsed + estimatedNeurons), { expirationTtl: 32 * 86400 });
        });
        if (reserveFailed) {
          return withCors(jsonError('quota-exceeded',
            '项目免费额度已用完,明天 UTC 0 点重置。', 429));
        }
      }

      // 4. kill switch
      if (env.LLM_KILL_SWITCH === 'true') {
        return withCors(jsonOk({
          letters: FALLBACK_LETTERS,
          meta: { model, latency_ms: 0, killSwitch: true },
        }));
      }

      // 5. pick LLM + run style router
      // Local providers receive 4 extra fields from the request body and
      // are routed to Ollama/OpenAI-compatible clients. The baseUrl is
      // validated (SSRF guard); failures return 400.
      const bodyRecord = (body ?? {}) as Record<string, unknown>;
      const localBaseUrl = typeof bodyRecord.localBaseUrl === 'string' ? bodyRecord.localBaseUrl : '';
      const localModel = typeof bodyRecord.localModel === 'string' ? bodyRecord.localModel : '';
      const localApiKey = typeof bodyRecord.localApiKey === 'string' ? bodyRecord.localApiKey : undefined;
      const localTimeoutMs = typeof bodyRecord.localTimeoutMs === 'number' ? bodyRecord.localTimeoutMs : undefined;
      let client;
      try {
        if (isLocal) {
          client = pickClient({
            model,
            headers: req.headers,
            env,
            local: { baseUrl: localBaseUrl, model: localModel, apiKey: localApiKey, timeoutMs: localTimeoutMs },
          });
        } else {
          client = pickClient({ model, headers: req.headers, env });
        }
      } catch (e) {
        const msg = (e as Error).message;
        return withCors(jsonError('kill-switch', msg, 400));
      }

      const t0 = Date.now();
      const routeResult = await routeOnce({
        situation,
        personality,
        llm: client,
      });
      const latency = Date.now() - t0;
      const raw = routeResult.letters;
      const neurons = routeResult.neurons;

      // 6. sanitize
      const letters = {} as Record<string, string>;
      for (const s of STYLES) {
        const v = raw[s];
        letters[s] = v ? sanitize({ letter: v, input: situation }) : '';
      }

      // 7. record usage
      const usageProvider: 'workers_ai' | 'gemini' | 'deepseek' | 'byok' | 'local' =
        isLocal ? 'local' :
        model === 'claude-haiku' ? 'byok' :
        model === 'gemini-flash' ? 'gemini' :
        'workers_ai';
      await recordUsage(ipHash, usageProvider, env.RL);

      // === Adjust reservation: actual neurons vs estimated ===
      // Skip for local providers (no project reservation was made).
      if (!isLocal && neurons > 0) {
        await withMutex(`reserve:${dayKey}:${monthKey}`, async () => {
          const prevDaily = Number(await env.RL.get(dayKey) ?? 0);
          const prevMonthly = Number(await env.RL.get(monthKey) ?? 0);
          // Refund the estimate, add actual (could be more or less)
          const adjDaily = prevDaily - estimatedNeurons + neurons;
          const adjMonthly = prevMonthly - estimatedNeurons + neurons;
          await env.RL.put(dayKey, String(adjDaily), { expirationTtl: 86400 + 3600 });
          await env.RL.put(monthKey, String(adjMonthly), { expirationTtl: 32 * 86400 });
        });
      }

      return withCors(jsonOk({ letters, meta: { model, latency_ms: latency } }));
    }

    return withCors(new Response('not found', { status: 404 }));
  },
};
