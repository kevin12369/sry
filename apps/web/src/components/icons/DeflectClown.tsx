import { type SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

// PR #2 P2 Fix 6: 耍赖 (🤡) - 小丑脸 - outline 单线 + viewBox=24
export function DeflectClown({ size = 24, ...props }: Props) {
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
      {/* 蓬松发(左) */}
      <path d="M 5 8 L 3 5 L 5.5 7 L 4 3.5 L 7 6" />
      {/* 蓬松发(右) */}
      <path d="M 19 8 L 21 5 L 18.5 7 L 20 3.5 L 17 6" />
      {/* 圆脸 */}
      <circle cx="12" cy="13" r="7" />
      {/* 锥形小鼻子 */}
      <path d="M 12 11.5 L 11 14 L 13 14 Z" />
      {/* 2 个小眼点 */}
      <circle cx="9.5" cy="11" r="0.7" fill="currentColor" />
      <circle cx="14.5" cy="11" r="0.7" fill="currentColor" />
      {/* 张大嘴 */}
      <path d="M 9 15.5 Q 12 18 15 15.5" />
      <path d="M 9 15.5 L 15 15.5" />
    </svg>
  );
}