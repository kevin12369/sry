import { ethicsCheck, REJECT_MESSAGES } from './ethics/guard.js';
import { checkAndIncrement } from './ethics/rateLimit.js';
import { hashIp } from './util/ipHash.js';
import { pickClient } from './llm/router.js';
import { preCheck, recordUsage } from './router/quota.js';
import { routeOnce } from './router/styleRouter.js';
import { sanitize } from './sanitizer/responseSanitizer.js';
import { FALLBACK_LETTERS } from './killSwitch/templates.js';
import { preflight, withCors } from './util/cors.js';
import { GenerateRequestSchema, type ModelId, STYLES } from '@sry/shared';

const MODELS: ModelId[] = ['workers-ai', 'gemini-flash', 'claude-haiku'];

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
      const mode = model === 'claude-haiku' ? 'byok' : 'self';
      const qc = await preCheck(ipHash, mode, env.RL);
      if (!qc.ok) {
        return withCors(jsonError('quota-exceeded', qc.message, 429));
      }

      // 4. kill switch
      if (env.LLM_KILL_SWITCH === 'true') {
        return withCors(jsonOk({
          letters: FALLBACK_LETTERS,
          meta: { model, latency_ms: 0, killSwitch: true },
        }));
      }

      // 5. pick LLM + run style router
      let client;
      try { client = pickClient({ model, headers: req.headers, env }); }
      catch (e) {
        const msg = (e as Error).message;
        return withCors(jsonError('kill-switch', msg, 400));
      }

      const t0 = Date.now();
      const raw = await routeOnce({
        situation,
        personality,
        llm: client,
      });
      const latency = Date.now() - t0;

      // 6. sanitize
      const letters = {} as Record<string, string>;
      for (const s of STYLES) {
        const v = raw[s];
        letters[s] = v ? sanitize({ letter: v, input: situation }) : '';
      }

      // 7. record usage
      await recordUsage(ipHash, model === 'claude-haiku' ? 'byok' : (model === 'gemini-flash' ? 'gemini' : 'workers_ai'), env.RL);

      return withCors(jsonOk({ letters, meta: { model, latency_ms: latency } }));
    }

    return withCors(new Response('not found', { status: 404 }));
  },
};
