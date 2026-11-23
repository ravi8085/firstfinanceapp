import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type Term = 12 | 24 | 36 | 60;
type Rate = { general: number; senior: number };
type Bank = { name: string; type: string; source: string; effective: string; rates: Record<Term, Rate> };

// Retail resident deposits below ₹3 crore. Values are tied to each bank's published schedule.
const banks: Bank[] = [
  { name: 'State Bank of India', type: 'Public sector', source: 'https://sbi.bank.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits?inheritRedirect=true', effective: '15 Dec 2025 · checked 23 Nov 2026', rates: {
    12: { general: 6.25, senior: 6.75 }, 24: { general: 6.40, senior: 6.90 },
    36: { general: 6.30, senior: 6.80 }, 60: { general: 6.05, senior: 7.05 },
  } },
  { name: 'IDFC FIRST Bank', type: 'Private sector', source: 'https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/interest-rate/Interest-Rates-on-Retail-Deposits-4th-November-2026.pdf', effective: '4 Nov 2026', rates: {
    12: { general: 6.50, senior: 6.75 }, 24: { general: 7.25, senior: 7.50 },
    36: { general: 7.10, senior: 7.35 }, 60: { general: 6.75, senior: 7.00 },
  } },
];

const otherBanks = [
  ['HDFC Bank', 'https://www.hdfcbank.com/personal/save/deposits/fixed-deposit-interest-rate'],
  ['ICICI Bank', 'https://www.icicibank.com/personal-banking/deposits/fixed-deposit/fd-interest-rates'],
  ['Axis Bank', 'https://www.axisbank.com/retail/deposits/fixed-deposits/interest-rates'],
  ['Kotak Mahindra Bank', 'https://www.kotak.com/en/rates/interest-rates.html'],
  ['Bank of Baroda', 'https://bankofbaroda.in/interest-rate-and-service-charges/deposits-interest-rates'],
  ['Punjab National Bank', 'https://www.pnbindia.in/interest-rates.html'],
  ['Canara Bank', 'https://canarabank.com/pages/deposit-interest-rates'],
  ['Union Bank of India', 'https://www.unionbankofindia.bank.in/en/common/interest-rates'],
] as const;

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const maturityAmount = (principal: number, annualRate: number, months: number) => principal * Math.pow(1 + annualRate / 400, months / 3);

export default function FixedDepositsPage() {
  const [principal, setPrincipal] = useState(100000);
  const [term, setTerm] = useState<Term>(12);
  const [senior, setSenior] = useState(false);
  const offers = useMemo(() => banks.map(bank => {
    const rate = bank.rates[term][senior ? 'senior' : 'general'];
    const maturity = maturityAmount(principal, rate, term);
    return { ...bank, rate, maturity, interest: maturity - principal };
  }).sort((a, b) => b.maturity - a.maturity), [principal, term, senior]);

  return <main className="term-insurance-page fd-page">
    <Link to="/calculator" className="cf-text-button">← Back to money plan</Link>
    <div className="planner-heading"><span className="cf-eyebrow">BANK DEPOSITS</span><h1>Fixed deposit rates calculator</h1><p>See what verified bank rate schedules offer for the same deposit and tenure.</p></div>
    <section className="planner-card fd-controls" aria-label="Deposit calculator inputs">
      <label>Deposit amount (₹)<input type="number" min="1000" max="29999999" step="1000" value={principal} onChange={event => setPrincipal(Math.max(0, Math.min(29999999, Number(event.target.value) || 0)))} /></label>
      <label>Duration<select value={term} onChange={event => setTerm(Number(event.target.value) as Term)}><option value="12">1 year</option><option value="24">2 years</option><option value="36">3 years</option><option value="60">5 years</option></select></label>
      <label>Customer category<select value={senior ? 'senior' : 'general'} onChange={event => setSenior(event.target.value === 'senior')}><option value="general">General</option><option value="senior">Senior citizen</option></select></label>
    </section>
    <div className="fd-result-summary"><strong>{money(principal)}</strong><span>deposit for {term / 12} {term === 12 ? 'year' : 'years'}</span><b>{senior ? 'Senior citizen rates' : 'General rates'}</b></div>
    <section className="fd-offers" aria-label="Bank fixed deposit offers">{offers.map((offer, index) => <article className="fd-offer" key={offer.name}>
      <div><span className="fd-rank">{index === 0 ? 'Highest shown' : offer.type}</span><h2>{offer.name}</h2><p>{offer.effective}</p></div>
      <div className="fd-offer-numbers"><div><small>Annual interest rate</small><strong>{offer.rate.toFixed(2)}%</strong></div><div><small>Estimated interest</small><strong>{money(offer.interest)}</strong></div><div><small>Estimated maturity</small><strong>{money(offer.maturity)}</strong></div></div>
      <a href={offer.source} target="_blank" rel="noopener noreferrer">View official bank rate schedule ↗</a>
    </article>)}</section>
    <p className="cf-notice">These are published snapshot rates, not live quotes. The calculator assumes a cumulative FD with quarterly compounding. Actual maturity can vary with booking date, day count, payout choice, taxes, and the bank's terms. Check the linked schedule before opening a deposit.</p>
    <details className="fd-other-banks"><summary>Other bank rate schedules</summary><p>We have not verified matching rates for these banks, so they are not included in the calculated ranking.</p><div>{otherBanks.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noopener noreferrer">{name} ↗</a>)}</div></details>
  </main>;
}
