'use client';
import { useEffect, useState } from 'react';
import { parseShareUrl, type SharePayload } from '@/lib/share';

export function useShareHash(): SharePayload | null {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  useEffect(() => {
    setPayload(parseShareUrl());
  }, []);
  return payload;
}
