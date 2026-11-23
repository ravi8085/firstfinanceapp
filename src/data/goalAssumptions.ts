import type { FinancialGoal } from './financialGoals';

export const assumptionsReviewed = '23 November 2026';
export const assumptionSources = [
  {name:'RBI inflation framework',url:'https://www.rbi.org.in/Scripts/AnnualReportPublications.aspx?Id=1463',note:'4% CPI target, with a 2–6% tolerance band. Our 6% general planning buffer is a product assumption, not an RBI forecast.'},
  {name:'SBI deposit rates',url:'https://sbi.bank.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits',note:'Deposit rates provide context for a 6% short-horizon scenario; actual rates depend on tenure and can change.'},
  {name:'NSE Indices 2026 research',url:'https://www.niftyindices.com/docs/default-source/indices/nifty-50/nifty-50-whitepaper_2026.pdf',note:'Historical equity returns inform the long-horizon scenario; they do not predict future returns.'},
  {name:'HDFC Mutual Fund inflation calculator',url:'https://www.hdfcfund.com/calculators/inflation-calculator',note:'Uses 10% education inflation in an illustration; this is not an official education forecast.'},
  {name:'Aon India 2026 medical trend',url:'https://www.aon.com/apac/in-the-press/asia-newsroom/2025/india-outpaces-global-average-with-2026-medical-trend-at-11-5-percent-aon-reports',note:'11.5% medical trend for 2026 is used as a planning scenario, not a forecast for every future year.'},
];

export function getGoalAssumptions(goal: FinancialGoal, years: number) {
  const debt = goal.group==='Debt freedom';
  const protection = goal.kind==='protection';
  const education = ['education','own_education','study_abroad','skills','career_change'].includes(goal.key);
  const medical = ['health','parents','disability','pets'].includes(goal.key);
  const fixed = ['tax','annual_bills'].includes(goal.key);
  const safety = ['emergency','insurance','career_break'].includes(goal.key);
  const inflationRate = debt || protection || fixed ? 0 : education ? 10 : medical ? 11.5 : 6;
  const annualReturn = debt || protection || years<=0 ? 0 : safety || fixed || years<=3 ? 6 : years<=7 ? 8 : 10;
  const costBasis = debt ? 'Debt uses your current repayment target. Interest and lender charges must be included in that amount.' : protection ? 'Protection is a cover-gap comparison.' : fixed ? 'A known bill or tax target is kept at its entered amount; adjust if it will change.' : education ? '10% education-cost scenario.' : medical ? '11.5% care-cost scenario, anchored to Aon’s India 2026 medical trend.' : '6% general cost buffer, above the RBI’s 4% CPI target.';
  const returnBasis = debt ? '0% return: debt repayment is not modelled as investing.' : years<=0 || protection ? '0% return for an immediate requirement or protection comparison.' : annualReturn===6 ? '6% cash/deposit-style scenario for short horizons or safety reserves.' : annualReturn===8 ? '8% blended-asset scenario for a 4–7 year horizon.' : '10% equity-oriented scenario for horizons beyond 7 years; market losses remain possible.';
  return {inflationRate,annualReturn,costBasis,returnBasis};
}
