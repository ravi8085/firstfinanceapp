import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('./FinancialVisuals',()=>({FundingProgress:()=>null,MoneyBreakdown:()=>null,GoalGrowthVisual:()=>null}));
import RetirementProjection from './RetirementProjection';
afterEach(cleanup);
describe('retirement monthly investment details',()=>{
  it('shows the requirement and uses only an explicitly entered retirement contribution',()=>{
    render(<RetirementProjection salary={80000} age={28} monthlyExpenses={30000} availableMonthly={50000}/>);
    expect(screen.getByText('Monthly investment needed for retirement')).toBeInTheDocument();
    expect(screen.getByLabelText('Monthly retirement living expenses today (₹)')).toHaveValue(30000);
    expect(screen.getByLabelText('Monthly amount assigned to retirement (₹)')).toHaveValue(null);
    fireEvent.click(screen.getByRole('button',{name:'Use required monthly amount in projection'}));
    expect(Number((screen.getByLabelText('Monthly amount assigned to retirement (₹)') as HTMLInputElement).value)).toBeGreaterThan(0);
  });
  it('asks for expense inputs rather than fabricating a target',()=>{
    render(<RetirementProjection salary={80000} age={28} monthlyExpenses={0} availableMonthly={80000}/>);
    expect(screen.getByText('Enter living expenses')).toBeInTheDocument();
  });
});
