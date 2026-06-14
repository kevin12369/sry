import { type SVGProps } from 'react';

interface Props extends SVGProps<SVGSVGElement> {
  size?: number;
}

// PR #2 P2 Fix 6: 真诚 (🤝) - 两只手相握 - outline 单线 + viewBox=24
export function SincereHandshake({ size = 24, ...props }: Props) {
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
      {/* 左袖 */}
      <path d="M 2 11 L 7 8 L 11 11" />
      {/* 右手(从右侧伸入,手指相交) */}
      <path d="M 22 11 L 17 8 L 13 11" />
      {/* 双手相握中心 */}
      <path d="M 8 12.5 L 8 15 Q 8 16 9 16 L 15 16 Q 16 16 16 15 L 16 12.5" />
      {/* 手指细节 */}
      <path d="M 10 12 L 10 14" />
      <path d="M 12 12 L 12 14" />
      <path d="M 14 12 L 14 14" />
      {/* 手腕底部 */}
      <path d="M 8 16 L 9 18" />
      <path d="M 16 16 L 15 18" />
    </svg>
  );
}