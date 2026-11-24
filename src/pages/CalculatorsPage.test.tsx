import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import CalculatorsPage from './CalculatorsPage';

afterEach(cleanup);

describe('calculator hub', () => {
  it('switches the calculator in the current page', () => {
    render(<CalculatorsPage />);
    expect(screen.getByText('Retirement assumptions')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'FD calculator' }));
    expect(screen.getByText('Deposit details')).toBeInTheDocument();
    expect(screen.queryByText('Retirement assumptions')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'SIP calculator' }));
    expect(screen.getByText('Set your monthly investment')).toBeInTheDocument();
  });
});
