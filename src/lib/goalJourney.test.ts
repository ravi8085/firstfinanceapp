import { describe, expect, it } from 'vitest';
import { financialGoals } from '@/data/financialGoals';
import { buildGoalJourney, initialGoalJourney, investmentRoutes } from './goalJourney';

const goal = (key: string) => financialGoals.find(item => item.key === key)!;

describe('goal journey', () => {
  it('shows a home saving amount, indicative time, and options that fit the actual timeline', () => {
    const input = { ...initialGoalJourney(goal('home')), target: 1_000_000, years: 5, saved: 200_000, monthly: 30_000 };
    const result = buildGoalJourney(goal('home'), input, 35_000);
    expect(result.projection.futureCost).toBeGreaterThan(input.target);
    expect(result.projection.monthly).toBeGreaterThan(0);
    expect(result.monthsAtCapacity).toBeGreaterThan(0);
    expect(result.monthsAtCapacity).toBeLessThan(60);
    expect(result.routes[0].name).toMatch(/Bank FD|Bank deposits/);
  });

  it('does not treat debt repayment or life cover as an investment', () => {
    const debt = buildGoalJourney(goal('credit_card'), { ...initialGoalJourney(goal('credit_card')), target: 100_000 }, 10_000);
    expect(debt.rate).toBe(0);
    expect(debt.routes[0].risk).toBe('No investment');
    expect(investmentRoutes(goal('family_security'), 0, 'balanced')[0].risk).toBe('Protection');
  });

  it('limits an entered monthly contribution to the actual surplus', () => {
    const result = buildGoalJourney(goal('car'), { ...initialGoalJourney(goal('car')), target: 500_000, monthly: 30_000 }, 8_000);
    expect(result.monthlyCapacity).toBe(8_000);
  });
});
\n
