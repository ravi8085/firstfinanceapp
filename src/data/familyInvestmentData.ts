// Family-oriented investment instruments for married individuals

export interface FamilyInstrument {
  name: string;
  category: string;
  riskLevel: "low" | "medium" | "high";
  color: string;
  provider: string;
  expectedReturns: string;
  description: string;
  bestFor: string;
  minInvestment?: string;
  lockIn?: string;
  taxBenefit?: string;
}

export const familyInstruments: FamilyInstrument[] = [
  // Children's Education
  {
    name: "Sukanya Samriddhi Yojana (SSY)",
    category: "Children's Education",
    riskLevel: "low",
    color: "rose",
    provider: "Post Office / Bank",
    expectedReturns: "8.2% p.a. (tax-free)",
    description: "Government scheme for girl child. One of the highest interest rates among small savings. Matures when daughter turns 21.",
    bestFor: "Girl child's education & marriage",
    minInvestment: "₹250/year",
    lockIn: "Until girl turns 21",
    taxBenefit: "Section 80C (EEE status)",
  },
  {
    name: "Children's Mutual Fund",
    category: "Children's Education",
    riskLevel: "medium",
    color: "sky",
    provider: "AMCs (HDFC, SBI, ICICI)",
    expectedReturns: "12%–15% p.a.",
    description: "Equity-oriented funds with a 5-year lock-in designed for children's future. SIP from ₹500/month.",
    bestFor: "Long-term education corpus",
    minInvestment: "₹500/month SIP",
    lockIn: "5 years",
    taxBenefit: "LTCG up to ₹1.25L tax-free",
  },
  {
    name: "Post Office RD (Recurring Deposit)",
    category: "Children's Education",
    riskLevel: "low",
    color: "amber",
    provider: "India Post",
    expectedReturns: "6.7% p.a.",
    description: "Safe monthly savings instrument. Great for building a small education fund with guaranteed returns.",
    bestFor: "Short-term school fees fund",
    minInvestment: "₹100/month",
    lockIn: "5 years",
  },
  {
    name: "PPF (Public Provident Fund)",
    category: "Children's Education",
    riskLevel: "low",
    color: "emerald",
    provider: "Post Office / Bank",
    expectedReturns: "7.1% p.a. (tax-free)",
    description: "Open a PPF account in child's name for long-term education planning. Tax-free maturity after 15 years.",
    bestFor: "College education corpus",
    minInvestment: "₹500/year",
    lockIn: "15 years",
    taxBenefit: "Section 80C (EEE status)",
  },
  // Family Protection
  {
    name: "Term Life Insurance",
    category: "Family Protection",
    riskLevel: "low",
    color: "rose",
    provider: "LIC, HDFC Life, ICICI Pru",
    expectedReturns: "Pure protection (no maturity benefit)",
    description: "Essential for sole breadwinners. Get 15–20x annual income as cover. Cheapest form of life insurance.",
    bestFor: "Income replacement for family",
    minInvestment: "₹500–₹1,500/month",
    taxBenefit: "Section 80C",
  },
  {
    name: "Family Health Insurance (Floater)",
    category: "Family Protection",
    riskLevel: "low",
    color: "sky",
    provider: "Star Health, HDFC Ergo, Niva Bupa",
    expectedReturns: "Medical expense coverage",
    description: "Family floater plan covering spouse and children. Get ₹10L–₹25L cover with maternity, newborn cover.",
    bestFor: "Medical emergencies & hospitalization",
    minInvestment: "₹1,000–₹2,500/month",
    taxBenefit: "Section 80D (₹25K self + ₹25K parents)",
  },
  {
    name: "Child Insurance Plan (ULIP)",
    category: "Family Protection",
    riskLevel: "medium",
    color: "navy",
    provider: "LIC, SBI Life, Max Life",
    expectedReturns: "8%–12% p.a.",
    description: "Insurance + investment combo. Waiver of premium if parent passes away. Fund continues for child's education.",
    bestFor: "Education guarantee with life cover",
    minInvestment: "₹2,000/month",
    lockIn: "5 years",
    taxBenefit: "Section 80C",
  },
  {
    name: "Critical Illness Cover",
    category: "Family Protection",
    riskLevel: "low",
    color: "amber",
    provider: "HDFC Ergo, ICICI Lombard",
    expectedReturns: "Lump-sum on diagnosis",
    description: "Pays lump-sum on diagnosis of critical illness (cancer, heart attack). Covers income loss during treatment.",
    bestFor: "Financial safety net during illness",
    minInvestment: "₹400–₹800/month",
    taxBenefit: "Section 80D",
  },
  // Wealth Building for Family
  {
    name: "ELSS Mutual Funds",
    category: "Wealth Building",
    riskLevel: "high",
    color: "sky",
    provider: "Mirae, Quant, Parag Parikh",
    expectedReturns: "14%–18% p.a.",
    description: "Tax-saving equity funds with just 3-year lock-in. Best risk-reward ratio among 80C instruments.",
    bestFor: "Tax saving + wealth creation",
    minInvestment: "₹500/month SIP",
    lockIn: "3 years",
    taxBenefit: "Section 80C (up to ₹1.5L)",
  },
  {
    name: "Sovereign Gold Bonds (SGB)",
    category: "Wealth Building",
    riskLevel: "medium",
    color: "amber",
    provider: "RBI (via banks/post office)",
    expectedReturns: "Gold price appreciation + 2.5% p.a.",
    description: "Government gold bonds with annual interest. No storage worries. Tax-free on maturity after 8 years.",
    bestFor: "Daughter's wedding / inflation hedge",
    minInvestment: "1 gram gold (~₹6,500)",
    lockIn: "8 years (exit after 5)",
    taxBenefit: "Tax-free on maturity",
  },
  {
    name: "National Savings Certificate (NSC)",
    category: "Wealth Building",
    riskLevel: "low",
    color: "emerald",
    provider: "India Post",
    expectedReturns: "7.7% p.a.",
    description: "Government-backed 5-year savings certificate. Interest compounded annually. Safe and guaranteed.",
    bestFor: "Medium-term guaranteed savings",
    minInvestment: "₹1,000",
    lockIn: "5 years",
    taxBenefit: "Section 80C",
  },
  {
    name: "Senior Citizen Savings Scheme (SCSS)",
    category: "Wealth Building",
    riskLevel: "low",
    color: "navy",
    provider: "Post Office / Bank",
    expectedReturns: "8.2% p.a.",
    description: "For parents aged 60+. Quarterly interest payout. Help your parents invest their retirement corpus safely.",
    bestFor: "Parents' retirement income",
    minInvestment: "₹1,000",
    lockIn: "5 years",
    taxBenefit: "Section 80C",
  },
  {
    name: "Balanced Advantage Fund",
    category: "Wealth Building",
    riskLevel: "medium",
    color: "sky",
    provider: "HDFC, ICICI Pru, Edelweiss",
    expectedReturns: "10%–13% p.a.",
    description: "Dynamically shifts between equity and debt based on market conditions. Lower volatility than pure equity.",
    bestFor: "Family emergency corpus growth",
    minInvestment: "₹1,000/month SIP",
    taxBenefit: "LTCG benefits after 1 year",
  },
];

export const getFamilyRecommendations = (salary: number, hasChildren: boolean) => {
  const educationBudget = hasChildren ? Math.round(salary * 0.1) : Math.round(salary * 0.05);
  const protectionBudget = Math.round(salary * 0.08);
  const wealthBudget = Math.round(salary * 0.07);

  return {
    educationBudget,
    protectionBudget,
    wealthBudget,
    totalFamilyBudget: educationBudget + protectionBudget + wealthBudget,
    educationInstruments: familyInstruments.filter(i => i.category === "Children's Education"),
    protectionInstruments: familyInstruments.filter(i => i.category === "Family Protection"),
    wealthInstruments: familyInstruments.filter(i => i.category === "Wealth Building"),
  };
};
