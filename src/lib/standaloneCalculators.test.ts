import { describe, expect, it } from 'vitest';
import { calculateFd, calculateNps } from './standaloneCalculators';

describe('standalone calculators', () => {
  it('calculates quarterly compounded FD interest', () => {
    const result = calculateFd(100000, 8, 1, 4);
    expect(result.maturity).toBeCloseTo(108243.216);
    expect(result.interest).toBeCloseTo(8243.216);
  });

  it('splits the projected NPS corpus and estimates annuity income', () => {
    const result = calculateNps(1000, 1, 0, 40, 6);
    expect(result.value).toBe(12000);
    expect(result.annuityAmount).toBe(4800);
    expect(result.remainingCorpus).toBe(7200);
    expect(result.estimatedMonthlyPension).toBe(24);
  });
});
