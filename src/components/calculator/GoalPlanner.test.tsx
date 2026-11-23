import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import GoalPlanner from './GoalPlanner';

afterEach(cleanup);
describe('automatic planning assumptions',()=>{
  it('fills a car goal, changes return with horizon, and preserves an override until reset',()=>{
    render(<GoalPlanner salary={80000} initialGoal="Buy a car"/>);
    const cost=screen.getByLabelText('Assumed annual cost increase (%)');
    const returns=screen.getByLabelText('Assumed annual investment return (%)');
    const years=screen.getByLabelText('Years until your goal');
    expect(cost).toHaveValue(6);
    expect(returns).toHaveValue(6);
    fireEvent.change(years,{target:{value:'4'}});
    expect(returns).toHaveValue(8);
    fireEvent.change(returns,{target:{value:'7'}});
    fireEvent.change(years,{target:{value:'10'}});
    expect(returns).toHaveValue(7);
    fireEvent.click(screen.getByText(/How these assumptions are chosen/));
    fireEvent.click(screen.getByRole('button',{name:'Reset to planning defaults'}));
    expect(returns).toHaveValue(10);
  });
  it('uses education-specific defaults and does not invent investment gains on debt repayment',()=>{
    render(<GoalPlanner salary={80000} initialGoal="Children’s education"/>);
    expect(screen.getByLabelText('Assumed annual cost increase (%)')).toHaveValue(10);
    expect(screen.getByLabelText('Assumed annual investment return (%)')).toHaveValue(10);
    fireEvent.change(screen.getByLabelText('Choose a financial goal'),{target:{value:'credit_card'}});
    expect(screen.getByLabelText('Assumed annual cost increase (%)')).toHaveValue(0);
    expect(screen.getByLabelText('Assumed annual investment return (%)')).toHaveValue(0);
  });
});
