import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import InvestmentsPage from './InvestmentsPage';

describe('public investment directory', () => {
  it('shows institution types and filters investment products', () => {
    render(<InvestmentsPage />);
    expect(screen.getByRole('heading', { name: 'A clearer way to explore your options' })).toBeInTheDocument();
    expect(screen.getByText('Under 1 year')).toBeInTheDocument();
    expect(screen.getByText('5+ years')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Financial Instruments in India' })).toBeInTheDocument();
    expect(screen.getByText('Term Insurance')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Bank fixed deposit' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'National Pension System (NPS)' })).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Search investments or institutions'), { target: { value: 'India Post' } });
    expect(screen.getByRole('heading', { name: 'Post office time deposit' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Listed shares' })).not.toBeInTheDocument();
  });
});
