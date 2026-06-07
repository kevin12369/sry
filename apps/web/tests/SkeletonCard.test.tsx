import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonCard } from '../src/components/SkeletonCard.js';

describe('SkeletonCard', () => {
  it('renders 3 placeholder lines', () => {
    render(<SkeletonCard />);
    expect(screen.getAllByTestId('skeleton-line')).toHaveLength(3);
  });
});
