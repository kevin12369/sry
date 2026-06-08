export const tokens = {
  color: {
    paper: '#f5e8d3',
    cream: '#fdf6ec',
    ink: '#5a3e2b',
    seal: '#c75d4a',
    muted: '#8a7765',
    success: '#6b8e5a',
    dark: '#3a2e25',
  },
  font: {
    cjk: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Sans SC", sans-serif',
    latin: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  shadow: {
    paper: '0 2px 6px rgba(90, 62, 43, 0.15)',
    lifted: '0 6px 20px rgba(90, 62, 43, 0.25)',
  },
  motion: {
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  styleEmoji: {
    funny: '😂',
    sincere: '🤝',
    shameless: '🤡',
    'legal-cold': '📜',
    'silent-treatment': '👻',
  },
} as const;
