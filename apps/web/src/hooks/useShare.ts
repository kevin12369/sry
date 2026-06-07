'use client';
import { useEffect, useState } from 'react';
import { decodeShare, encodeShare } from '@/lib/share';
import type { SharePayload } from '@sry/shared';

export function useShareHash(): SharePayload | null {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  useEffect(() => {
    const h = window.location.hash;
    const m = h.match(/^#share=(.+)$/);
    if (m) setPayload(decodeShare(m[1]!));
  }, []);
  return payload;
}

export function buildShareHash(p: SharePayload): string {
  return `#share=${encodeShare(p)}`;
}
