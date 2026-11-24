import { calculateSip } from './sip';

export function calculateFd(principal: number, annualRate: number, years: number, compoundsPerYear: number) {
  const maturity = principal * Math.pow(1 + annualRate / 100 / compoundsPerYear, years * compoundsPerYear);
  return { principal, interest: maturity - principal, maturity };
}

export function calculateNps(monthlyContribution: number, years: number, annualReturn: number, annuityPercent: number, annuityRate: number) {
  const sip = calculateSip({ monthlyInvestment: monthlyContribution, years, annualReturn, annualStepUp: 0 });
  const annuityAmount = sip.value * annuityPercent / 100;
  return { ...sip, annuityAmount, remainingCorpus: sip.value - annuityAmount, estimatedMonthlyPension: annuityAmount * annuityRate / 100 / 12 };
}
