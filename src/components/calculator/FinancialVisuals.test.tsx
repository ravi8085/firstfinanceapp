import { MemoryRouter } from 'react-router-dom';
import { PlannerSessionProvider } from './PlannerSession';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { AllocationVisual, FundingProgress, MoneyBreakdown } from './FinancialVisuals';
import { investmentCategories } from '@/data/investmentData';
afterEach(cleanup);
describe('financial visual summaries',()=>{
  it('links Term Insurance to a dedicated comparison page',()=>{
    render(<MemoryRouter><PlannerSessionProvider><AllocationVisual categories={investmentCategories} budget={0} totalPercent={80} termProfile={{age:28,salary:80000,monthlyExpenses:30000,dependants:2}}/></PlannerSessionProvider></MemoryRouter>);
    expect(screen.getByRole('link',{name:/Term Insurance Compare plans/})).toHaveAttribute('href','/term-insurance');
    expect(screen.queryByRole('region',{name:'Term insurance plan comparison'})).not.toBeInTheDocument();
  });
  it('labels debt risk and distinguishes protection even with no available budget',()=>{
    render(<MemoryRouter><AllocationVisual categories={investmentCategories} budget={0} totalPercent={80}/></MemoryRouter>);
    expect(screen.getByText('Moderate risk · varies')).toBeInTheDocument();
    expect(screen.getByText('Protection · no market exposure')).toBeInTheDocument();
    expect(screen.getAllByText('High risk')).toHaveLength(2);
    expect(screen.getByRole('link',{name:'Fixed Deposits'})).toHaveAttribute('href','/fixed-deposits');
    expect(screen.getByRole('link',{name:/Open FD rates calculator/})).toHaveAttribute('href','/fixed-deposits');
  });
  it('caps progress at full funding and handles unset targets',()=>{
    const {rerender}=render(<FundingProgress title="Emergency reserve" saved={20000} target={10000}/>);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow','100');
    rerender(<FundingProgress title="Emergency reserve" saved={0} target={0}/>);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
    expect(screen.getByText('Target not set')).toBeInTheDocument();
  });
  it('shows expense shares with readable amounts and excludes zero entries',()=>{
    render(<MoneyBreakdown title="Monthly money" items={[{name:'Rent',value:10000},{name:'Available',value:30000},{name:'Food',value:0}]}/>);
    expect(screen.getByText('25.0%')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.queryByText('Food')).not.toBeInTheDocument();
  });
});
