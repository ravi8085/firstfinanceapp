import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import { PlannerSessionProvider, usePlannerSession } from '@/components/calculator/PlannerSession';
import TermInsurancePage from './TermInsurancePage';
afterEach(cleanup);
function CalculatorStub(){
  const {details,setDetails,step,setStep,setInsurance}=usePlannerSession();
  return <><span>Salary {details.salary}; step {step}</span><button onClick={()=>{setDetails(old=>({...old,salary:80000}));setStep(2);}}>Enter calculator details</button><Link to="/term-insurance" onClick={()=>setInsurance({profile:{age:28,salary:details.salary,monthlyExpenses:30000,dependants:2},premiumBudget:800})}>Compare term plans</Link></>;
}
describe('dedicated term insurance page',()=>{
  it('carries the profile and preserves calculator state on return',()=>{
    render(<MemoryRouter initialEntries={['/calculator']}><PlannerSessionProvider><Routes><Route path="/calculator" element={<CalculatorStub/>}/><Route path="/term-insurance" element={<TermInsurancePage/>}/></Routes></PlannerSessionProvider></MemoryRouter>);
    fireEvent.click(screen.getByRole('button',{name:'Enter calculator details'}));
    fireEvent.click(screen.getByRole('link',{name:'Compare term plans'}));
    expect(screen.getByRole('heading',{name:'Term insurance comparison'})).toBeInTheDocument();
    expect(screen.getByLabelText('Requested life cover (₹)')).toHaveValue(14500000);
    fireEvent.click(screen.getByRole('link',{name:'Back to my money plan'}));
    expect(screen.getByText('Salary 80000; step 2')).toBeInTheDocument();
  });
  it('supports a direct visit without inventing a customer profile',()=>{
    render(<MemoryRouter><PlannerSessionProvider><TermInsurancePage/></PlannerSessionProvider></MemoryRouter>);
    expect(screen.getByLabelText('Customer age')).toHaveValue(null);
    expect(screen.queryByRole('region',{name:'Term insurance plan comparison'})).not.toBeInTheDocument();
  });
});
