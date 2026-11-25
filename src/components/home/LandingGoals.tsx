import { useState } from 'react';
import { ArrowRight, ChevronDown, Target } from 'lucide-react';
import { financialGoals, goalGroups } from '@/data/financialGoals';

export default function LandingGoals() {
  const [selected, setSelected] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const choose = (key: string) => {
    sessionStorage.setItem('chanakya.selectedGoal', key);
    setSelected(key);
    document.getElementById('customer-signin')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.getElementById('customer-signin')?.focus({ preventScroll: true });
  };
  const goal = financialGoals.find(item => item.key === selected);
  return <section className="landing-goals" aria-labelledby="landing-goals-title">
    <div className="landing-goals-intro"><span className="landing-goals-icon"><Target size={21} aria-hidden="true" /></span><div><span className="campaign-copy-kicker">YOUR NEXT MILESTONE</span><h2 id="landing-goals-title">What are you planning for?</h2><p>Choose a goal. After sign-in, add your salary and expenses to explore a personal planning scenario.</p></div></div>
    <div className="landing-goals-featured">{financialGoals.filter(item => ['emergency','home','education','marriage','retirement','car','family_security','wealth'].includes(item.key)).map(item => <button type="button" key={item.key} className={selected===item.key?'is-selected':''} onClick={() => choose(item.key)}>{item.name}<ArrowRight size={15} aria-hidden="true" /></button>)}</div>
    <button type="button" className="landing-goals-toggle" aria-expanded={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? 'Show fewer goals' : `Explore all ${financialGoals.length} goals`} <ChevronDown size={17} aria-hidden="true" /></button>
    {expanded && <div className="landing-goals-all">{goalGroups.map(group => <div key={group}><h3>{group}</h3><div>{financialGoals.filter(item => item.group===group).map(item => <button type="button" key={item.key} className={selected===item.key?'is-selected':''} onClick={() => choose(item.key)}>{item.name}</button>)}</div></div>)}</div>}
    {goal && <p className="landing-goals-selected" role="status"><strong>{goal.name} selected.</strong> Sign in below to add your salary and continue.</p>}
  </section>;
}
