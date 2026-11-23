import { formatCurrency } from '@/data/investmentData';

const mix = [
  { name: 'Bank deposits / short-term reserves', risk: 'Lower', share: 15 },
  { name: 'PPF / EPF', risk: 'Lower, with lock-in', share: 20 },
  { name: 'Diversified debt mutual funds', risk: 'Low to high by scheme', share: 20 },
  { name: 'Diversified equity mutual funds', risk: 'High to very high by scheme', share: 35 },
  { name: 'Gold fund / ETF', risk: 'Market risk', share: 10 },
];

export default function DiversifiedTarget({ salary, surplus, emergencyGap }: { salary: number; surplus: number; emergencyGap: number }) {
  const minimum = Math.round(salary * .25);
  const maximum = Math.round(salary * .30);
  const affordable = Math.max(0, Math.min(maximum, surplus));
  return <section className="diversified-target" aria-labelledby="target-title">
    <h3 id="target-title">A 25–30% investing target</h3>
    <p>For take-home pay of {formatCurrency(salary)}, that is {formatCurrency(minimum)}–{formatCurrency(maximum)} per month. Your current balance after expenses is {formatCurrency(Math.max(0, surplus))}.</p>
    {affordable < minimum ? <p className="cf-notice">Your current balance is below 25% of take-home pay. Review expenses and debt before setting this target. No amount above your balance is suggested.</p> : <p className="cf-help">A monthly illustration of {formatCurrency(affordable)} fits within your entered balance. Choose the amount after reviewing your emergency reserve and debts.</p>}
    {emergencyGap > 0 && <p className="cf-help">Your emergency reserve still needs {formatCurrency(emergencyGap)}. Set aside what it needs before committing the full illustrative amount.</p>}
    <div className="city-price-table"><table><caption>Example diversified mix using {formatCurrency(affordable)} a month</caption><thead><tr><th scope="col">Instrument</th><th scope="col">Indicative risk</th><th scope="col">Share</th><th scope="col">Monthly illustration</th></tr></thead><tbody>{mix.map(item => <tr key={item.name}><th scope="row">{item.name}</th><td>{item.risk}</td><td>{item.share}%</td><td>{formatCurrency(Math.round(affordable * item.share / 100))}</td></tr>)}</tbody></table></div>
    <p className="cf-help">This is a planning scenario, not a universal rule or product recommendation. Match the mix to your goal date, liquidity needs and risk tolerance. Check the current Riskometer for each mutual fund scheme. Term insurance belongs in protection spending, not this investment mix.</p>
    <a href="https://investor.sebi.gov.in/investment_risk_managment.html" target="_blank" rel="noreferrer">SEBI guidance on diversification and investment horizon</a>
  </section>;
}
