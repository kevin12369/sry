import { type SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

// PR #2 P2 Fix 6: 搞笑面具 (😂) - outline 单线 + viewBox=24
export function FunnyMask({ size = 24, ...props }: Props) {
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
      {/* 圆脸 + 笑纹 + 弯眉 + 大笑嘴 */}
      <circle cx="12" cy="12" r="9" />
      {/* 笑纹(眼角弧线) */}
      <path d="M 4.5 9 Q 5.5 7.5 7 8" />
      <path d="M 17 8 Q 18.5 7.5 19.5 9" />
      {/* 弯眉 */}
      <path d="M 8 9 Q 9 7.5 10 9" />
      <path d="M 14 9 Q 15 7.5 16 9" />
      {/* 眼睛(小点) */}
      <circle cx="9" cy="11" r="0.6" fill="currentColor" />
      <circle cx="15" cy="11" r="0.6" fill="currentColor" />
      {/* 大笑嘴 */}
      <path d="M 7.5 14.5 Q 12 18.5 16.5 14.5" />
    </svg>
  );
}