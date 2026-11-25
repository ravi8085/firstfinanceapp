import { useMemo, useState } from 'react';
import { BookOpen, Search, ArrowUpRight } from 'lucide-react';
import { groups } from '@/components/home/FinancialInstruments';
import { investmentKnowledge } from '@/data/investmentKnowledge';
import { investmentDirectory } from '@/data/investmentDirectory';

const categoryUse: Record<string,string> = {
  'Deposits & savings': 'May suit a savings target when its maturity and access rules match when you need the money.',
  'Government & retirement': 'May support a long-term goal when you meet eligibility and can accept its withdrawal rules.',
  'Market investments': 'May add market exposure when the time horizon and risk fit your goal.',
  'Property & gold': 'May diversify holdings, but access, costs and price changes need care.',
};
const broadEntries = groups.flatMap(group => group.instruments.map(instrument => ({ ...instrument, group: group.title, ...investmentKnowledge[instrument.name] })));
const entries = [...broadEntries, ...investmentDirectory.filter(option => !broadEntries.some(item => item.name.toLowerCase()===option.name.toLowerCase())).map(option => ({ name: option.name, group: option.group, risk: option.risk, definition: option.howItWorks, why: `${categoryUse[option.group]} ${option.keyConsideration}` }))];

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const visible = useMemo(() => entries.filter(item => (category==='All'||item.group===category) && `${item.name} ${item.definition} ${item.why} ${item.risk}`.toLowerCase().includes(query.toLowerCase().trim())), [category,query]);
  return <main className="knowledge-page">
    <header className="knowledge-hero"><div className="knowledge-hero-icon"><BookOpen size={35} aria-hidden="true" /></div><span className="campaign-copy-kicker">LEARN BEFORE YOU CHOOSE</span><h1>Investment knowledge base</h1><p>Plain-language definitions, useful situations and broad risk levels for the financial options shown in Chanakya.</p><div className="knowledge-hero-orbs" aria-hidden="true"><i /><i /><i /></div></header>
    <section className="knowledge-content" aria-label="Investment definitions"><div className="knowledge-controls"><label><Search size={18} aria-hidden="true" /><span className="sr-only">Search investment definitions</span><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search an investment type or idea" /></label><div className="knowledge-filters" aria-label="Filter by category">{['All',...groups.map(group=>group.title)].map(item=><button type="button" key={item} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div></div>
      <p className="knowledge-count">Showing {visible.length} of {entries.length} topics</p><div className="knowledge-grid">{visible.map(item=><article className="knowledge-card" key={item.name}><div className="knowledge-card-top"><span>{item.group}</span><span className={`knowledge-risk risk-${item.risk.toLowerCase().replace(' ','-')}`}>{item.risk==='Protection'?'Protection only':`${item.risk} risk`}</span></div><h2>{item.name}</h2><h3>What it is</h3><p>{item.definition}</p><h3>When it may help</h3><p>{item.why}</p></article>)}</div>{visible.length===0&&<p className="knowledge-empty">No matching topic. Try another word or choose All.</p>}
      <div className="knowledge-sources"><h2>Learn from official sources</h2><a href="https://investor.sebi.gov.in/investment-assetclasses.html" target="_blank" rel="noopener noreferrer">SEBI investment asset classes <ArrowUpRight size={16} /></a><a href="https://investor.sebi.gov.in/riskometer.html" target="_blank" rel="noopener noreferrer">SEBI mutual fund Riskometer <ArrowUpRight size={16} /></a><a href="https://www.indiapost.gov.in/banking-services/savings" target="_blank" rel="noopener noreferrer">India Post savings schemes <ArrowUpRight size={16} /></a><a href="https://npstrust.org.in/" target="_blank" rel="noopener noreferrer">NPS Trust <ArrowUpRight size={16} /></a><p>These broad descriptions are for learning. Actual risks, eligibility, charges, access and tax treatment depend on the current product documents. A mutual fund’s scheme-specific Riskometer gives more detail than a broad category label.</p></div>
    </section>
  </main>;
}
