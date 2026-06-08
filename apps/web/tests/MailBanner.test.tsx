import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MailBanner } from '@/components/MailBanner';

describe('<MailBanner />', () => {
  it('displays the ethics disclaimer in a stamp style', () => {
    render(<MailBanner />);
    const banner = screen.getByRole('banner');
    expect(banner).toBeInTheDocument();
    expect(banner.textContent).toContain('做嘴笨助手');
    expect(banner.textContent).toContain('不做道歉信发送器');
  });

  it('has a postmark visual hint', () => {
    const { container } = render(<MailBanner />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
