import { describe, expect, it } from 'vitest';
import { financialGoals, goalProjection } from './financialGoals';

describe('goal funding scenarios',()=>{
  it('supports the major life goals and an extensible custom goal',()=>{
    expect(financialGoals.length).toBeGreaterThan(40);
    expect(new Set(financialGoals.map(g=>g.key)).size).toBe(financialGoals.length);
    expect(financialGoals.find(g=>g.key==='custom')?.kind).toBe('custom');
  });
  it('calculates a zero-return savings goal after existing savings',()=>{
    const result=goalProjection(120000,1,0,0,24000);
    expect(result.monthly).toBe(8000);
    expect(result.futureCost).toBe(120000);
  });
  it('shows an immediate funding gap rather than a zero monthly requirement',()=>{
    expect(goalProjection(100000,0,5,8,20000)).toMatchObject({months:0,gap:80000,monthly:0});
  });
  it('accounts for growth of money already reserved',()=>{
    const result=goalProjection(110000,1,0,10,100000);
    expect(result.gap).toBeCloseTo(0,5);
    expect(result.monthly).toBeCloseTo(0,5);
  });
});
