import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, ShieldCheck } from 'lucide-react';
import { investmentDirectory, type InvestmentGroup } from '@/data/investmentDirectory';
import investmentHeroImage from '@/assets/marketing/investment-horizons-hero.webp';
import './investments.css';

const groups: Array<'All' | InvestmentGroup> = ['All', 'Deposits & savings', 'Government & retirement', 'Market investments', 'Property & gold'];
const horizons = [
  { period: 'Under 1 year', title: 'Keep options open', examples: 'Savings accounts · sweep-in FDs · liquid funds', risk: 'Lower to varying risk', note: 'For money you may need soon. Check access and fund-specific risk.' },
  { period: '1–3 years', title: 'Plan the next step', examples: 'Bank FDs · recurring deposits · Treasury bills · short-duration debt funds', risk: 'Lower to varying risk', note: 'Compare maturity dates, withdrawal rules and credit or interest-rate risk.' },
  { period: '3–5 years', title: 'Balance growth and access', examples: 'Hybrid funds · multi-asset funds · REITs', risk: 'Varying risk', note: 'Values can move. Match any product to the goal and its actual terms.' },
  { period: '5+ years', title: 'Give big goals time', examples: 'Diversified equity funds · NPS for retirement · PPF', risk: 'Product-specific risk', note: 'Longer time can help planning, but returns are never guaranteed.' },
];

export default function InvestmentsPage() {
  const [group, setGroup] = useState<(typeof groups)[number]>('All');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => investmentDirectory.filter(option =>
    (group === 'All' || option.group === group) &&
    `${option.name} ${option.offeredBy} ${option.howItWorks}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [group, query]);

  return <main className="investment-directory">
    <header className="directory-hero">
      <img className="directory-hero-art" src={investmentHeroImage} alt="Illustrated journey from short-term savings through balanced investing to long-term family goals" />
      <div className="directory-hero-copy"><div className="directory-kicker">THE INDIAN INVESTMENT JOURNEY</div>
        <h1>Every goal has a timeline. Explore what fits.</h1>
        <p>From money you may need soon to goals years away, explore investment types by time horizon, risk and access to your money.</p>
        <div className="directory-stats"><span><strong>{investmentDirectory.length}</strong> investment types</span><span><strong>4</strong> time horizons</span><span><ShieldCheck size={18} /> Official learning sources</span></div>
      </div>
    </header>
    <section className="investment-horizons" aria-labelledby="investment-horizons-title"><div className="horizons-heading"><span>TIME · RISK · GOALS</span><h2 id="investment-horizons-title">A clearer way to explore your options</h2><p>Examples are for learning, not fixed return forecasts or personal recommendations.</p></div><div className="horizons-grid">{horizons.map((item, index) => <article className="horizon-card" key={item.period}><div className="horizon-number">0{index + 1}</div><span className="horizon-period">{item.period}</span><h3>{item.title}</h3><p className="horizon-examples">{item.examples}</p><span className="horizon-risk">{item.risk}</span><p className="horizon-note">{item.note}</p></article>)}</div></section>
    <section className="directory-content" aria-label="Browse investment types">
      <div className="directory-controls"><label className="directory-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search investment types or institutions</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search investments or institutions" /></label><div className="directory-filters" aria-label="Filter investment types">{groups.map(item => <button key={item} type="button" aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div></div>
      <p className="directory-context">Educational directory, not a product recommendation or a complete list of every institution. Rates, fees, eligibility and tax rules can change. Check the current product document with its provider. Risk labels are broad guides; mutual funds have scheme-specific SEBI Riskometers.</p>
      <div className="directory-grid">{visible.map(option => <article className="directory-card" key={option.name}><div className="directory-card-top"><span>{option.group}</span><span className={`directory-risk risk-${option.risk.toLowerCase()}`}>{option.risk} risk</span></div><h2>{option.name}</h2><p>{option.howItWorks}</p><dl><div><dt>Offered through</dt><dd>{option.offeredBy}</dd></div><div><dt>Access to money</dt><dd>{option.access}</dd></div><div><dt>What to check</dt><dd>{option.keyConsideration}</dd></div></dl><a href={option.sourceUrl} target="_blank" rel="noopener noreferrer">{option.sourceLabel} <ArrowUpRight size={16} aria-hidden="true" /></a></article>)}</div>
      {visible.length === 0 && <p className="directory-empty">No matching investment type. Try a broader term or select All.</p>}
      <p className="directory-context">Banks and asset managers include many providers, such as SBI, HDFC Bank, ICICI Bank and SEBI-regulated fund houses. Product availability and terms vary by institution. The links above lead to official regulator or scheme information; compare individual provider documents before acting.</p>
    </section>
  </main>;
}
