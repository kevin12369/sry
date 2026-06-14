import { type SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

// PR #2 P2 Fix 6: 法务 (📜) - 卷轴 + 公章 - outline 单线 + viewBox=24
export function LegalScroll({ size = 24, ...props }: Props) {
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
      {/* 左侧卷轴(顶 + 底圆) */}
      <ellipse cx="5" cy="5" rx="2.5" ry="1.5" />
      <ellipse cx="5" cy="19" rx="2.5" ry="1.5" />
      <path d="M 5 6.5 L 5 17.5" />
      {/* 主体纸面 */}
      <path d="M 5 6 L 19 6 L 19 18 L 5 18" />
      {/* 公章(右下角圆圈 + 内十字) */}
      <circle cx="15.5" cy="14.5" r="2.2" />
      <path d="M 15.5 13 L 15.5 16" />
      <path d="M 14 14.5 L 17 14.5" />
    </svg>
  );
}