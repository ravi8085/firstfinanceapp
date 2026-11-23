export type SipInputs = {
  monthlyInvestment: number;
  years: number;
  annualReturn: number;
  annualStepUp: number;
};

export type SipYear = { year: number; invested: number; value: number; gains: number };

export function calculateSip({ monthlyInvestment, years, annualReturn, annualStepUp }: SipInputs) {
  const months = Math.round(Math.max(1, years) * 12);
  const monthlyRate = Math.max(0, annualReturn) / 1200;
  const stepRate = Math.max(0, annualStepUp) / 100;
  let invested = 0;
  let value = 0;
  const timeline: SipYear[] = [];

  for (let month = 1; month <= months; month++) {
    const yearIndex = Math.floor((month - 1) / 12);
    const contribution = Math.max(0, monthlyInvestment) * Math.pow(1 + stepRate, yearIndex);
    value = value * (1 + monthlyRate) + contribution;
    invested += contribution;
    if (month % 12 === 0) timeline.push({ year: month / 12, invested, value, gains: value - invested });
  }

  return { invested, value, gains: value - invested, timeline };
}
