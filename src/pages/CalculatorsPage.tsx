import { useState } from 'react';
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Activity, Bike, Calculator, Car, ChartNoAxesCombined, HeartPulse, Landmark, PiggyBank, Plane, ShieldCheck, TrendingUp } from 'lucide-react';
import LandingInvestmentCalculator from '@/components/home/LandingInvestmentCalculator';
import PublicHeader from '@/components/PublicHeader';
import SipCalculatorPage from './SipCalculatorPage';
import { calculateFd, calculateNps } from '@/lib/standaloneCalculators';
import './calculators.css';

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
type CalculatorTool = { id: string; href?: string; group?: string; icon: LucideIcon; title: string; description: string };
const tools: CalculatorTool[] = [
  { id: 'fd', href: '/fd-calculator', group: 'Investment Calculators', icon: Landmark, title: 'FD calculator', description: 'Estimate a fixed deposit’s maturity value and interest.' },
  { id: 'sip', href: '/sip-calculator', group: 'Investment Calculators', icon: TrendingUp, title: 'SIP calculator', description: 'Project monthly investing and see year-by-year growth.' },
  { id: 'nps', href: '/nps-calculator', group: 'Investment Calculators', icon: PiggyBank, title: 'NPS calculator', description: 'Explore a retirement corpus and illustrative pension.' },
  { id: 'investment', href: '/investment-calculator', group: 'Investment Calculators', icon: ChartNoAxesCombined, title: 'Investment growth', description: 'Compare monthly or annual contributions over time.' },
  { id: 'bmi', group: 'Fitness Calculators', icon: Activity, title: 'BMI calculator', description: 'Estimate body mass index from height and weight.' },
  { id: 'tax', icon: Calculator, title: 'Income Tax Calculator', description: 'Estimate tax using your own effective tax rate and deductions.' },
  { id: 'term', icon: ShieldCheck, title: 'Term Insurance Calculator', description: 'Estimate a life-cover gap and an assumption-based monthly budget.' },
  { id: 'emi', icon: Calculator, title: 'EMI Calculator', description: 'Estimate monthly loan payments and total interest.' },
  { id: 'lic', icon: ShieldCheck, title: 'LIC Calculator', description: 'Estimate premiums from a rate you enter; not an LIC quote.' },
  { id: 'life', icon: ShieldCheck, title: 'Life Insurance Calculator', description: 'Estimate an annual premium from cover and a rate assumption.' },
  { id: 'health', icon: HeartPulse, title: 'Health Insurance Calculator', description: 'Estimate a premium using your own per-person rate.' },
  { id: 'travel', icon: Plane, title: 'Travel Insurance Calculator', description: 'Build a trip premium estimate from days and people.' },
  { id: 'car', icon: Car, title: 'Car Insurance Calculator', description: 'Estimate a basic premium from vehicle value and rate.' },
  { id: 'bike', icon: Bike, title: 'Bike Insurance Calculator', description: 'Estimate a basic premium from vehicle value and rate.' },
];

function Shell({ title, eyebrow, description, children, embedded = false }: { title: string; eyebrow: string; description: string; children: ReactNode; embedded?: boolean }) {
  if (embedded) return <>{children}</>;
  return <div className="calc-page"><PublicHeader /><main className="calc-main"><div className="calc-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</main></div>;
}

export default function CalculatorsPage() {
  const [selected, setSelected] = useState('nps');
  const active = tools.find(tool => tool.id === selected) ?? tools[2];
  const investmentTools = tools.filter(tool => tool.group === 'Investment Calculators');
  const fitnessTools = tools.filter(tool => tool.group === 'Fitness Calculators');
  const otherTools = tools.filter(tool => !tool.group);
  const renderTool = ({ id, icon: Icon, title }: CalculatorTool) => <button type="button" key={id} aria-pressed={selected === id} onClick={() => setSelected(id)}><Icon size={18} strokeWidth={1.8}/><span>{title}</span></button>;
  return <Shell eyebrow="PLAN WITH THE NUMBERS" title="Financial calculators" description="Choose a calculator and explore your numbers in this window."><div className="calc-selector-layout"><nav className="calc-selector" aria-label="Choose a calculator"><details className="calc-selector-group" open><summary><ChartNoAxesCombined size={18}/><span>Investment Calculators</span></summary>{investmentTools.map(renderTool)}</details><details className="calc-selector-group" open><summary><Activity size={18}/><span>Fitness Calculators</span></summary>{fitnessTools.map(renderTool)}</details><div className="calc-selector-standalone">{otherTools.map(renderTool)}</div></nav><section className="calc-preview" aria-live="polite"><div className="calc-preview-heading"><span>SELECTED CALCULATOR</span><h2>{active.title}</h2><p>{active.description}</p></div>{selected === 'fd' ? <FdCalculatorPage embedded /> : selected === 'sip' ? <SipCalculatorPage embedded /> : selected === 'nps' ? <NpsCalculatorPage embedded /> : selected === 'investment' ? <InvestmentCalculatorPage embedded /> : <UtilityCalculator key={selected} id={selected} />}</section></div><p className="calc-note">Calculations are estimates based on the values and assumptions you enter. Insurance results are not insurer quotes; confirm current product terms and rates with the provider.</p></Shell>;
}

type UtilityId = 'bmi' | 'tax' | 'term' | 'emi' | 'lic' | 'life' | 'health' | 'travel' | 'car' | 'bike';
type FieldSpec = { key: string; label: string; initial: number; step?: number; min?: number };
const utilityFields: Record<UtilityId, FieldSpec[]> = {
  bmi: [{ key: 'weight', label: 'Weight (kg)', initial: 68, step: 0.1 }, { key: 'height', label: 'Height (cm)', initial: 170, step: 0.1 }],
  tax: [{ key: 'income', label: 'Annual income (₹)', initial: 1200000, step: 10000 }, { key: 'deductions', label: 'Deductions to include (₹)', initial: 0, step: 10000 }, { key: 'rate', label: 'Estimated effective tax rate (%)', initial: 10, step: 0.5 }],
  term: [{ key: 'income', label: 'Annual income (₹)', initial: 1200000, step: 10000 }, { key: 'existing', label: 'Existing life cover (₹)', initial: 0, step: 100000 }, { key: 'rate', label: 'Assumed monthly cost per ₹1 lakh cover (₹)', initial: 8, step: 1 }],
  emi: [{ key: 'principal', label: 'Loan amount (₹)', initial: 2500000, step: 50000 }, { key: 'rate', label: 'Annual interest rate (%)', initial: 9, step: 0.1 }, { key: 'years', label: 'Loan term (years)', initial: 20, step: 1 }],
  lic: [{ key: 'cover', label: 'Sum assured (₹)', initial: 1000000, step: 100000 }, { key: 'rate', label: 'Assumed annual premium per ₹1,000 cover (₹)', initial: 50, step: 1 }, { key: 'years', label: 'Premium-paying years', initial: 20, step: 1 }],
  life: [{ key: 'cover', label: 'Life cover (₹)', initial: 5000000, step: 100000 }, { key: 'rate', label: 'Assumed annual premium per ₹1 lakh cover (₹)', initial: 600, step: 25 }],
  health: [{ key: 'cover', label: 'Health cover per person (₹)', initial: 1000000, step: 100000 }, { key: 'people', label: 'People covered', initial: 2, step: 1, min: 1 }, { key: 'rate', label: 'Assumed annual premium per person (₹)', initial: 4000, step: 250 }],
  travel: [{ key: 'days', label: 'Trip length (days)', initial: 10, step: 1, min: 1 }, { key: 'people', label: 'Travellers', initial: 1, step: 1, min: 1 }, { key: 'rate', label: 'Assumed premium per person per day (₹)', initial: 80, step: 5 }],
  car: [{ key: 'value', label: 'Vehicle value / IDV (₹)', initial: 800000, step: 10000 }, { key: 'rate', label: 'Assumed basic annual rate (%)', initial: 2.5, step: 0.1 }],
  bike: [{ key: 'value', label: 'Vehicle value / IDV (₹)', initial: 100000, step: 5000 }, { key: 'rate', label: 'Assumed basic annual rate (%)', initial: 2, step: 0.1 }],
};

function UtilityCalculator({ id }: { id: string }) {
  const calculatorId = id as UtilityId;
  const fields = utilityFields[calculatorId];
  const [values, setValues] = useState<Record<string, number>>(() => Object.fromEntries(fields.map(field => [field.key, field.initial])));
  const value = (key: string) => values[key] ?? 0;
  const setValue = (key: string, next: number) => setValues(current => ({ ...current, [key]: Math.max(0, next || 0) }));
  let resultLabel = 'Estimated amount';
  let result = 0;
  let details: { label: string; amount: string | number }[] = [];
  let note = 'Illustration only. Actual product pricing, eligibility, fees and taxes may differ.';
  if (calculatorId === 'bmi') { resultLabel = 'Body mass index'; result = value('weight') / Math.max((value('height') / 100) ** 2, 0.01); const category = result < 18.5 ? 'Below the commonly used adult range' : result < 25 ? 'Within the commonly used adult range' : result < 30 ? 'Above the commonly used adult range' : 'High range'; details = [{ label: 'Category estimate', amount: category }]; note = 'BMI is a general screening measure, not a diagnosis. It may not fit every person or age group.'; }
  if (calculatorId === 'tax') { const taxable = Math.max(0, value('income') - value('deductions')); resultLabel = 'Estimated annual tax'; result = taxable * value('rate') / 100; details = [{ label: 'Income after entered deductions', amount: taxable }, { label: 'Estimated monthly take-home after this tax', amount: (value('income') - result) / 12 }]; note = 'Uses only the effective tax rate you enter. It does not apply tax slabs, rebates, cess or current tax rules.'; }
  if (calculatorId === 'term') { const coverGap = Math.max(0, value('income') * 10 - value('existing')); resultLabel = 'Illustrative cover gap'; result = coverGap; details = [{ label: 'Simple income-based cover target (10× income)', amount: value('income') * 10 }, { label: 'Assumed monthly premium budget', amount: coverGap / 100000 * value('rate') }]; note = 'The 10× income figure is a rough starting illustration, not a personal recommendation. Premium uses your own editable rate and is not an insurer quote.'; }
  if (calculatorId === 'emi') { const months = Math.max(1, value('years') * 12); const monthlyRate = value('rate') / 1200; resultLabel = 'Estimated monthly EMI'; result = monthlyRate ? value('principal') * monthlyRate * (1 + monthlyRate) ** months / ((1 + monthlyRate) ** months - 1) : value('principal') / months; details = [{ label: 'Total repayment', amount: result * months }, { label: 'Total interest', amount: result * months - value('principal') }]; note = 'Estimate excludes fees, insurance, rate changes and lender-specific repayment rules.'; }
  if (calculatorId === 'lic') { resultLabel = 'Illustrative annual premium'; result = value('cover') / 1000 * value('rate'); details = [{ label: 'Total paid over entered premium years', amount: result * value('years') }, { label: 'Sum assured entered', amount: value('cover') }]; note = 'Uses only your entered premium rate. LIC premiums vary by plan, age, term, riders and underwriting; this is not an LIC quote.'; }
  if (calculatorId === 'life') { resultLabel = 'Illustrative annual premium'; result = value('cover') / 100000 * value('rate'); details = [{ label: 'Life cover entered', amount: value('cover') }, { label: 'Illustrative monthly equivalent', amount: result / 12 }]; note = 'Assumption-based estimate only. Real premiums depend on age, health, tobacco use, term, riders and insurer underwriting.'; }
  if (calculatorId === 'health') { resultLabel = 'Illustrative annual premium'; result = value('people') * value('rate'); details = [{ label: 'People covered', amount: value('people') }, { label: 'Cover per person entered', amount: value('cover') }]; note = 'Uses your entered per-person rate; actual family-floater and individual policy prices differ by age, city, cover and insurer.'; }
  if (calculatorId === 'travel') { resultLabel = 'Illustrative trip premium'; result = value('days') * value('people') * value('rate'); details = [{ label: 'Trip length', amount: value('days') }, { label: 'Travellers', amount: value('people') }]; note = 'Uses your entered daily rate only. Actual cover, destination, age, activities and insurer terms change the premium.'; }
  if (calculatorId === 'car' || calculatorId === 'bike') { resultLabel = 'Illustrative annual base premium'; result = value('value') * value('rate') / 100; details = [{ label: 'Vehicle value / IDV entered', amount: value('value') }, { label: 'Rate assumption', amount: `${value('rate')}%` }]; note = 'Basic estimate only; it excludes taxes, add-ons, discounts, vehicle details, location and insurer pricing. Not a quote.'; }
  const isCategory = calculatorId === 'bmi';
  return <div className="calc-workspace"><section className="calc-form"><h2>Enter your assumptions</h2>{fields.map(field => <label key={field.key}>{field.label}<input type="number" min={field.min ?? 0} step={field.step ?? 1} value={value(field.key)} onChange={event => setValue(field.key, Number(event.target.value))}/></label>)}</section><section className="calc-results" aria-live="polite"><span>{resultLabel}</span><strong>{isCategory ? result.toFixed(1) : money(result)}</strong>{details.map(({ label, amount }) => <div className="calc-result-row" key={label}><span>{label}</span><b>{typeof amount === 'number' ? money(amount) : amount}</b></div>)}<p>{note}</p></section></div>;
}

export function FdCalculatorPage({ embedded = false }: { embedded?: boolean }) {
  const [principal, setPrincipal] = useState(100000);
  const [annualRate, setAnnualRate] = useState(7);
  const [years, setYears] = useState(3);
  const [frequency, setFrequency] = useState(4);
  const result = calculateFd(principal, annualRate, years, frequency);
  return <Shell embedded={embedded} eyebrow="FIXED DEPOSIT" title="FD calculator" description="Estimate how a one-time fixed deposit could grow at a rate you enter."><div className="calc-workspace"><section className="calc-form"><h2>Deposit details</h2><label>Deposit amount (₹)<input type="number" min="0" max="100000000" value={principal} onChange={e => setPrincipal(Math.max(0, Number(e.target.value) || 0))}/></label><label>Annual interest rate (%)<input type="number" min="0" max="30" step="0.1" value={annualRate} onChange={e => setAnnualRate(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}/></label><label>Duration (years)<input type="number" min="0.25" max="40" step="0.25" value={years} onChange={e => setYears(Math.max(0.25, Math.min(40, Number(e.target.value) || 0.25)))}/></label><label>Interest compounding<select value={frequency} onChange={e => setFrequency(Number(e.target.value))}><option value="1">Yearly</option><option value="2">Half-yearly</option><option value="4">Quarterly</option><option value="12">Monthly</option></select></label></section><section className="calc-results" aria-live="polite"><span>Estimated maturity value</span><strong>{money(result.maturity)}</strong><div className="calc-result-row"><span>Amount deposited</span><b>{money(result.principal)}</b></div><div className="calc-result-row"><span>Estimated interest</span><b>{money(result.interest)}</b></div><div className="calc-result-bar"><i style={{width:`${result.maturity ? principal/result.maturity*100 : 100}%`}}/></div><p>Formula: principal × (1 + annual rate ÷ compounding periods)<sup>years × periods</sup>.</p></section></div><p className="calc-note">Enter the bank’s current rate and compounding method from its official deposit schedule. This estimate excludes tax, TDS, premature withdrawal penalties, and special product terms.</p></Shell>;
}

export function NpsCalculatorPage({ embedded = false }: { embedded?: boolean }) {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(25);
  const [annualReturn, setAnnualReturn] = useState(9);
  const [annuityPercent, setAnnuityPercent] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);
  const result = calculateNps(monthly, years, annualReturn, annuityPercent, annuityRate);
  return <Shell embedded={embedded} eyebrow="RETIREMENT PLANNING" title="NPS calculator" description="Explore a National Pension System contribution scenario and an illustrative annuity payout."><div className="calc-workspace"><section className="calc-form"><h2>Retirement assumptions</h2><label>Monthly contribution (₹)<input type="number" min="0" max="10000000" step="500" value={monthly} onChange={e => setMonthly(Math.max(0, Number(e.target.value) || 0))}/></label><label>Years until withdrawal<input type="number" min="1" max="50" value={years} onChange={e => setYears(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}/></label><label>Assumed annual return (%)<input type="number" min="0" max="30" step="0.5" value={annualReturn} onChange={e => setAnnualReturn(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}/></label><label>Corpus allocated to annuity (%)<input type="number" min="0" max="100" step="5" value={annuityPercent} onChange={e => setAnnuityPercent(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}/></label><label>Assumed annuity payout rate (%)<input type="number" min="0" max="20" step="0.5" value={annuityRate} onChange={e => setAnnuityRate(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}/></label></section><section className="calc-results" aria-live="polite"><span>Projected retirement corpus</span><strong>{money(result.value)}</strong><div className="calc-result-row"><span>Total contributions</span><b>{money(result.invested)}</b></div><div className="calc-result-row"><span>Illustrative growth</span><b>{money(result.gains)}</b></div><div className="calc-result-row"><span>Allocated to annuity</span><b>{money(result.annuityAmount)}</b></div><div className="calc-result-row"><span>Remaining corpus</span><b>{money(result.remainingCorpus)}</b></div><div className="calc-pension"><span>Illustrative monthly pension</span><strong>{money(result.estimatedMonthlyPension)}</strong></div></section></div><p className="calc-note">Illustration only. Contributions occur at each month’s end. Investment return and annuity payout rate are user-entered assumptions, not guaranteed NPS or insurer rates. Actual withdrawal, annuity, tax, and eligibility rules depend on your account and current regulations; verify them before acting.</p></Shell>;
}

export function InvestmentCalculatorPage({ embedded = false }: { embedded?: boolean }) {
  return <Shell embedded={embedded} eyebrow="INVESTMENT GROWTH" title="Investment calculator" description="Estimate the outcome of monthly or annual contributions using a return you choose."><LandingInvestmentCalculator /></Shell>;
}
