import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, ShieldCheck } from 'lucide-react';
import { investmentDirectory, type InvestmentGroup } from '@/data/investmentDirectory';
import './investments.css';

const groups: Array<'All' | InvestmentGroup> = ['All', 'Deposits & savings', 'Government & retirement', 'Market investments', 'Property & gold'];

export default function InvestmentsPage() {
  const [group, setGroup] = useState<(typeof groups)[number]>('All');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => investmentDirectory.filter(option =>
    (group === 'All' || option.group === group) &&
    `${option.name} ${option.offeredBy} ${option.howItWorks}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [group, query]);

  return <main className="investment-directory">
    <header className="directory-hero">
      <div className="directory-kicker">INVESTMENT DIRECTORY · INDIA</div>
      <h1>Find the right questions for every investment.</h1>
      <p>Explore deposits, government schemes, funds, shares, gold and property. Compare how each works, who offers it and what to check before choosing.</p>
      <div className="directory-stats"><span><strong>{investmentDirectory.length}</strong> investment types</span><span><strong>4</strong> categories</span><span><ShieldCheck size={18} /> Official learning sources</span></div>
    </header>
    <section className="directory-content" aria-label="Browse investment types">
      <div className="directory-controls"><label className="directory-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search investment types or institutions</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search investments or institutions" /></label><div className="directory-filters" aria-label="Filter investment types">{groups.map(item => <button key={item} type="button" aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</button>)}</div></div>
      <p className="directory-context">Educational directory, not a product recommendation or a complete list of every institution. Rates, fees, eligibility and tax rules can change. Check the current product document with its provider. Risk labels are broad guides; mutual funds have scheme-specific SEBI Riskometers.</p>
      <div className="directory-grid">{visible.map(option => <article className="directory-card" key={option.name}><div className="directory-card-top"><span>{option.group}</span><span className={`directory-risk risk-${option.risk.toLowerCase()}`}>{option.risk} risk</span></div><h2>{option.name}</h2><p>{option.howItWorks}</p><dl><div><dt>Offered through</dt><dd>{option.offeredBy}</dd></div><div><dt>Access to money</dt><dd>{option.access}</dd></div><div><dt>What to check</dt><dd>{option.keyConsideration}</dd></div></dl><a href={option.sourceUrl} target="_blank" rel="noopener noreferrer">{option.sourceLabel} <ArrowUpRight size={16} aria-hidden="true" /></a></article>)}</div>
      {visible.length === 0 && <p className="directory-empty">No matching investment type. Try a broader term or select All.</p>}
      <p className="directory-context">Banks and asset managers include many providers, such as SBI, HDFC Bank, ICICI Bank and SEBI-regulated fund houses. Product availability and terms vary by institution. The links above lead to official regulator or scheme information; compare individual provider documents before acting.</p>
    </section>
  </main>;
}
