import { describe, expect, it } from 'vitest';
import { planChecks, protectionGap, termPlans } from './termPlans';
describe('term plan comparison',()=>{
  it('checks known age boundaries without approving eligibility',()=>{
    const plan=termPlans.find(plan=>plan.id==='lic')!;
    expect(planChecks(plan,28,10000000,65,'India resident','Salaried')[0]).toContain('not acceptance');
    expect(planChecks(plan,70,10000000,80,'India resident','Salaried')[0]).toContain('Outside published');
    expect(planChecks(plan,28,1000000,65,'India resident','Salaried')).toContain('Requested cover is below the published minimum.');
  });
  it('applies the explicitly published NRI age exception',()=>{
    const plan=termPlans.find(plan=>plan.id==='icici')!;
    expect(planChecks(plan,20,10000000,65,'NRI','Salaried')[0]).toContain('Outside published');
  });
  it('calculates a needs scenario and never a negative protection gap',()=>{
    expect(protectionGap(30000,20,2000000,1000000,500000,1000000)).toBe(8700000);
    expect(protectionGap(10000,1,0,0,1000000,1000000)).toBe(0);
  });
});
