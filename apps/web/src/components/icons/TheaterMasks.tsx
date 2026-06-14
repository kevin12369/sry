import { type SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

// PR #2 P1 Fix 4: 场景 (🎭) - 2 个面具(喜剧 + 悲剧)并排 - outline 单线 + viewBox=24
export function TheaterMasks({ size = 24, ...props }: Props) {
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
      {/* 左面具(喜剧笑) */}
      <path d="M 3 6 Q 3 4 5 4 L 9 4 Q 11 4 11 6 L 11 11 Q 11 14 7 14 Q 3 14 3 11 Z" />
      {/* 左眼 */}
      <circle cx="5.5" cy="8" r="0.6" fill="currentColor" />
      <circle cx="8.5" cy="8" r="0.6" fill="currentColor" />
      {/* 左笑嘴 */}
      <path d="M 5 11 Q 7 12.5 9 11" />
      {/* 右面具(悲剧哭) */}
      <path d="M 13 13 Q 13 11 15 11 L 19 11 Q 21 11 21 13 L 21 18 Q 21 21 17 21 Q 13 21 13 18 Z" />
      {/* 右眼 */}
      <circle cx="15.5" cy="15" r="0.6" fill="currentColor" />
      <circle cx="18.5" cy="15" r="0.6" fill="currentColor" />
      {/* 右哭嘴 */}
      <path d="M 15 19 Q 17 17.5 19 19" />
    </svg>
  );
}