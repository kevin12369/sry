import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Paper } from '@/components/Paper';

describe('<Paper />', () => {
  it('renders children inside a paper-styled container', () => {
    const { container } = render(<Paper>信件正文</Paper>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('bg-cream');
    expect(wrapper.textContent).toContain('信件正文');
  });

  it('applies fold class when fold prop is set', () => {
    const { container } = render(<Paper fold>折角</Paper>);
    expect(container.firstChild).toHaveClass('paper-fold');
  });
});
