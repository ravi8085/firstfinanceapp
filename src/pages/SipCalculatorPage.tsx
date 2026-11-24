import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { calculateSip } from '@/lib/sip';
import './sip-calculator.css';

const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export default function SipCalculatorPage({ embedded = false }: { embedded?: boolean }) {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [years, setYears] = useState(15);
  const [annualReturn, setAnnualReturn] = useState(10);
  const [annualStepUp, setAnnualStepUp] = useState(0);
  const result = useMemo(() => calculateSip({ monthlyInvestment, years, annualReturn, annualStepUp }), [monthlyInvestment, years, annualReturn, annualStepUp]);
  const investedShare = result.value > 0 ? result.invested / result.value * 100 : 100;
  const maxValue = result.value || 1;

  return <div className={embedded ? 'sip-page sip-embedded' : 'sip-page'}>
    {!embedded && <header className="sip-header"><a href="/" className="sip-brand"><span>च</span><b>chanakya<small>FINANCE, SIMPLIFIED</small></b></a><nav className="sip-nav"><a className="sip-back" href="/calculators">All calculators</a><a className="sip-back" href="/"><ArrowLeft size={17} /> Back to Chanakya</a></nav></header>}
    <main className="sip-main">
      {!embedded && <div className="sip-heading"><span>SYSTEMATIC INVESTMENT PLANNER</span><h1>SIP calculator</h1><p>Explore how regular monthly investing could grow over time. Change the assumptions to see your own scenario.</p></div>}
      <div className="sip-grid">
        <section className="sip-input-card" aria-labelledby="sip-input-title"><div className="sip-card-heading"><span>01 / YOUR PLAN</span><h2 id="sip-input-title">Set your monthly investment</h2></div>
          <label htmlFor="sip-amount">Monthly investment <strong>{money(monthlyInvestment)}</strong></label><input id="sip-amount" type="range" min="500" max="200000" step="500" value={monthlyInvestment} onChange={e => setMonthlyInvestment(Number(e.target.value))}/><input aria-label="Monthly investment amount" type="number" min="0" max="10000000" step="500" value={monthlyInvestment} onChange={e => setMonthlyInvestment(Math.max(0, Math.min(10000000, Number(e.target.value) || 0)))}/>
          <label htmlFor="sip-years">Investment period <strong>{years} years</strong></label><input id="sip-years" type="range" min="1" max="40" step="1" value={years} onChange={e => setYears(Number(e.target.value))}/>
          <label htmlFor="sip-return">Expected annual return <strong>{annualReturn}%</strong></label><input id="sip-return" type="range" min="0" max="20" step="0.5" value={annualReturn} onChange={e => setAnnualReturn(Number(e.target.value))}/>
          <label htmlFor="sip-step">Increase SIP each year <strong>{annualStepUp}%</strong></label><input id="sip-step" type="range" min="0" max="20" step="1" value={annualStepUp} onChange={e => setAnnualStepUp(Number(e.target.value))}/><p className="sip-input-help">A step-up raises your monthly contribution at the start of each new year.</p>
        </section>
        <section className="sip-result-card" aria-labelledby="sip-result-title" aria-live="polite"><div className="sip-card-heading"><span>02 / YOUR PROJECTION</span><h2 id="sip-result-title">Your projected value</h2></div><strong className="sip-total">{money(result.value)}</strong><p>after {years} {years === 1 ? 'year' : 'years'} of monthly investing</p><div className="sip-split" role="img" aria-label={`Amount invested ${money(result.invested)}; estimated gains ${money(result.gains)}`}><span style={{ width: `${investedShare}%` }}/><span style={{ width: `${100 - investedShare}%` }}/></div><div className="sip-figures"><div><span>Amount invested</span><strong>{money(result.invested)}</strong></div><div><span>Estimated gains</span><strong>{money(result.gains)}</strong></div></div><div className="sip-result-note"><ArrowUpRight size={19}/><span>Your investment and estimated gains make up the projected value.</span></div></section>
      </div>
      <section className="sip-timeline" aria-labelledby="sip-timeline-title"><div className="sip-timeline-heading"><div><span>YEAR BY YEAR</span><h2 id="sip-timeline-title">See how the plan builds</h2></div><p>Green: amount invested · Lime: estimated gains</p></div><div className="sip-bars" role="img" aria-label="Year-by-year SIP projection chart">{result.timeline.map(point => <div className="sip-bar-column" key={point.year} title={`Year ${point.year}: invested ${money(point.invested)}, projected value ${money(point.value)}`}><div className="sip-bar" style={{ height: `${Math.max(3, point.value / maxValue * 100)}%` }}><span style={{ height: `${point.value ? point.invested / point.value * 100 : 100}%` }}/></div><small>{point.year}</small></div>)}</div><div className="sip-table-wrap"><table><thead><tr><th>Year</th><th>Invested</th><th>Estimated gains</th><th>Projected value</th></tr></thead><tbody>{result.timeline.map(point => <tr key={point.year}><td>{point.year}</td><td>{money(point.invested)}</td><td>{money(point.gains)}</td><td>{money(point.value)}</td></tr>)}</tbody></table></div></section>
      <p className="sip-disclaimer">Illustration only. Contributions are made at each month’s end; the annual return is divided by 12 and compounded monthly. Returns are not guaranteed. Taxes, fees, and inflation are excluded. This is not investment advice.</p>
    </main>
  </div>;
}
