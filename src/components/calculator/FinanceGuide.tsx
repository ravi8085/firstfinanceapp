import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { usePlannerSession } from './PlannerSession';
import { cashFlow } from '@/lib/planner';
import { formatCurrency } from '@/data/investmentData';

type Topic = 'next' | 'budget' | 'safety' | 'invest' | 'cover' | 'sources';
const topics: { id: Topic; label: string }[] = [
  { id: 'next', label: 'What should I do next?' },
  { id: 'budget', label: 'Explain my monthly balance' },
  { id: 'safety', label: 'Emergency fund' },
  { id: 'invest', label: 'Investment risk' },
  { id: 'cover', label: 'Term insurance' },
  { id: 'sources', label: 'Where do figures come from?' },
];

export default function FinanceGuide() {
  const { demo } = useAuth();
  const { details, insurance } = usePlannerSession();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<Topic>('next');
  const flow = cashFlow(details);
  const hasBudget = details.salary > 0;
  const answer = (() => {
    switch (topic) {
      case 'next':
        if (!hasBudget) return 'Start with your take-home salary and actual monthly expenses. You can speak them or use the form. Review the captured amounts before building your plan.';
        if (flow.surplus < 0) return `Your expenses exceed your salary by ${formatCurrency(-flow.surplus)} a month. Check the amounts you entered, then review debt payments and flexible spending before adding investments.`;
        if (flow.emergencyGap > 0) return `You have ${formatCurrency(flow.surplus)} remaining each month. Your chosen emergency buffer needs ${formatCurrency(flow.emergencyGap)} more. Decide how much of the remaining balance to put towards it.`;
        return `Your emergency buffer target is covered by the savings you entered. You have ${formatCurrency(flow.surplus)} remaining each month. Explore your goal and compare investment risk before committing money.`;
      case 'budget':
        return hasBudget ? `Salary ${formatCurrency(details.salary)} minus entered expenses ${formatCurrency(flow.expenses)} leaves ${flow.surplus < 0 ? 'a shortfall of ' : ''}${formatCurrency(Math.abs(flow.surplus))} per month. This uses your entries and does not include tax adjustments or future changes.` : 'Enter your monthly take-home salary and expenses in My money plan to see the balance.';
      case 'safety':
        return hasBudget ? `Your selected buffer is ${details.bufferMonths} months of expenses. At ${formatCurrency(flow.expenses)} a month, the target is ${formatCurrency(flow.emergencyTarget)}. Savings entered are ${formatCurrency(details.savings)}, leaving ${formatCurrency(flow.emergencyGap)} to build.` : 'An emergency fund is a reserve for unexpected costs. Enter expenses and the number of buffer months to calculate your own target.';
      case 'invest':
        return hasBudget ? `A 25–30% take-home investing scenario is ${formatCurrency(details.salary * .25)}–${formatCurrency(details.salary * .30)} monthly. Your available balance is ${formatCurrency(Math.max(0, flow.surplus))}. The Illustration tab shows a low-to-high-risk diversified mix capped at that balance. Check your emergency fund, goal horizon and each fund’s Riskometer before choosing an amount.` : 'Enter your take-home salary and expenses to see a 25–30% investing scenario and a diversified low-to-high-risk mix.';
      case 'cover':
        return insurance ? `Your comparison uses age ${insurance.profile.age} and salary ${formatCurrency(insurance.profile.salary)} per month. Confirm gross income, tobacco use, cover, duration and riders before requesting insurer quotes. Published example premiums are based on different profiles.` : 'Term insurance protects dependants. The comparison asks about income, occupation, education and tobacco use, then lets you review cover and insurer plans. A personal premium needs an insurer quote.';
      case 'sources':
        return 'Your cash-flow and emergency numbers come from the values you enter. City budget examples are approximate figures from the original app. Insurer premium examples link to their published sources. Live city prices and personal insurer quotes require provider connections.';
    }
  })();
  if (pathname === '/signin') return null;
  return <aside className="finance-guide" aria-label="Financial planning guide">
    <button className="finance-guide-launch" type="button" aria-expanded={open} aria-controls="finance-guide-panel" onClick={() => setOpen(value => !value)}><MessageCircle size={19} /> Ask Chanakya</button>
    {open && <div className="finance-guide-panel" id="finance-guide-panel"><header><div><strong>Your planning guide</strong><small>Answers based on your entries</small></div><button type="button" aria-label="Close guide" onClick={() => setOpen(false)}><X size={18} /></button></header><div className="finance-guide-topics">{topics.map(item => <button type="button" key={item.id} aria-pressed={topic === item.id} onClick={() => setTopic(item.id)}>{item.label}</button>)}</div><p role="status">{answer}</p><nav><Link to="/calculator" onClick={() => setOpen(false)}>My money plan</Link><Link to="/term-insurance" onClick={() => setOpen(false)}>Term plans</Link></nav><small>{demo ? 'Demo session · ' : ''}Guidance uses the current session. Check details and sources before acting.</small></div>}
  </aside>;
}
