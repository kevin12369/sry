import type { SharePayload } from '@sry/shared';
import { SharePayloadSchema } from '@sry/shared';

export function encodeShare(payload: SharePayload): string {
  const json = JSON.stringify(payload);
  // btoa handles ASCII only; encodeURIComponent escapes multi-byte safely.
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeShare(hash: string): SharePayload | null {
  try {
    let b64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = SharePayloadSchema.parse(JSON.parse(json));
    return parsed;
  } catch {
    return null;
  }
}
