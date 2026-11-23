// India Inflation Data & Future Value Calculations

export interface InflationYear {
  year: number;
  rate: number; // CPI-based inflation rate %
}

// Historical India CPI inflation rates (source: RBI / Ministry of Statistics)
export const indiaInflationHistory: InflationYear[] = [
  { year: 2014, rate: 5.83 },
  { year: 2015, rate: 4.91 },
  { year: 2016, rate: 4.95 },
  { year: 2017, rate: 3.33 },
  { year: 2018, rate: 3.94 },
  { year: 2019, rate: 3.73 },
  { year: 2020, rate: 6.62 },
  { year: 2021, rate: 5.13 },
  { year: 2022, rate: 6.70 },
  { year: 2023, rate: 5.66 },
  { year: 2024, rate: 4.85 },
  { year: 2025, rate: 4.50 },
];

export const averageInflation =
  indiaInflationHistory.reduce((s, y) => s + y.rate, 0) / indiaInflationHistory.length;

// Calculate future value needed to match today's purchasing power
export const futureValue = (presentValue: number, inflationRate: number, years: number): number => {
  return presentValue * Math.pow(1 + inflationRate / 100, years);
};

// Calculate what today's money will be worth in the future
export const futurePurchasingPower = (amount: number, inflationRate: number, years: number): number => {
  return amount / Math.pow(1 + inflationRate / 100, years);
};

// Shared goal catalogue used by both calculator entry and the detailed planner.
export { financialGoals, type FinancialGoal } from './financialGoals';
