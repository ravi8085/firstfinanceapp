import { financialGoals, goalProjection, type FinancialGoal } from '@/data/financialGoals';
import { getGoalAssumptions } from '@/data/goalAssumptions';

export interface GoalJourneyInput { key: string; target: number; years: number; saved: number; monthly: number; risk: 'steady' | 'balanced' | 'growth' }
export const goalByName = (name: string) => financialGoals.find(goal => goal.name === name) ?? financialGoals[0];
export const initialGoalJourney = (goal: FinancialGoal): GoalJourneyInput => ({ key: goal.key, target: 0, years: goal.defaultYearsAway, saved: 0, monthly: 0, risk: 'balanced' });

export function goalQuestion(goal: FinancialGoal) {
  if (goal.kind === 'protection') return 'Desired life cover (₹)';
  if (goal.key === 'home') return 'Home down payment and purchase costs today (₹)';
  if (goal.group === 'Debt freedom') return 'Amount needed to clear this debt (₹)';
  if (goal.key === 'emergency') return 'Emergency fund target (₹)';
  if (goal.key.includes('retirement')) return 'Retirement corpus target in today’s rupees (₹)';
  if (goal.group === 'Education & career') return 'Estimated education or career cost today (₹)';
  if (goal.key === 'car' || goal.key === 'two_wheeler') return 'Vehicle budget or down payment today (₹)';
  return 'Estimated goal cost today (₹)';
}

export function investmentRoutes(goal: FinancialGoal, years: number, risk: GoalJourneyInput['risk']) {
  if (goal.kind === 'protection') return [{ name: 'Term life cover', risk: 'Protection', why: 'Compare a policy’s cover, premium, exclusions and claim terms; this is not an investment.', href: '/term-insurance' }];
  if (goal.group === 'Debt freedom') return [{ name: 'Repayment plan', risk: 'No investment', why: 'Check lender charges and interest before diverting money to a new investment.', href: '/knowledge' }];
  if (goal.key.includes('retirement')) return [{ name: 'NPS and EPF', risk: 'Product-specific', why: 'Explore retirement-focused accounts, eligibility, allocation and withdrawal rules.', href: '/investments' }, { name: 'PPF and diversified funds', risk: 'Lower to higher', why: 'Compare long-term saving with market-linked growth according to your comfort with losses.', href: '/investments' }];
  if (years <= 1 || ['emergency','tax','annual_bills'].includes(goal.key)) return [{ name: 'Savings or sweep-in deposit', risk: 'Lower risk', why: 'Prioritise access to money needed soon; compare bank terms and deposit protection.', href: '/investments' }, { name: 'Short bank FD', risk: 'Lower risk', why: 'A possible match for a known date if early withdrawal terms are acceptable.', href: '/fixed-deposits' }];
  if (years <= 3 || risk === 'steady') return [{ name: 'Bank FD or recurring deposit', risk: 'Lower risk', why: 'Compare maturity with your goal date and check premature closure terms.', href: '/fixed-deposits' }, { name: 'Short-duration debt fund', risk: 'Varies by scheme', why: 'Explore only after reviewing credit, duration and the scheme Riskometer.', href: '/investments' }];
  if (years <= 7 || risk === 'balanced') return [{ name: 'Bank deposits / high-quality debt', risk: 'Lower to varying', why: 'Keep the part needed near the goal date in more stable, accessible options.', href: '/investments' }, { name: 'Hybrid or multi-asset fund', risk: 'Varies by scheme', why: 'May add growth exposure; value can fall, so compare the specific scheme and costs.', href: '/investments' }];
  return [{ name: 'Diversified equity mutual fund or ETF', risk: 'Higher risk', why: 'A long horizon may allow growth exposure, but losses are possible and returns are not assured.', href: '/investments' }, { name: 'PPF, NPS or debt allocation', risk: 'Product-specific', why: 'Compare lock-in, eligibility and withdrawal rules; NPS is retirement-focused.', href: '/investments' }];
}

export function buildGoalJourney(goal: FinancialGoal, input: GoalJourneyInput, availableMonthly: number) {
  const { inflationRate, annualReturn } = getGoalAssumptions(goal, input.years);
  const debt = goal.group === 'Debt freedom';
  const protection = goal.kind === 'protection';
  const rate = debt || protection || ['emergency','tax','annual_bills'].includes(goal.key) || input.risk === 'steady' ? 0 : annualReturn;
  const inflation = debt || protection ? 0 : inflationRate;
  const projection = goalProjection(input.target, input.years, inflation, rate, input.saved);
  const monthlyCapacity = Math.max(0, Math.min(input.monthly || availableMonthly, availableMonthly));
  const monthlyRate = Math.pow(1 + rate / 100, 1 / 12) - 1;
  let monthsAtCapacity: number | null = null;
  if (!protection && input.target > 0 && monthlyCapacity > 0) {
    let balance = input.saved;
    for (let month = 0; month <= 600; month++) {
      const movingTarget = input.target * Math.pow(1 + inflation / 100, month / 12);
      if (balance >= movingTarget) { monthsAtCapacity = month; break; }
      balance = balance * (1 + monthlyRate) + monthlyCapacity;
    }
  }
  const routeYears = monthsAtCapacity === null ? input.years : Math.min(input.years, Math.max(1, Math.ceil(monthsAtCapacity / 12)));
  return { inflation, rate, projection, monthlyCapacity, monthsAtCapacity, routes: investmentRoutes(goal, routeYears, input.risk) };
}
\n
