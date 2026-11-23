import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import TermPlanComparison from './TermPlanComparison';
afterEach(cleanup);
describe('term plan profile and quote comparison',()=>{
  it('uses the customer context and never fabricates a premium',()=>{
    render(<TermPlanComparison profile={{age:28,salary:80000,monthlyExpenses:30000,dependants:2}} premiumBudget={800}/>);
    expect(screen.getByLabelText('Requested life cover (₹)')).toHaveValue(14500000);
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(screen.getAllByText('Quote needed')).toHaveLength(7);
    const first=screen.getAllByLabelText('Your insurer-quoted annual premium (₹)')[0];
    fireEvent.change(first,{target:{value:'12000'}});
    expect(screen.getByText('₹1,000/month equivalent')).toBeInTheDocument();
    expect(screen.getByText('Above your illustration premium budget by ₹200/month.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Tobacco / nicotine use'),{target:{value:'Yes'}});
    expect(screen.getAllByText('Quote needed')).toHaveLength(7);
  });
  it('supports search without hiding plans because of underwriting assumptions',()=>{
    render(<TermPlanComparison profile={{age:28,salary:80000,monthlyExpenses:30000,dependants:2}} premiumBudget={800}/>);
    fireEvent.change(screen.getByLabelText('Find an insurer or plan'),{target:{value:'New Tech-Term'}});
    expect(screen.getAllByRole('article')).toHaveLength(1);
  });
});
