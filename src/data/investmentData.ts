// Investment data and city expense data for Indian salaried people

export interface InvestmentCategory {
  name: string;
  key: string;
  percentage: number;
  riskLevel: "low" | "medium" | "high";
  color: string;
  description: string;
  expectedReturns: string;
}

export interface LocalityRent {
  locality: string;
  bhk1: string;
  bhk2: string;
  bhk3: string;
}

export interface CityExpense {
  city: string;
  rent: number;
  food: number;
  transport: number;
  utilities: number;
  entertainment: number;
  miscellaneous: number;
  total: number;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  localities: LocalityRent[];
}

export const investmentCategories: InvestmentCategory[] = [
  {
    name: "Fixed Deposits",
    key: "fd",
    percentage: 15,
    riskLevel: "low",
    color: "emerald",
    description: "Safe, guaranteed returns from banks. Ideal for emergency funds and short-term goals.",
    expectedReturns: "6.5% - 7.5% p.a.",
  },
  {
    name: "Mutual Funds (Equity)",
    key: "mf_equity",
    percentage: 25,
    riskLevel: "high",
    color: "sky",
    description: "Diversified equity exposure through SIPs. Best for long-term wealth creation.",
    expectedReturns: "12% - 15% p.a.",
  },
  {
    name: "Mutual Funds (Debt)",
    key: "mf_debt",
    percentage: 10,
    riskLevel: "low",
    color: "navy",
    description: "Stable debt instruments for capital preservation with moderate returns.",
    expectedReturns: "7% - 9% p.a.",
  },
  {
    name: "Term Insurance",
    key: "term",
    percentage: 5,
    riskLevel: "low",
    color: "rose",
    description: "Pure life cover at affordable premiums. Essential for family financial security.",
    expectedReturns: "Protection (10-20x annual income cover)",
  },
  {
    name: "PPF / EPF",
    key: "ppf",
    percentage: 12,
    riskLevel: "low",
    color: "amber",
    description: "Government-backed savings with tax benefits under Section 80C.",
    expectedReturns: "7.1% p.a. (tax-free)",
  },
  {
    name: "Gold / SGBs",
    key: "gold",
    percentage: 5,
    riskLevel: "medium",
    color: "amber",
    description: "Sovereign Gold Bonds for inflation hedge with 2.5% annual interest.",
    expectedReturns: "8% - 10% p.a.",
  },
  {
    name: "Stocks (Direct Equity)",
    key: "stocks",
    percentage: 8,
    riskLevel: "high",
    color: "rose",
    description: "Direct stock investments for experienced investors seeking high growth.",
    expectedReturns: "15% - 20% p.a.",
  },
];

export interface ExperienceGroup {
  label: string;
  key: string;
  minYears: number;
  maxYears: number | null;
  investMinPercent: number;
  investMaxPercent: number;
}

export const experienceGroups: ExperienceGroup[] = [
  { label: "0–5 years", key: "0-5", minYears: 0, maxYears: 5, investMinPercent: 20, investMaxPercent: 30 },
  { label: "6–10 years", key: "6-10", minYears: 6, maxYears: 10, investMinPercent: 25, investMaxPercent: 35 },
  { label: "11–15 years", key: "11-15", minYears: 11, maxYears: 15, investMinPercent: 30, investMaxPercent: 40 },
  { label: "15+ years", key: "15+", minYears: 16, maxYears: null, investMinPercent: 30, investMaxPercent: 40 },
];

export const getRecommendation = (salary: number, age: number, experienceKey: string) => {
  let adjusted = [...investmentCategories.map(c => ({ ...c }))];

  // Age-based risk adjustment
  if (age < 30) {
    const eq = adjusted.find(c => c.key === "mf_equity")!;
    const fd = adjusted.find(c => c.key === "fd")!;
    eq.percentage += 5;
    fd.percentage -= 5;
  } else if (age > 45) {
    const eq = adjusted.find(c => c.key === "mf_equity")!;
    const fd = adjusted.find(c => c.key === "fd")!;
    const debt = adjusted.find(c => c.key === "mf_debt")!;
    eq.percentage -= 8;
    fd.percentage += 5;
    debt.percentage += 3;
  }

  // Experience-based scaling
  const expGroup = experienceGroups.find(g => g.key === experienceKey) || experienceGroups[0];
  const basePercent = adjusted.reduce((s, c) => s + c.percentage, 0);
  const targetPercent = Math.round((expGroup.investMinPercent + expGroup.investMaxPercent) / 2);
  const scale = targetPercent / basePercent;

  adjusted = adjusted.map(c => ({ ...c, percentage: Math.round(c.percentage * scale) }));

  const totalInvestmentPercent = adjusted.reduce((s, c) => s + c.percentage, 0);
  const investmentAmount = (salary * totalInvestmentPercent) / 100;

  return {
    categories: adjusted,
    totalPercent: totalInvestmentPercent,
    totalAmount: investmentAmount,
    savingsPercent: 100 - totalInvestmentPercent,
    savingsAmount: salary - investmentAmount,
    experienceGroup: expGroup,
  };
};

export const cityExpenses: CityExpense[] = [
  {
    city: "Mumbai", rent: 25000, food: 8000, transport: 4000, utilities: 3000, entertainment: 4000, miscellaneous: 3000, total: 47000, tier: "Tier 1",
    localities: [
      { locality: "Andheri West", bhk1: "₹25,000 – ₹35,000", bhk2: "₹40,000 – ₹55,000", bhk3: "₹60,000 – ₹80,000" },
      { locality: "Bandra", bhk1: "₹35,000 – ₹50,000", bhk2: "₹55,000 – ₹75,000", bhk3: "₹80,000 – ₹1,20,000" },
      { locality: "Powai", bhk1: "₹22,000 – ₹30,000", bhk2: "₹35,000 – ₹50,000", bhk3: "₹55,000 – ₹75,000" },
      { locality: "Goregaon", bhk1: "₹18,000 – ₹25,000", bhk2: "₹30,000 – ₹40,000", bhk3: "₹45,000 – ₹60,000" },
      { locality: "Thane", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹32,000", bhk3: "₹35,000 – ₹50,000" },
      { locality: "Navi Mumbai", bhk1: "₹12,000 – ₹18,000", bhk2: "₹20,000 – ₹28,000", bhk3: "₹30,000 – ₹45,000" },
      { locality: "Lower Parel", bhk1: "₹30,000 – ₹45,000", bhk2: "₹50,000 – ₹70,000", bhk3: "₹75,000 – ₹1,00,000" },
      { locality: "Malad", bhk1: "₹16,000 – ₹22,000", bhk2: "₹25,000 – ₹35,000", bhk3: "₹40,000 – ₹55,000" },
    ],
  },
  {
    city: "Delhi NCR", rent: 20000, food: 7000, transport: 3500, utilities: 2800, entertainment: 3500, miscellaneous: 2500, total: 39300, tier: "Tier 1",
    localities: [
      { locality: "Gurgaon (Sector 48-56)", bhk1: "₹18,000 – ₹25,000", bhk2: "₹28,000 – ₹38,000", bhk3: "₹40,000 – ₹55,000" },
      { locality: "Gurgaon (Golf Course Rd)", bhk1: "₹25,000 – ₹35,000", bhk2: "₹40,000 – ₹55,000", bhk3: "₹60,000 – ₹80,000" },
      { locality: "Noida (Sector 62-75)", bhk1: "₹12,000 – ₹18,000", bhk2: "₹18,000 – ₹25,000", bhk3: "₹28,000 – ₹38,000" },
      { locality: "Dwarka", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹30,000", bhk3: "₹32,000 – ₹42,000" },
      { locality: "Saket / Hauz Khas", bhk1: "₹22,000 – ₹30,000", bhk2: "₹35,000 – ₹48,000", bhk3: "₹50,000 – ₹70,000" },
      { locality: "Greater Noida", bhk1: "₹8,000 – ₹12,000", bhk2: "₹12,000 – ₹18,000", bhk3: "₹18,000 – ₹25,000" },
      { locality: "Indirapuram", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹35,000" },
    ],
  },
  {
    city: "Bangalore", rent: 22000, food: 7500, transport: 3000, utilities: 2500, entertainment: 4000, miscellaneous: 2500, total: 41500, tier: "Tier 1",
    localities: [
      { locality: "Whitefield", bhk1: "₹18,000 – ₹25,000", bhk2: "₹28,000 – ₹38,000", bhk3: "₹40,000 – ₹55,000" },
      { locality: "Koramangala", bhk1: "₹22,000 – ₹30,000", bhk2: "₹35,000 – ₹48,000", bhk3: "₹50,000 – ₹65,000" },
      { locality: "HSR Layout", bhk1: "₹20,000 – ₹28,000", bhk2: "₹32,000 – ₹42,000", bhk3: "₹45,000 – ₹58,000" },
      { locality: "Electronic City", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹35,000" },
      { locality: "Marathahalli", bhk1: "₹16,000 – ₹22,000", bhk2: "₹25,000 – ₹32,000", bhk3: "₹35,000 – ₹45,000" },
      { locality: "Indiranagar", bhk1: "₹25,000 – ₹35,000", bhk2: "₹40,000 – ₹55,000", bhk3: "₹55,000 – ₹75,000" },
      { locality: "Sarjapur Road", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹30,000", bhk3: "₹32,000 – ₹42,000" },
      { locality: "Yelahanka", bhk1: "₹10,000 – ₹15,000", bhk2: "₹16,000 – ₹22,000", bhk3: "₹24,000 – ₹32,000" },
    ],
  },
  {
    city: "Hyderabad", rent: 16000, food: 6000, transport: 2500, utilities: 2200, entertainment: 3000, miscellaneous: 2000, total: 31700, tier: "Tier 1",
    localities: [
      { locality: "Gachibowli", bhk1: "₹22,000 – ₹26,000", bhk2: "₹35,000 – ₹40,000", bhk3: "₹50,000 – ₹55,000" },
      { locality: "Hitech City", bhk1: "₹28,000 – ₹32,000", bhk2: "₹40,000 – ₹45,000", bhk3: "₹55,000 – ₹60,000" },
      { locality: "Madhapur", bhk1: "₹24,000 – ₹28,000", bhk2: "₹38,000 – ₹42,000", bhk3: "₹50,000 – ₹57,000" },
      { locality: "Kondapur", bhk1: "₹18,000 – ₹22,000", bhk2: "₹28,000 – ₹32,000", bhk3: "₹40,000 – ₹45,000" },
      { locality: "Kokapet", bhk1: "₹24,000 – ₹28,000", bhk2: "₹35,000 – ₹40,000", bhk3: "₹47,000 – ₹52,000" },
      { locality: "Kukatpally", bhk1: "₹16,000 – ₹20,000", bhk2: "₹24,000 – ₹28,000", bhk3: "₹33,000 – ₹38,000" },
      { locality: "Miyapur", bhk1: "₹14,000 – ₹18,000", bhk2: "₹22,000 – ₹26,000", bhk3: "₹30,000 – ₹35,000" },
      { locality: "Nizampet", bhk1: "₹10,000 – ₹14,000", bhk2: "₹15,000 – ₹18,000", bhk3: "₹22,000 – ₹27,000" },
      { locality: "Narsingi", bhk1: "₹14,000 – ₹18,000", bhk2: "₹22,000 – ₹26,000", bhk3: "₹30,000 – ₹35,000" },
      { locality: "Uppal / Nagole", bhk1: "₹9,000 – ₹13,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹18,000 – ₹22,000" },
      { locality: "LB Nagar / Meerpet", bhk1: "₹10,000 – ₹15,000", bhk2: "₹15,000 – ₹20,000", bhk3: "₹20,000 – ₹28,000" },
    ],
  },
  {
    city: "Chennai", rent: 17000, food: 6500, transport: 2800, utilities: 2300, entertainment: 3000, miscellaneous: 2000, total: 33600, tier: "Tier 1",
    localities: [
      { locality: "OMR (Sholinganallur)", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹30,000", bhk3: "₹32,000 – ₹42,000" },
      { locality: "Velachery", bhk1: "₹16,000 – ₹22,000", bhk2: "₹24,000 – ₹32,000", bhk3: "₹35,000 – ₹45,000" },
      { locality: "T. Nagar", bhk1: "₹18,000 – ₹25,000", bhk2: "₹28,000 – ₹38,000", bhk3: "₹40,000 – ₹52,000" },
      { locality: "Adyar", bhk1: "₹20,000 – ₹28,000", bhk2: "₹30,000 – ₹42,000", bhk3: "₹45,000 – ₹58,000" },
      { locality: "Porur / Ramapuram", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹35,000" },
      { locality: "Tambaram", bhk1: "₹8,000 – ₹12,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹28,000" },
    ],
  },
  {
    city: "Pune", rent: 18000, food: 6500, transport: 2500, utilities: 2200, entertainment: 3500, miscellaneous: 2000, total: 34700, tier: "Tier 1",
    localities: [
      { locality: "Hinjewadi", bhk1: "₹16,000 – ₹22,000", bhk2: "₹24,000 – ₹32,000", bhk3: "₹35,000 – ₹45,000" },
      { locality: "Kharadi", bhk1: "₹18,000 – ₹24,000", bhk2: "₹28,000 – ₹36,000", bhk3: "₹38,000 – ₹50,000" },
      { locality: "Baner", bhk1: "₹18,000 – ₹25,000", bhk2: "₹28,000 – ₹38,000", bhk3: "₹40,000 – ₹52,000" },
      { locality: "Viman Nagar", bhk1: "₹16,000 – ₹22,000", bhk2: "₹25,000 – ₹32,000", bhk3: "₹35,000 – ₹45,000" },
      { locality: "Wakad", bhk1: "₹14,000 – ₹18,000", bhk2: "₹20,000 – ₹28,000", bhk3: "₹30,000 – ₹40,000" },
      { locality: "Hadapsar", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹34,000" },
      { locality: "Koregaon Park", bhk1: "₹22,000 – ₹30,000", bhk2: "₹35,000 – ₹48,000", bhk3: "₹50,000 – ₹65,000" },
    ],
  },
  {
    city: "Kolkata", rent: 14000, food: 5500, transport: 2000, utilities: 2000, entertainment: 2500, miscellaneous: 1800, total: 27800, tier: "Tier 1",
    localities: [
      { locality: "Salt Lake (Sector V)", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹30,000", bhk3: "₹32,000 – ₹42,000" },
      { locality: "New Town / Rajarhat", bhk1: "₹12,000 – ₹18,000", bhk2: "₹18,000 – ₹25,000", bhk3: "₹26,000 – ₹35,000" },
      { locality: "Park Street", bhk1: "₹18,000 – ₹25,000", bhk2: "₹28,000 – ₹38,000", bhk3: "₹40,000 – ₹55,000" },
      { locality: "Howrah", bhk1: "₹8,000 – ₹12,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹28,000" },
      { locality: "Garia / Jadavpur", bhk1: "₹10,000 – ₹14,000", bhk2: "₹16,000 – ₹22,000", bhk3: "₹24,000 – ₹32,000" },
    ],
  },
  {
    city: "Ahmedabad", rent: 13000, food: 5000, transport: 2000, utilities: 2000, entertainment: 2500, miscellaneous: 1500, total: 26000, tier: "Tier 2",
    localities: [
      { locality: "SG Highway", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹30,000", bhk3: "₹32,000 – ₹42,000" },
      { locality: "Prahlad Nagar", bhk1: "₹16,000 – ₹22,000", bhk2: "₹25,000 – ₹32,000", bhk3: "₹35,000 – ₹45,000" },
      { locality: "Satellite", bhk1: "₹14,000 – ₹18,000", bhk2: "₹20,000 – ₹28,000", bhk3: "₹30,000 – ₹40,000" },
      { locality: "Bopal", bhk1: "₹10,000 – ₹14,000", bhk2: "₹15,000 – ₹20,000", bhk3: "₹22,000 – ₹30,000" },
      { locality: "Maninagar", bhk1: "₹8,000 – ₹12,000", bhk2: "₹12,000 – ₹16,000", bhk3: "₹18,000 – ₹24,000" },
    ],
  },
  {
    city: "Jaipur", rent: 11000, food: 4500, transport: 1800, utilities: 1800, entertainment: 2000, miscellaneous: 1500, total: 22600, tier: "Tier 2",
    localities: [
      { locality: "Malviya Nagar", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹34,000" },
      { locality: "Vaishali Nagar", bhk1: "₹10,000 – ₹14,000", bhk2: "₹16,000 – ₹22,000", bhk3: "₹24,000 – ₹30,000" },
      { locality: "Mansarovar", bhk1: "₹8,000 – ₹12,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹26,000" },
      { locality: "C-Scheme", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹30,000", bhk3: "₹32,000 – ₹40,000" },
      { locality: "Jagatpura", bhk1: "₹7,000 – ₹10,000", bhk2: "₹12,000 – ₹16,000", bhk3: "₹18,000 – ₹24,000" },
    ],
  },
  {
    city: "Lucknow", rent: 10000, food: 4000, transport: 1500, utilities: 1500, entertainment: 1800, miscellaneous: 1200, total: 20000, tier: "Tier 2",
    localities: [
      { locality: "Gomti Nagar", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹34,000" },
      { locality: "Hazratganj", bhk1: "₹10,000 – ₹14,000", bhk2: "₹16,000 – ₹22,000", bhk3: "₹24,000 – ₹30,000" },
      { locality: "Aliganj", bhk1: "₹8,000 – ₹12,000", bhk2: "₹12,000 – ₹16,000", bhk3: "₹18,000 – ₹24,000" },
      { locality: "Indira Nagar", bhk1: "₹9,000 – ₹13,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹26,000" },
    ],
  },
  {
    city: "Chandigarh", rent: 12000, food: 5000, transport: 1800, utilities: 1800, entertainment: 2200, miscellaneous: 1500, total: 24300, tier: "Tier 2",
    localities: [
      { locality: "Sector 17-22", bhk1: "₹14,000 – ₹20,000", bhk2: "₹22,000 – ₹30,000", bhk3: "₹32,000 – ₹42,000" },
      { locality: "Sector 34-38", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹34,000" },
      { locality: "Mohali (Phase 5-8)", bhk1: "₹10,000 – ₹14,000", bhk2: "₹16,000 – ₹22,000", bhk3: "₹24,000 – ₹30,000" },
      { locality: "Zirakpur", bhk1: "₹8,000 – ₹12,000", bhk2: "₹12,000 – ₹16,000", bhk3: "₹18,000 – ₹24,000" },
      { locality: "Panchkula", bhk1: "₹10,000 – ₹14,000", bhk2: "₹15,000 – ₹20,000", bhk3: "₹22,000 – ₹28,000" },
    ],
  },
  {
    city: "Indore", rent: 8000, food: 3500, transport: 1200, utilities: 1200, entertainment: 1500, miscellaneous: 1000, total: 16400, tier: "Tier 3",
    localities: [
      { locality: "Vijay Nagar", bhk1: "₹10,000 – ₹14,000", bhk2: "₹16,000 – ₹20,000", bhk3: "₹22,000 – ₹28,000" },
      { locality: "Palasia", bhk1: "₹8,000 – ₹12,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹26,000" },
      { locality: "Nipania", bhk1: "₹7,000 – ₹10,000", bhk2: "₹12,000 – ₹15,000", bhk3: "₹18,000 – ₹22,000" },
      { locality: "Super Corridor", bhk1: "₹9,000 – ₹13,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹26,000" },
    ],
  },
  {
    city: "Bhopal", rent: 7500, food: 3500, transport: 1200, utilities: 1200, entertainment: 1500, miscellaneous: 1000, total: 15900, tier: "Tier 3",
    localities: [
      { locality: "MP Nagar", bhk1: "₹10,000 – ₹14,000", bhk2: "₹15,000 – ₹20,000", bhk3: "₹22,000 – ₹28,000" },
      { locality: "Arera Colony", bhk1: "₹9,000 – ₹12,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹25,000" },
      { locality: "Hoshangabad Road", bhk1: "₹7,000 – ₹10,000", bhk2: "₹12,000 – ₹15,000", bhk3: "₹18,000 – ₹22,000" },
      { locality: "Kolar Road", bhk1: "₹6,000 – ₹9,000", bhk2: "₹10,000 – ₹14,000", bhk3: "₹16,000 – ₹20,000" },
    ],
  },
  {
    city: "Coimbatore", rent: 9000, food: 4000, transport: 1500, utilities: 1500, entertainment: 1800, miscellaneous: 1200, total: 19000, tier: "Tier 2",
    localities: [
      { locality: "RS Puram", bhk1: "₹12,000 – ₹16,000", bhk2: "₹18,000 – ₹24,000", bhk3: "₹26,000 – ₹34,000" },
      { locality: "Saravanampatti", bhk1: "₹8,000 – ₹12,000", bhk2: "₹14,000 – ₹18,000", bhk3: "₹20,000 – ₹26,000" },
      { locality: "Peelamedu", bhk1: "₹9,000 – ₹13,000", bhk2: "₹15,000 – ₹20,000", bhk3: "₹22,000 – ₹28,000" },
      { locality: "Singanallur", bhk1: "₹7,000 – ₹10,000", bhk2: "₹12,000 – ₹16,000", bhk3: "₹18,000 – ₹24,000" },
    ],
  },
];

export const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const riskColors: Record<string, string> = {
  low: "emerald",
  medium: "amber",
  high: "rose",
};
