import { Target, Clock3, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { type FinancialGoal } from '@/data/financialGoals';
import { formatCurrency } from '@/data/investmentData';
import { buildGoalJourney, goalQuestion, type GoalJourneyInput } from '@/lib/goalJourney';
import { getGoalAssumptions, assumptionSources } from '@/data/goalAssumptions';

function duration(months: number) {
  if (months === 0) return 'now';
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years ? `${years} year${years===1?'':'s'}` : '', rest ? `${rest} month${rest===1?'':'s'}` : ''].filter(Boolean).join(' ');
}

export function GoalJourneyQuestions({ goal, input, onChange }: { goal: FinancialGoal; input: GoalJourneyInput; onChange: (input: GoalJourneyInput) => void }) {
  const change = <K extends keyof GoalJourneyInput>(key: K, value: GoalJourneyInput[K]) => onChange({ ...input, [key]: value });
  const protection = goal.kind === 'protection';
  const immediate = goal.key === 'emergency';
  return <section className="goal-journey-questions" aria-labelledby="goal-journey-question-title"><div className="goal-journey-title"><Target size={20} aria-hidden="true" /><div><h3 id="goal-journey-question-title">A few details for {goal.name.toLowerCase()}</h3><p>{goal.description}</p></div></div><div className="planner-fields">
    <label>{goalQuestion(goal)}<input type="number" min="0" max="10000000000" step="1000" value={input.target || ''} placeholder="Enter your estimate" required onChange={event=>change('target',Math.max(0,Number(event.target.value)||0))}/></label>
    {!protection && !immediate && <label>When would you like to reach it? (years)<input type="number" min="1" max="60" step="1" value={input.years} required onChange={event=>change('years',Math.max(1,Math.min(60,Number(event.target.value)||1)))}/></label>}
    <label>{protection?'Existing life cover (₹)':'Already saved for this goal (₹)'}<input type="number" min="0" max="10000000000" step="1000" value={input.saved || ''} placeholder="0" onChange={event=>change('saved',Math.max(0,Number(event.target.value)||0))}/></label>
    {!protection && <label>Amount you could set aside monthly (₹, optional)<input type="number" min="0" max="100000000" step="500" value={input.monthly || ''} placeholder="Leave blank to compare with your surplus" onChange={event=>change('monthly',Math.max(0,Number(event.target.value)||0))}/></label>}
    {!protection && !immediate && <label>How comfortable are you with value changes?<select value={input.risk} onChange={event=>change('risk',event.target.value as GoalJourneyInput['risk'])}><option value="steady">Prefer steadier value</option><option value="balanced">Some changes are acceptable</option><option value="growth">Can accept larger changes</option></select></label>}
  </div><p className="cf-help">Enter an amount for this goal only. We’ll compare it with the money left after your monthly expenses and show a planning illustration.</p></section>;
}

export function GoalJourneyResult({ goal, input, availableMonthly, onEdit }: { goal: FinancialGoal; input: GoalJourneyInput; availableMonthly: number; onEdit: () => void }) {
  const plan = buildGoalJourney(goal,input,availableMonthly);
  const protection = goal.kind === 'protection';
  const debt = goal.group === 'Debt freedom';
  const required = plan.projection.months ? plan.projection.monthly : plan.projection.gap;
  const possible = input.target > 0 && (plan.projection.gap <= 0 || (plan.monthlyCapacity > 0 && required <= plan.monthlyCapacity));
  return <section className="goal-journey-result" aria-labelledby="goal-journey-result-title"><div className="goal-result-heading"><div><span className="cf-eyebrow">YOUR SELECTED GOAL</span><h2 id="goal-journey-result-title">A path toward {goal.name.toLowerCase()}</h2><p>{protection?'Compare the cover you want with what you already have.':`An illustration based on your target, timing and monthly budget.`}</p></div><button type="button" className="cf-button cf-secondary" onClick={onEdit}>Edit goal details</button></div>
    <div className="goal-journey-metrics"><div><span>{protection?'Protection amount to review':'Estimated target at goal date'}</span><strong>{formatCurrency(protection?input.target:plan.projection.futureCost)}</strong><small>{protection?'Cover is not an investment':`${input.years} year${input.years===1?'':'s'} · ${plan.inflation}% annual cost increase assumed`}</small></div><div><span>{protection?'Cover gap to review':plan.projection.months?'Monthly amount for chosen timeline':'Amount needed now'}</span><strong>{formatCurrency(protection?Math.max(0,input.target-input.saved):required)}</strong><small>{protection?'After your existing cover or resources':`${plan.rate}% illustrative annual return · not guaranteed`}</small></div><div><span>Money left after monthly expenses</span><strong>{formatCurrency(Math.max(0,availableMonthly))}</strong><small>{protection?'Check premiums against your budget':input.monthly?'Compare with your entered goal contribution':'Not all of this should automatically be invested'}</small></div></div>
    {!protection && <div className={`goal-journey-status ${possible?'is-possible':'needs-review'}`}><Clock3 size={23} aria-hidden="true" /><div><strong>{plan.projection.gap<=0?'Already covered under these assumptions':plan.monthsAtCapacity!==null?`Illustrative time at ${formatCurrency(plan.monthlyCapacity)}/month: ${duration(plan.monthsAtCapacity)}`:'The target needs a budget or timeline review'}</strong><p>{possible?'The chosen timeline appears within your current surplus under these assumptions. Keep emergency savings and other goals in view.':`The required monthly amount is ${formatCurrency(required)}. Adjust the target, date or spending before choosing an investment.`}</p></div></div>}
    <h3 className="goal-journey-route-title">{protection?'Protection route to compare':debt?'Repayment route to compare':'Where this goal’s money could go'}</h3><div className="goal-journey-routes">{plan.routes.map(route=><a href={route.href} key={route.name}><span className="goal-route-mark" aria-hidden="true">↗</span><div><strong>{route.name}</strong><span>{route.risk}</span><p>{route.why}</p></div><ArrowUpRight size={18} aria-hidden="true" /></a>)}</div>
    {!protection && <details className="goal-journey-method"><summary>How this timeline was calculated</summary><p>The target is increased by the annual cost assumption. Savings already set aside and equal monthly contributions are projected at the illustrative return shown above. The time estimate is the first month when projected savings reach the rising target, capped at 50 years.</p><p>{getGoalAssumptions(goal,input.years).costBasis} {getGoalAssumptions(goal,input.years).returnBasis}</p><div>{assumptionSources.map(source=><a key={source.name} href={source.url} target="_blank" rel="noopener noreferrer">{source.name} ↗</a>)}</div></details>}
    <p className="goal-journey-caution"><ShieldAlert size={17} aria-hidden="true" />These are options to compare, not a product recommendation. Rates, tax, fees, risk and eligibility differ by provider. The timeline assumes smooth annual returns and cost increases; actual results can vary.</p>
  </section>;
}
\n
