import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlannerSessionContext } from './PlannerSession';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine } from 'recharts';
import { type TermProfile } from './TermPlanComparison';
import { formatCurrency, type InvestmentCategory } from '@/data/investmentData';

export const chartColors=['#6366f1','#0d9488','#38bdf8','#f59e0b','#a78bfa','#ec4899','#475569','#84cc16'];
const exactMoney=(amount:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(amount);
const riskInfo:Record<string,{label:string;level:string;description:string}>={
  fd:{label:'Lower risk',level:'low',description:'Bank deposits have bank credit and reinvestment risk. Deposit insurance limits and premature-withdrawal terms apply.'},
  mf_equity:{label:'High risk',level:'high',description:'Equity funds can experience substantial market losses. Check the specific scheme’s current SEBI Riskometer.'},
  mf_debt:{label:'Moderate risk · varies',level:'medium',description:'Debt funds carry interest-rate, credit, and liquidity risk. The actual risk can be higher; check the scheme’s current SEBI Riskometer.'},
  term:{label:'Protection · no market exposure',level:'protection',description:'Term insurance is protection, not an investment. The amount shown is a premium-budget illustration, not a policy quote. Insurer, coverage, and claim conditions still matter.'},
  ppf:{label:'Lower risk',level:'low',description:'Statutory savings have lock-in and withdrawal rules; administered interest rates can change.'},
  gold:{label:'Moderate risk',level:'medium',description:'Gold prices can fall. Physical gold and sovereign gold bonds differ in liquidity, costs, and terms.'},
  stocks:{label:'High risk',level:'high',description:'Direct equities carry market and company-specific risk, including loss of capital.'},
};

export function FundingProgress({title,saved,target}: {title:string;saved:number;target:number}) {
  const percent=target>0?Math.min(100,Math.max(0,saved/target*100)):0;
  return <section className="funding-visual"><div className="visual-title"><h4>{title}</h4><strong>{target>0?`${percent.toFixed(0)}% funded`:'Target not set'}</strong></div><div className="funding-track" role="progressbar" aria-label={title} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${percent}%`}}/></div><div className="visual-caption"><span>Set aside <b>{exactMoney(saved)}</b></span><span>Target <b>{exactMoney(target)}</b></span></div>{target<=0&&<p className="cf-help">Enter a target amount to see funding progress.</p>}</section>;
}

export function MoneyBreakdown({title,items}: {title:string;items:{name:string;value:number}[]}) {
  const nonzero=items.filter(item=>item.value>0);
  const total=nonzero.reduce((sum,item)=>sum+item.value,0);
  return <section className="money-breakdown"><h4>{title}</h4>{total>0?<><div className="stacked-money-bar" aria-label={`${title}: ${exactMoney(total)}`}>{nonzero.map((item,i)=><span key={item.name} style={{width:`${item.value/total*100}%`,background:chartColors[i%chartColors.length]}} title={`${item.name}: ${exactMoney(item.value)}`}/>)}</div><ul>{nonzero.map((item,i)=><li key={item.name}><span className="visual-key" style={{background:chartColors[i%chartColors.length]}}/><span>{item.name}</span><strong>{exactMoney(item.value)}</strong><small>{(item.value/total*100).toFixed(1)}%</small></li>)}</ul></>:<p className="cf-help">Add amounts to see the breakdown.</p>}</section>;
}

export function AllocationVisual({categories,budget,totalPercent,termProfile}: {categories:InvestmentCategory[];budget:number;totalPercent:number;termProfile?:TermProfile}) {
  const session=useContext(PlannerSessionContext);
  const [selected,setSelected]=useState<string|null>(null);
  const data=categories.map(c=>({...c,value:totalPercent>0?budget*c.percentage/totalPercent:0}));
  const active=data.find(c=>c.key===selected);
  return <section className="allocation-visual"><div className="allocation-chart-layout"><div className="allocation-donut" role="img" aria-label={`Illustrative allocation of ${exactMoney(budget)}. Amounts and risk labels are listed below.`}>{budget>0?<ResponsiveContainer width="100%" height={240}><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={3} stroke="none" isAnimationActive={false} onClick={entry=>setSelected(entry.key)}>{data.map((c,i)=><Cell key={c.key} fill={chartColors[i%chartColors.length]} opacity={selected&&selected!==c.key?0.35:1}/>)}</Pie><Tooltip formatter={(value:number)=>exactMoney(value)}/></PieChart></ResponsiveContainer>:<div className="empty-donut">No available<br/>allocation budget</div>}</div><div className="allocation-chart-summary"><span>{active?active.name:'Total example budget'}</span><strong>{exactMoney(active?.value??budget)}</strong><p>{active?`${totalPercent>0?(active.percentage/totalPercent*100).toFixed(1):0}% of the example budget`:'Select a category to highlight its share. Amounts include the protection premium budget.'}</p>{selected&&<button type="button" className="cf-text-button" onClick={()=>setSelected(null)}>Show all categories</button>}</div></div><div className="allocation-rows">{data.map((c,i)=>{
    const risk=riskInfo[c.key]||{label:`${c.riskLevel} risk`,level:c.riskLevel,description:'Indicative category-level risk. Review the specific product before investing.'};
    const share=totalPercent>0?c.percentage/totalPercent*100:0;
    return <div className={`allocation-row ${selected===c.key?'highlighted':''}`} key={c.key}><div className="allocation-row-heading">{c.key==='fd'?<Link className="allocation-category" to="/fixed-deposits"><span className="visual-key" style={{background:chartColors[i%chartColors.length]}}/>{c.name}</Link>:c.key==='term'&&termProfile?<Link className="allocation-category" to="/term-insurance" onClick={()=>session?.setInsurance({profile:termProfile,premiumBudget:c.value})}><span className="visual-key" style={{background:chartColors[i%chartColors.length]}}/>{c.name}<span className="term-trigger-hint">Compare plans</span></Link>:<button type="button" className="allocation-category" aria-pressed={selected===c.key} onClick={()=>setSelected(selected===c.key?null:c.key)}><span className="visual-key" style={{background:chartColors[i%chartColors.length]}}/>{c.name}</button>}<strong>{exactMoney(c.value)}</strong></div><div className="allocation-risk-line"><span className={`risk-badge risk-${risk.level}`}>{risk.label}</span><span>{budget>0?`${share.toFixed(1)}% of budget`:'No allocation'}</span></div><div className="allocation-meter" aria-hidden="true"><span style={{width:`${budget>0?share:0}%`,background:chartColors[i%chartColors.length]}}/></div>{c.key==='fd'&&<Link className="fd-open-link" to="/fixed-deposits">Open FD rates calculator →</Link>}<details><summary>About this risk</summary><p>{risk.description}</p></details></div>;
  })}</div><p className="cf-help">Risk labels are broad category indicators, not official product ratings. Mutual-fund risk varies by scheme; review its latest <a href="https://investor.sebi.gov.in/riskometer.html" target="_blank" rel="noopener noreferrer">SEBI Riskometer</a>. Lower risk does not mean risk-free.</p></section>;
}

export function GoalGrowthVisual({years,savings,monthly,annualReturn,target}: {years:number;savings:number;monthly:number;annualReturn:number;target:number}) {
  if(years<=0||target<=0)return null;
  const rate=Math.pow(1+annualReturn/100,1/12)-1;
  const data=Array.from({length:Math.ceil(years)+1},(_,i)=>{
    const elapsed=Math.min(i,years),months=Math.round(elapsed*12);
    const growth=Math.pow(1+rate,months);
    return {year:elapsed,balance:savings*growth+(rate===0?monthly*months:monthly*(growth-1)/rate)};
  });
  return <section className="goal-growth-visual"><h4>Your planned funding journey</h4><p className="cf-help">Projected balance with {exactMoney(monthly)} contributed each month at {annualReturn}% assumed annual return.</p><div role="img" aria-label={`Illustrative balance from ${exactMoney(savings)} today to ${exactMoney(data[data.length-1].balance)} in ${years} years; target ${exactMoney(target)}.`}><ResponsiveContainer width="100%" height={250}><AreaChart data={data} margin={{top:25,right:15,bottom:5,left:0}}><CartesianGrid stroke="#e6ebf5" strokeDasharray="3 3"/><XAxis dataKey="year" tick={{fontSize:12}} tickFormatter={value=>`${value}y`}/><YAxis tick={{fontSize:11}} tickFormatter={value=>formatCurrency(value)} width={65} domain={[0,'auto']}/><Tooltip formatter={(value:number)=>[exactMoney(value),'Projected balance']} labelFormatter={value=>`Year ${value}`}/><ReferenceLine y={target} ifOverflow="extendDomain" stroke="#0d9488" strokeDasharray="5 5" label={{value:'Goal target',position:'insideTopRight',fontSize:12,fill:'#0f766e'}}/><Area dataKey="balance" type="monotone" stroke="#6366f1" strokeWidth={2.5} fill="#c7d2fe" fillOpacity={.55} isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><p className="cf-help">The smooth curve is an illustration; actual market returns fluctuate. Hover or tap the chart to inspect yearly amounts.</p></section>;
}
