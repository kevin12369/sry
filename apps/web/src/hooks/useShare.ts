'use client';
import { useEffect, useState } from 'react';
import { parseShareUrl, parseMemeUrl, type SharePayload, type MemeSharePayload } from '@/lib/share';

export function useShareHash(): SharePayload | null {
  const [payload, setPayload] = useState<SharePayload | null>(null);
  useEffect(() => {
    setPayload(parseShareUrl());
  }, []);
  return payload;
}

export function useMemeHash(): MemeSharePayload | null {
  const [payload, setPayload] = useState<MemeSharePayload | null>(null);
  useEffect(() => {
    setPayload(parseMemeUrl());
  }, []);
  return payload;
}
