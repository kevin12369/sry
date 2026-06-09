import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Page from '@/app/page';

const lettersFixture = {
  funny: '老王,哈哈',
  sincere: '老王,对不起',
  shameless: '老王,我没错',
  'legal-cold': '致老王: ...',
  'silent-treatment': '(无)',
};

// Mock the api module so the *real* useGenerate hook is used — this means
// React's internal state machine drives re-renders, and we don't have to fake
// getter-based module state.
vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api')>('@/lib/api');
  return {
    ...actual,
    generateLetters: vi.fn(async () => ({
      letters: lettersFixture,
      meta: { model: 'workers-ai', latency_ms: 1 },
    })),
  };
});

describe('e2e: form → stack → letter page', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('walks the 4-step form and renders the letter stack', async () => {
    render(<Page />);
    expect(screen.getByText(/发生了什么/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('情境'), { target: { value: '我把猫放跑了, 他很生气' } });
    fireEvent.click(screen.getByText(/下一步/));
    fireEvent.click(screen.getByLabelText('朋友'));
    fireEvent.click(screen.getByText(/下一步/));
    fireEvent.click(screen.getByLabelText('真诚道歉'));
    fireEvent.click(screen.getByText(/下一步/));
    fireEvent.click(screen.getByLabelText('真诚'));
    fireEvent.click(screen.getByText(/寄出/));

    await waitFor(() => {
      expect(screen.getByLabelText(/真诚.*sincere/)).toBeInTheDocument();
    });
  });

  it('navigates prev/next in letter page', async () => {
    render(<Page />);
    // Walk the 4-step form
    fireEvent.change(screen.getByLabelText('情境'), { target: { value: '我把猫放跑了, 他很生气' } });
    fireEvent.click(screen.getByText(/下一步/));
    fireEvent.click(screen.getByLabelText('朋友'));
    fireEvent.click(screen.getByText(/下一步/));
    fireEvent.click(screen.getByLabelText('真诚道歉'));
    fireEvent.click(screen.getByText(/下一步/));
    fireEvent.click(screen.getByLabelText('真诚'));
    fireEvent.click(screen.getByText(/寄出/));

    // LetterStack should render — click the 搞笑 row to open LetterPage
    await waitFor(() => {
      expect(screen.getByLabelText(/搞笑.*funny/)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText(/搞笑/));

    // LetterPage should show 上一封/下一封 nav + 1 / 5 progress
    await waitFor(() => {
      expect(screen.getByText('1 / 5')).toBeInTheDocument();
    });

    // Click 下一封
    fireEvent.click(screen.getByText(/下一封/));
    await waitFor(() => {
      expect(screen.getByText('2 / 5')).toBeInTheDocument();
    });

    // Click 上一封
    fireEvent.click(screen.getByText(/上一封/));
    await waitFor(() => {
      expect(screen.getByText('1 / 5')).toBeInTheDocument();
    });
  });
});
