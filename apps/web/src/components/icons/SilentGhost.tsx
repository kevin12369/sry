import { type SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

// PR #2 P2 Fix 6: 已读不回 (👻) - 幽灵 - outline 单线 + viewBox=24
export function SilentGhost({ size = 24, ...props }: Props) {
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
      {/* 圆头 + 锯齿底 */}
      <path d="M 5 12 Q 5 4 12 4 Q 19 4 19 12 L 19 20 L 16.5 18 L 14 20 L 12 18 L 10 20 L 7.5 18 L 5 20 Z" />
      {/* 2 个小眼 */}
      <circle cx="9.5" cy="11" r="0.8" fill="currentColor" />
      <circle cx="14.5" cy="11" r="0.8" fill="currentColor" />
    </svg>
  );
}