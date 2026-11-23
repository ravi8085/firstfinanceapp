import { useState } from 'react';

type Frequency = 'monthly' | 'annual';
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

export function projectInvestment(contribution: number, years: number, annualReturn: number, frequency: Frequency) {
  const periodsPerYear = frequency === 'monthly' ? 12 : 1;
  const periods = Math.round(years * periodsPerYear);
  const periodicRate = annualReturn / 100 / periodsPerYear;
  const principal = contribution * periods;
  const total = periodicRate === 0 ? principal : contribution * (Math.pow(1 + periodicRate, periods) - 1) / periodicRate;
  return { principal, growth: total - principal, total };
}

export default function LandingInvestmentCalculator() {
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [contribution, setContribution] = useState(10000);
  const [years, setYears] = useState(10);
  const [annualReturn, setAnnualReturn] = useState(8);
  const result = projectInvestment(contribution, years, annualReturn, frequency);
  const principalShare = result.total > 0 ? result.principal / result.total * 100 : 0;

  return <section className="landing-calculator" id="investment-calculator" aria-labelledby="landing-calculator-title">
    <div className="landing-calculator-heading"><div><span className="cf-eyebrow">TRY THE NUMBERS</span><h2 id="landing-calculator-title">What could your investments grow to?</h2><p>Choose a contribution, time period, and assumed return.</p></div><div className="landing-frequency" role="group" aria-label="Investment frequency"><button type="button" aria-pressed={frequency === 'monthly'} onClick={() => setFrequency('monthly')}>Monthly</button><button type="button" aria-pressed={frequency === 'annual'} onClick={() => setFrequency('annual')}>Annual</button></div></div>
    <div className="landing-calculator-body"><div className="landing-calculator-fields">
      <label>Investment each {frequency === 'monthly' ? 'month' : 'year'} (₹)<input type="number" inputMode="decimal" min="0" max="10000000" step="1000" value={contribution} onChange={event => setContribution(Math.max(0, Math.min(10000000, Number(event.target.value) || 0)))} /></label>
      <label>Years invested<input type="number" inputMode="numeric" min="1" max="40" value={years} onChange={event => setYears(Math.max(1, Math.min(40, Number(event.target.value) || 1)))} /></label>
      <label>Expected annual return (%)<input type="number" inputMode="decimal" min="0" max="30" step="0.5" value={annualReturn} onChange={event => setAnnualReturn(Math.max(0, Math.min(30, Number(event.target.value) || 0)))} /></label>
    </div><div className="landing-calculator-result" aria-live="polite"><span>Estimated total value</span><strong>{money(result.total)}</strong><div className="landing-return-bar" role="img" aria-label={`Principal ${money(result.principal)} and estimated growth ${money(result.growth)}`}><i style={{ width: `${principalShare}%` }} /><i style={{ width: `${100 - principalShare}%` }} /></div><dl><div><dt>Principal invested</dt><dd>{money(result.principal)}</dd></div><div><dt>Estimated growth</dt><dd>{money(result.growth)}</dd></div></dl></div></div>
    <p className="landing-calculator-note">Illustration assumes contributions at the end of each {frequency === 'monthly' ? 'month' : 'year'} and a constant return compounded {frequency}. Returns are not guaranteed; taxes, fees, and inflation are excluded.</p>
  </section>;
}
