import type { SceneId, StyleId } from '@/data/prompts';

// PR #1: 分享粒度 = 1 封最离谱的 + AI 损友点评 1 行 + 场景上下文
export interface SharePayload {
  scene: SceneId;
  style: StyleId;
  letter: string;
  roast: string;
  situation: string;
}

function utf8ToBase64(s: string): string {
  if (typeof window === 'undefined') return Buffer.from(s, 'utf-8').toString('base64');
  return btoa(unescape(encodeURIComponent(s)));
}

function base64ToUtf8(s: string): string {
  if (typeof window === 'undefined') return Buffer.from(s, 'base64').toString('utf-8');
  return decodeURIComponent(escape(atob(s)));
}

export function encodeShare(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  return utf8ToBase64(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShare(hash: string): SharePayload | null {
  try {
    let b64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = base64ToUtf8(b64);
    const parsed = JSON.parse(json) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    if (typeof p.scene !== 'string') return null;
    if (typeof p.style !== 'string') return null;
    if (typeof p.letter !== 'string') return null;
    if (typeof p.roast !== 'string') return null;
    if (typeof p.situation !== 'string') return null;
    return {
      scene: p.scene as SceneId,
      style: p.style as StyleId,
      letter: p.letter,
      roast: p.roast,
      situation: p.situation,
    };
  } catch {
    return null;
  }
}

export function buildShareUrl(payload: SharePayload): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}#share=${encodeShare(payload)}`;
}

export function parseShareUrl(): SharePayload | null {
  if (typeof window === 'undefined') return null;
  const m = window.location.hash.match(/^#share=(.+)$/);
  if (!m) return null;
  return decodeShare(m[1] ?? '');
}

// PR #3: share-as-meme format
// Same payload shape as the letter share, but tagged with kind:'meme'
// so receivers see the meme-card layout.
export type MemeKind = 'meme';

export interface MemeSharePayload extends SharePayload {
  kind: MemeKind;
}

export function encodeMemeShare(payload: SharePayload): string {
  const json = JSON.stringify({ ...payload, kind: 'meme' });
  return utf8ToBase64(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeMemeShare(hash: string): MemeSharePayload | null {
  try {
    let b64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = base64ToUtf8(b64);
    const parsed = JSON.parse(json) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;
    const p = parsed as Record<string, unknown>;
    if (typeof p.scene !== 'string') return null;
    if (typeof p.style !== 'string') return null;
    if (typeof p.letter !== 'string') return null;
    if (typeof p.roast !== 'string') return null;
    if (typeof p.situation !== 'string') return null;
    return {
      kind: 'meme',
      scene: p.scene as SceneId,
      style: p.style as StyleId,
      letter: p.letter,
      roast: p.roast,
      situation: p.situation,
    };
  } catch {
    return null;
  }
}

export function buildMemeShareUrl(input: { scene: SceneId; style: StyleId; letter: string; roast: string; situation?: string }): string {
  if (typeof window === 'undefined') return '';
  const payload: SharePayload = {
    scene: input.scene,
    style: input.style,
    letter: input.letter,
    roast: input.roast,
    situation: input.situation ?? '',
  };
  return `${window.location.origin}${window.location.pathname}#meme=${encodeMemeShare(payload)}`;
}

// parseMemeUrl parses BOTH the legacy #share= and the new #meme= URLs,
// returning whichever one is in the current hash. Returns null if neither.
export function parseMemeUrl(): MemeSharePayload | null {
  if (typeof window === 'undefined') return null;
  const h = window.location.hash;
  const m = h.match(/^#(share|meme)=(.+)$/);
  if (!m) return null;
  const kind = m[1] ?? '';
  const raw = m[2] ?? '';
  if (kind === 'meme') return decodeMemeShare(raw);
  // legacy share: synthesise the meme payload from SharePayload
  const decoded = decodeShare(raw);
  if (!decoded) return null;
  return { kind: 'meme', ...decoded };
}
