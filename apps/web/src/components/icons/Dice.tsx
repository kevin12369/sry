import { type SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

// PR #2 P2 Fix 7: SPIN 骰子 (🎲) - 立方骰子 + 3 个点 - outline 单线 + viewBox=24
export function Dice({ size = 24, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* 立方体(六边形) */}
      <path d="M 12 3 L 20 7 L 20 17 L 12 21 L 4 17 L 4 7 Z" />
      {/* 中间分线(3 条可见边) */}
      <path d="M 12 3 L 12 12" />
      <path d="M 12 12 L 4 7" />
      <path d="M 12 12 L 20 7" />
      {/* 3 个点(左上可见面) */}
      <circle cx="7" cy="9" r="0.8" fill="currentColor" />
      <circle cx="9.5" cy="11.5" r="0.8" fill="currentColor" />
      <circle cx="12" cy="9" r="0.8" fill="currentColor" />
    </svg>
  );
}