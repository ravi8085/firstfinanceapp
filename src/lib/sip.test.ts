import { describe, expect, it } from 'vitest';
import { calculateSip } from './sip';

describe('calculateSip', () => {
  it('returns principal when expected return is zero', () => {
    const result = calculateSip({ monthlyInvestment: 5000, years: 10, annualReturn: 0, annualStepUp: 0 });
    expect(result.invested).toBe(600000);
    expect(result.value).toBe(600000);
    expect(result.gains).toBe(0);
    expect(result.timeline).toHaveLength(10);
  });

  it('applies annual step-ups after each completed year', () => {
    const result = calculateSip({ monthlyInvestment: 1000, years: 2, annualReturn: 0, annualStepUp: 10 });
    expect(result.invested).toBeCloseTo(25200);
  });

  it('compounds existing value before adding each month-end contribution', () => {
    const result = calculateSip({ monthlyInvestment: 1000, years: 1, annualReturn: 12, annualStepUp: 0 });
    expect(result.value).toBeCloseTo(12682.503, 2);
  });
});
