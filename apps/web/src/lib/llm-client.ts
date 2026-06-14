// 浏览器直连 OpenAI 兼容端点
// 支持: Ollama 本地 (http://localhost:11434/v1) / 任意 OAI 兼容端点
// 不支持流式 (PR #2 简化, 全部非流式)

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmConfig {
  baseUrl: string;       // e.g. 'http://localhost:11434/v1'
  apiKey: string;         // 任意非空 (Ollama 本地不需要, 但 header 仍会带)
  model: string;         // e.g. 'llama3.1:8b' / 'gpt-4o-mini'
  timeoutMs?: number;     // 默认 30000
  stream?: boolean;       // 默认 false
}

export interface LlmOptions {
  config: LlmConfig;
  messages: LlmMessage[];
  temperature?: number;   // 默认 0.7
  maxTokens?: number;     // 默认 200
}

export type LlmErrorCode =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'ABORTED'
  | 'HTTP_4XX'
  | 'HTTP_5XX'
  | 'PARSE';

export class LlmError extends Error {
  code: LlmErrorCode;
  status?: number;
  constructor(code: LlmErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'LlmError';
    this.code = code;
    this.status = status;
  }
}

interface OaiResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

export async function callLlm(opts: LlmOptions): Promise<string> {
  const { config, messages } = opts;
  const temperature = opts.temperature ?? 0.7;
  const maxTokens = opts.maxTokens ?? 200;
  const timeoutMs = config.timeoutMs ?? 30000;
  const stream = config.stream ?? false;

  const url = joinUrl(config.baseUrl, '/chat/completions');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream,
      }),
      signal: controller.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new LlmError('TIMEOUT', `LLM 请求超时 (${timeoutMs}ms)`);
    }
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new LlmError('ABORTED', '请求被取消');
    }
    const msg = e instanceof Error ? e.message : String(e);
    throw new LlmError('NETWORK', `网络错误: ${msg}`);
  }
  clearTimeout(timer);

  if (res.status >= 500) {
    const text = await safeText(res);
    throw new LlmError('HTTP_5XX', `LLM 5xx: ${res.status} ${text.slice(0, 200)}`, res.status);
  }
  if (res.status >= 400) {
    const text = await safeText(res);
    throw new LlmError('HTTP_4XX', `LLM 4xx: ${res.status} ${text.slice(0, 200)}`, res.status);
  }

  let data: OaiResponse;
  try {
    data = (await res.json()) as OaiResponse;
  } catch {
    throw new LlmError('PARSE', '无法解析 LLM 响应 JSON');
  }
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new LlmError('PARSE', 'LLM 响应缺少 choices[0].message.content');
  }
  return content;
}

function joinUrl(base: string, path: string): string {
  if (base.endsWith('/') && path.startsWith('/')) return base + path.slice(1);
  if (!base.endsWith('/') && !path.startsWith('/')) return base + path;
  return base + path;
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}