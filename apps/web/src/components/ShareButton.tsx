'use client';
import { useToast } from './ui/toast.js';
import { Button } from './ui/button.js';
import { buildShareHash } from '@/hooks/useShare.js';
import { encodeShare } from '@/lib/share.js';
import { Share2 } from 'lucide-react';
import type { SharePayload, StyleMap, Personality } from '@sry/shared';

export function ShareButton({
  letters,
  situation,
  personality,
}: {
  letters: StyleMap;
  situation: string;
  personality: Personality;
}) {
  const toast = useToast();
  function handleShare() {
    const payload: SharePayload = { letters, situation, personality };
    const hash = buildShareHash(payload);
    window.location.hash = hash;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => toast.push('success', '链接已复制'),
        () => toast.push('info', '链接已生成,手动复制地址栏')
      );
    } else {
      toast.push('info', '链接已生成,手动复制地址栏');
    }
    void encodeShare; // keep import warm
  }
  return (
    <Button variant="outline" onClick={handleShare}>
      <Share2 size={14} className="mr-1" /> 分享
    </Button>
  );
}
