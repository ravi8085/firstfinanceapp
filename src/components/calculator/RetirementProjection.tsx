import { useState } from 'react';
import { Sunset } from 'lucide-react';
import { calculateRetirement } from '@/lib/retirement';
import { FundingProgress, GoalGrowthVisual, MoneyBreakdown } from './FinancialVisuals';
import { getGoalAssumptions } from '@/data/goalAssumptions';
import { financialGoals } from '@/data/financialGoals';

interface Props {salary:number; age:number; monthlyExpenses:number; availableMonthly:number}
const money=(value:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Math.ceil(value));
export default function RetirementProjection({salary,age,monthlyExpenses,availableMonthly}:Props) {
  const [retirementAge,setRetirementAge]=useState(Math.max(60,age));
  const [yearsInRetirement,setYearsInRetirement]=useState(25);
  const [expenses,setExpenses]=useState(monthlyExpenses);
  const [inflation,setInflation]=useState(6);
  const [annualReturn,setAnnualReturn]=useState(getGoalAssumptions(financialGoals.find(g=>g.key==='retirement')!,Math.max(0,60-age)).annualReturn);
  const [retirementReturn,setRetirementReturn]=useState(6);
  const [existingCorpus,setExistingCorpus]=useState(0);
  const [monthlyContribution,setMonthlyContribution]=useState(0);
  const result=calculateRetirement({currentAge:age,retirementAge,yearsInRetirement,monthlyExpenses:expenses,inflation,annualReturn,retirementReturn,existingCorpus,monthlyContribution});
  const hasTarget=expenses>0;
  const beyondSurplus=hasTarget && result.requiredMonthly!==null && result.requiredMonthly>availableMonthly;
  const field=(label:string,value:number,setter:(n:number)=>void,min:number,max:number,step=1)=><label>{label}<input type="number" min={min} max={max} step={step} value={value===0?'':value} placeholder="0" onChange={e=>{const n=Number(e.target.value);if(Number.isFinite(n))setter(Math.min(max,Math.max(min,n)));}}/></label>;
  return <section className="retirement-planner"><div className="section-heading"><span className="section-icon"><Sunset size={22}/></span><div><h3>Your retirement investment plan</h3><p>See the monthly contribution needed under your assumptions.</p></div></div>
  <div className="result-hero retirement-monthly-target"><span>{result.months===0?'Retirement funding gap today':'Monthly investment needed for retirement'}</span><strong>{hasTarget?money(result.requiredMonthly??Math.max(0,result.requiredCorpus-existingCorpus)):'Enter living expenses'}</strong><p>{hasTarget?(result.months>0?`Each month for ${result.years} years, after accounting for your existing retirement corpus.`:'Your selected retirement age is now. This is an immediate corpus gap, not a monthly SIP.'): 'Set your retirement living-expense estimate below to calculate the target.'}</p></div>
  <div className="goal-result-grid"><div><span>Monthly retirement contribution entered</span><strong>{money(monthlyContribution)}</strong><small>This projection uses only this dedicated amount.</small></div><div><span>{result.months===0?'Corpus still required now':'Additional monthly investment needed'}</span><strong>{hasTarget?money(result.additionalMonthly??Math.max(0,result.requiredCorpus-existingCorpus)):'—'}</strong><small>{result.months>0?'Above the contribution you entered':'After your existing retirement corpus'}</small></div><div><span>Available monthly surplus</span><strong>{money(availableMonthly)}</strong><small>Shared with your other financial goals.</small></div></div>
  {hasTarget&&result.requiredMonthly!==null&&<p className="cf-help">The required contribution is {salary>0?(result.requiredMonthly/salary*100).toFixed(1):'—'}% of your entered take-home salary.</p>}
  {beyondSurplus&&<p className="cf-notice">The target needs {money(result.requiredMonthly!-availableMonthly)} more per month than your current surplus. Review retirement age, spending, savings, and contributions. Do not rely on a higher return assumption to close the gap.</p>}
  {monthlyContribution>availableMonthly&&<p className="cf-notice">Your entered retirement contribution exceeds your current monthly surplus.</p>}
  {hasTarget&&result.months>0&&!beyondSurplus&&<p className="cf-help">This target is within the entered surplus, but other goals, insurance, and your emergency reserve also use that money.</p>}
  <h4 className="form-section-title">Adjust your retirement plan</h4><div className="planner-fields">
  {field('Retirement age',retirementAge,setRetirementAge,age,100)}
  {field('Years to fund after retirement',yearsInRetirement,setYearsInRetirement,1,60)}
  {field('Monthly retirement living expenses today (₹)',expenses,setExpenses,0,1e9,.01)}
  {field('Existing retirement corpus (₹)',existingCorpus,setExistingCorpus,0,1e10,.01)}
  {field('Monthly amount assigned to retirement (₹)',monthlyContribution,setMonthlyContribution,0,1e9,.01)}
  {field('Assumed annual cost increase (%)',inflation,setInflation,0,30,.1)}
  {field('Assumed return before retirement (%)',annualReturn,setAnnualReturn,0,30,.1)}
  {field('Assumed return during retirement (%)',retirementReturn,setRetirementReturn,0,30,.1)}
  </div><p className="cf-help">Living expenses start from the monthly expenses you entered, not your salary. Adjust for costs that may end or begin in retirement. Existing emergency savings are not counted as retirement savings.</p>
  {hasTarget&&result.requiredMonthly!==null&&<button type="button" className="cf-button cf-secondary" onClick={()=>setMonthlyContribution(Math.ceil(result.requiredMonthly!))}>Use required monthly amount in projection</button>}
  <div className="goal-result-grid"><div><span>Target retirement corpus</span><strong>{hasTarget?money(result.requiredCorpus):'—'}</strong><small>Funding {yearsInRetirement} years of living expenses</small></div><div><span>Projected retirement corpus</span><strong>{money(result.projectedCorpus)}</strong><small>From your dedicated retirement contributions</small></div><div><span>Projected corpus shortfall</span><strong>{hasTarget?money(result.gap):'—'}</strong><small>{hasTarget&&result.gap<=.01?'Target covered under these assumptions':'At your entered monthly contribution'}</small></div></div>
  {hasTarget&&<><FundingProgress title="Projected retirement target coverage" saved={result.projectedCorpus} target={result.requiredCorpus}/><MoneyBreakdown title="Projected sources of retirement funding" items={[{name:'Existing retirement savings, grown',value:result.futureExisting},{name:'Monthly contributions, grown',value:Math.max(0,result.projectedCorpus-result.futureExisting)}]}/><GoalGrowthVisual years={result.years} savings={existingCorpus} monthly={monthlyContribution} annualReturn={annualReturn} target={result.requiredCorpus}/></>}
  <details className="goal-assumptions"><summary>How the monthly amount is calculated</summary><p>At retirement, your estimated living costs are {hasTarget?money(result.futureMonthlyExpense):'not set'} per month after inflation. The corpus target funds {yearsInRetirement} years of annual withdrawals, beginning at retirement, with continuing cost increases and the return you entered for retirement.</p><p>Existing retirement savings grow at your pre-retirement return assumption. The remaining target is converted to equal end-of-month contributions over {result.months} months. A 0% return uses a simple division by the months remaining.</p><p>These are nominal planning scenarios before tax and fees. Returns, inflation, longevity, and the order of market returns can materially change the result. Pension income is not included; adjust expenses if a dependable pension covers part of them. This calculation does not assign a risk profile based on age or guarantee retirement security.</p></details>
  </section>;
}
