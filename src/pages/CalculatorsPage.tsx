import { useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, Landmark, TrendingUp, PiggyBank, ChartNoAxesCombined } from 'lucide-react';
import LandingInvestmentCalculator from '@/components/home/LandingInvestmentCalculator';
import SipCalculatorPage from './SipCalculatorPage';
import { calculateFd, calculateNps } from '@/lib/standaloneCalculators';
import './calculators.css';

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const tools = [
  { href: '/fd-calculator', icon: Landmark, title: 'FD calculator', description: 'Estimate a fixed deposit’s maturity value and interest.' },
  { href: '/sip-calculator', icon: TrendingUp, title: 'SIP calculator', description: 'Project monthly investing and see year-by-year growth.' },
  { href: '/nps-calculator', icon: PiggyBank, title: 'NPS calculator', description: 'Explore a retirement corpus and illustrative pension.' },
  { href: '/investment-calculator', icon: ChartNoAxesCombined, title: 'Investment growth', description: 'Compare monthly or annual contributions over time.' },
];

function Shell({ title, eyebrow, description, children, embedded = false }: { title: string; eyebrow: string; description: string; children: ReactNode; embedded?: boolean }) {
  if (embedded) return <>{children}</>;
  return <div className="calc-page"><header className="calc-header"><a className="calc-brand" href="/"><span>च</span><b>chanakya<small>FINANCE, SIMPLIFIED</small></b></a><nav><a href="/calculators">All calculators</a><a href="/"><ArrowLeft size={16}/> Back to Chanakya</a></nav></header><main className="calc-main"><div className="calc-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{children}</main></div>;
}

export default function CalculatorsPage() {
  const [selected, setSelected] = useState('nps');
  const active = tools.find(tool => tool.href === `/${selected}-calculator`) ?? tools[2];
  return <Shell eyebrow="PLAN WITH THE NUMBERS" title="Financial calculators" description="Select a tool on the left and explore your numbers on the right."><div className="calc-selector-layout"><nav className="calc-selector" aria-label="Choose a calculator">{tools.map(({ href, icon: Icon, title }) => { const id = href.replace(/^\//, '').replace('-calculator', ''); return <button type="button" key={href} aria-pressed={selected === id} onClick={() => setSelected(id)}><Icon size={18} strokeWidth={1.8}/><span>{title}</span></button>; })}</nav><section className="calc-preview" aria-live="polite"><div className="calc-preview-heading"><span>SELECTED CALCULATOR</span><h2>{active.title}</h2><p>{active.description}</p></div>{selected === 'fd' ? <FdCalculatorPage embedded /> : selected === 'sip' ? <SipCalculatorPage embedded /> : selected === 'nps' ? <NpsCalculatorPage embedded /> : <InvestmentCalculatorPage embedded />}</section></div><p className="calc-note">All returns and rates are editable illustrations. Actual product terms, charges, taxes, and returns can differ.</p></Shell>;
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
