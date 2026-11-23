import { describe, expect, it } from 'vitest';
import { projectInvestment } from './LandingInvestmentCalculator';

describe('landing investment projection', () => {
  it('separates contributed principal from growth for monthly and annual investments', () => {
    const monthly = projectInvestment(1000, 2, 12, 'monthly');
    const annual = projectInvestment(12000, 2, 12, 'annual');
    expect(monthly.principal).toBe(24000);
    expect(monthly.total).toBeGreaterThan(monthly.principal);
    expect(annual.principal).toBe(24000);
    expect(annual.total).toBeCloseTo(25440, 2);
    expect(projectInvestment(1000, 2, 0, 'monthly')).toEqual({ principal: 24000, growth: 0, total: 24000 });
  });
});
