const rows = [
  { time: 'DAYS TO 1 YEAR', title: 'Keep it accessible', options: ['Savings account', 'Sweep-in FD', 'Liquid mutual fund'], use: 'Emergency fund and near-term spending', risk: 'Very low to low', tone: 'aqua', icon: '◷' },
  { time: '1 TO 3 YEARS', title: 'Plan the next step', options: ['Fixed deposit', 'Recurring deposit', 'Debt mutual fund'], use: 'Known costs such as a car down payment', risk: 'Low to moderate', tone: 'mint', icon: '▣' },
  { time: '3 TO 5 YEARS', title: 'Balance and grow', options: ['Hybrid fund', 'Multi-asset fund', 'REIT'], use: 'Medium-term goals with some market exposure', risk: 'Moderate', tone: 'sky', icon: '◇' },
  { time: '5+ YEARS', title: 'Build long-term wealth', options: ['Equity mutual fund', 'ETF', 'Direct stocks'], use: 'Long-term goals, with room for market swings', risk: 'High', tone: 'gold', icon: '↗' },
  { time: '5 TO 15+ YEARS', title: 'Add long-term anchors', options: ['PPF', 'EPF', 'NPS', 'Sovereign Gold Bond'], use: 'Retirement, pension and diversification', risk: 'Varies by product', tone: 'violet', icon: '✦' },
] as const;

export default function InvestmentHorizonGraphic() {
  return <section className="investment-map-section" aria-labelledby="investment-map-heading">
    <div className="investment-map-heading">
      <div><span className="campaign-copy-kicker">A CLEARER WAY TO CHOOSE</span><h2 id="investment-map-heading">Match your money to your timeline.</h2><p>Explore the investment choices from your supplied guide, arranged around when you may need the money.</p></div>
      <a href="/investments">Explore all investments <span aria-hidden="true">↗</span></a>
    </div>
    <div className="investment-map-art" role="img" aria-label="Investment options by time horizon, from accessible short-term savings to long-term growth and retirement products. Risk varies by product.">
      <div className="investment-map-art-header"><span className="investment-map-glow" aria-hidden="true" /><div><span>THE INVESTMENT TIMELINE</span><strong>Five horizons. One clearer view.</strong></div><div className="investment-map-orbit" aria-hidden="true">₹<i /><b /></div></div>
      <div className="investment-map-column-head" aria-hidden="true"><span>WHEN</span><span>OPTIONS TO EXPLORE</span><span>WHAT IT CAN HELP WITH</span><span>RISK</span></div>
      <div className="investment-map-rows">{rows.map((row, index) => <div className={`investment-map-row tone-${row.tone}`} key={row.time}>
        <div className="investment-map-when"><span className="investment-map-number">0{index + 1}</span><span className="investment-map-symbol" aria-hidden="true">{row.icon}</span><div><small>{row.time}</small><strong>{row.title}</strong></div></div>
        <div className="investment-map-options">{row.options.map(option => <span key={option}>{option}</span>)}</div>
        <p>{row.use}</p><div className="investment-map-risk"><span className="investment-map-risk-dot" />{row.risk}</div>
      </div>)}</div>
      <div className="investment-map-art-footer"><span>TIME HORIZON <span aria-hidden="true">━━━▶</span> LONGER-TERM GOALS</span><span>Investments can lose value. Product terms and suitability differ.</span></div>
    </div>
    <p className="investment-map-source">Adapted from the investment types table you provided. The document’s return ranges and tax notes are omitted because they require current, product-specific verification.</p>
  </section>;
}
