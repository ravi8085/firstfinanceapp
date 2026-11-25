import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import InteractiveDemoPage from './InteractiveDemoPage';

afterEach(cleanup);

describe('public interactive preview', () => {
  it('recalculates the sample monthly picture when a slider changes', () => {
    render(<InteractiveDemoPage />);
    expect(screen.getByText('₹20,000')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Everyday living costs/), { target: { value: '55000' } });
    expect(screen.getByText('₹10,000')).toBeInTheDocument();
    expect(screen.getByText(/These numbers stay on this page/)).toBeInTheDocument();
  });
});
