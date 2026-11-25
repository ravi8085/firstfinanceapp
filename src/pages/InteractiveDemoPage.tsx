import { useState } from 'react';
import { ArrowRight, Calculator, ShieldCheck, TrendingUp } from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import './interactive-demo.css';

const rupees = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function InteractiveDemoPage() {
  const [income, setIncome] = useState(80000);
  const [living, setLiving] = useState(45000);
  const [goal, setGoal] = useState(15000);
  const remaining = income - living - goal;
  const used = Math.min(income, living + goal);

  return <div className="interactive-demo-page">
    <PublicHeader activeHref="/demo" />
    <main className="interactive-demo-main">
      <div className="interactive-demo-heading">
        <span>INTERACTIVE PREVIEW</span>
        <h1>See how a monthly plan comes together.</h1>
        <p>Move the sliders to explore a sample budget. These numbers stay on this page and do not create an account.</p>
      </div>
      <div className="interactive-demo-workspace">
        <section className="interactive-demo-inputs" aria-labelledby="demo-inputs-title">
          <h2 id="demo-inputs-title">Try the numbers</h2>
          <label>Monthly take-home income <strong>{rupees(income)}</strong><input type="range" min="20000" max="200000" step="1000" value={income} onChange={event => setIncome(Number(event.target.value))} /></label>
          <label>Everyday living costs <strong>{rupees(living)}</strong><input type="range" min="5000" max="150000" step="1000" value={living} onChange={event => setLiving(Number(event.target.value))} /></label>
          <label>Amount for a goal <strong>{rupees(goal)}</strong><input type="range" min="0" max="100000" step="1000" value={goal} onChange={event => setGoal(Number(event.target.value))} /></label>
          <p>Sample amounts only. Adjust them to see how the picture changes.</p>
        </section>
        <section className="interactive-demo-results" aria-live="polite" aria-labelledby="demo-results-title">
          <span>YOUR MONTHLY PICTURE</span>
          <h2 id="demo-results-title">{remaining >= 0 ? 'Room left after these costs' : 'More than the sample income'}</h2>
          <strong className="interactive-demo-total">{rupees(Math.abs(remaining))}</strong>
          <div className="interactive-demo-bar" role="img" aria-label={`${rupees(used)} of ${rupees(income)} allocated to living costs and a goal`}><i style={{ width: `${income ? used / income * 100 : 0}%` }} /></div>
          <dl><div><dt>Take-home income</dt><dd>{rupees(income)}</dd></div><div><dt>Living costs</dt><dd>{rupees(living)}</dd></div><div><dt>Goal amount</dt><dd>{rupees(goal)}</dd></div></dl>
          <p>{remaining >= 0 ? 'You can decide how to use what remains after reviewing your needs and priorities.' : 'Try reducing a cost or extending the goal timeline to make the example fit.'}</p>
        </section>
      </div>
      <div className="interactive-demo-next">
        <a href="/calculators"><Calculator size={22} aria-hidden="true" /><span><b>Try a calculator</b><small>Explore FD, SIP, NPS and investment scenarios.</small></span><ArrowRight size={18} aria-hidden="true" /></a>
        <a href="/#customer-signin"><TrendingUp size={22} aria-hidden="true" /><span><b>Build your personal plan</b><small>Sign in to use voice or the detailed form.</small></span><ArrowRight size={18} aria-hidden="true" /></a>
      </div>
      <p className="interactive-demo-note"><ShieldCheck size={17} aria-hidden="true" /> This is a public sample preview. It does not show personal records or promise an investment outcome.</p>
    </main>
  </div>;
}
