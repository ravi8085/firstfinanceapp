import { describe, expect, it } from 'vitest';
import { calculateRetirement, type RetirementInputs } from './retirement';
const input:RetirementInputs={currentAge:30,retirementAge:60,yearsInRetirement:25,monthlyExpenses:20000,inflation:6,annualReturn:10,retirementReturn:6,existingCorpus:0,monthlyContribution:0};
describe('retirement contribution requirement',()=>{
  it('solves the monthly amount that funds the target',()=>{
    const result=calculateRetirement(input);
    expect(result.requiredMonthly).toBeGreaterThan(0);
    const funded=calculateRetirement({...input,monthlyContribution:result.requiredMonthly!});
    expect(funded.projectedCorpus).toBeCloseTo(result.requiredCorpus,4);
    expect(funded.additionalMonthly).toBeCloseTo(0,6);
  });
  it('uses entered expenses and a 25-year spending factor when retirement return equals inflation',()=>{
    const result=calculateRetirement(input);
    expect(result.requiredCorpus).toBeCloseTo(20000*Math.pow(1.06,30)*12*25,4);
  });
  it('accounts for existing corpus and handles zero return',()=>{
    const result=calculateRetirement({...input,currentAge:59,retirementAge:60,yearsInRetirement:1,inflation:0,annualReturn:0,retirementReturn:0,existingCorpus:120000});
    expect(result.requiredCorpus).toBe(240000);
    expect(result.requiredMonthly).toBe(10000);
  });
  it('shows a lump sum rather than a zero monthly recommendation when retirement begins now',()=>{
    const result=calculateRetirement({...input,currentAge:60,retirementAge:60});
    expect(result.requiredMonthly).toBeNull();
    expect(result.gap).toBeGreaterThan(0);
  });
  it('does not require new contributions when existing savings cover the target',()=>{
    expect(calculateRetirement({...input,existingCorpus:1e9}).requiredMonthly).toBe(0);
  });
});
