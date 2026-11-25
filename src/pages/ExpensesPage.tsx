import { useState } from 'react';
import CityBenchmarks from '@/components/calculator/CityBenchmarks';
import { cityExpenses, formatCurrency } from '@/data/investmentData';
import { cityNames } from '@/lib/cityPrices';

const columns = [
  { key: 'food', label: 'Food' },
  { key: 'transport', label: 'Transport' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'entertainment', label: 'Leisure' },
  { key: 'miscellaneous', label: 'Other' },
] as const;


function rentEstimates(localities: { bhk1: string }[]) {
  const ranges = localities.map(({ bhk1 }) => {
    const amounts = [...bhk1.matchAll(/[\d,]+/g)].map(match => Number(match[0].replace(/,/g, '')));
    return amounts.length === 2 ? amounts : null;
  }).filter((range): range is number[] => range !== null);
  if (!ranges.length) return null;
  const minimum = Math.min(...ranges.map(range => range[0]));
  const maximum = Math.max(...ranges.map(range => range[1]));
  const average = Math.round(ranges.reduce((sum, range) => sum + (range[0] + range[1]) / 2, 0) / ranges.length);
  return { minimum, average, maximum };
}

export default function ExpensesPage() {
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const selectedEstimate = cityExpenses.find(item => item.city === selectedCity);

  return <main className="planner-page city-guide-page">
    <header className="city-guide-heading"><div><h1>City expenses across India</h1><p>Compare living-cost details for {cityNames.length} currently listed cities. Select a city to see its neighbourhood rents and published item prices.</p></div></header>
    <p className="city-guide-note" role="note">Approximate budgets for one person, taken from the original app’s illustrative figures. They have no verified survey source or update date. The rent columns use the lowest and highest values from listed locality ranges, plus the mean of their midpoints. These are estimates across listed localities, not measured city averages or guaranteed minimum rents. Enter your own actual bills for a personal plan.</p>
    <div className="city-price-table city-guide-table"><table><caption>Approximate monthly living costs in ₹ for one person. Each total adds the matching 1-bedroom rent estimate to food, transport, utilities, leisure and other costs.</caption><thead><tr><th scope="col">City</th><th scope="col">Rent low</th><th scope="col">Rent midpoint average</th><th scope="col">Rent high</th>{columns.map(column => <th key={column.key} scope="col">{column.label}</th>)}<th scope="col">Total with low rent</th><th scope="col">Total with midpoint rent</th><th scope="col">Total with high rent</th></tr></thead><tbody>{cityNames.map(city => {
      const estimate = cityExpenses.find(item => item.city === city);
      const rent = estimate ? rentEstimates(estimate.localities) : null;
      const otherCosts = estimate ? columns.reduce((sum, column) => sum + estimate[column.key], 0) : null;
      return <tr key={city} className={selectedCity === city ? 'city-row-selected' : ''}><th scope="row"><button type="button" onClick={() => setSelectedCity(city)} aria-pressed={selectedCity === city}>{city}</button></th><td>{rent ? formatCurrency(rent.minimum) : '—'}</td><td>{rent ? formatCurrency(rent.average) : '—'}</td><td>{rent ? formatCurrency(rent.maximum) : '—'}</td>{columns.map(column => <td key={column.key}>{estimate ? formatCurrency(estimate[column.key]) : '—'}</td>)}<td><strong>{rent && otherCosts !== null ? formatCurrency(otherCosts + rent.minimum) : '—'}</strong></td><td><strong>{rent && otherCosts !== null ? formatCurrency(otherCosts + rent.average) : '—'}</strong></td><td><strong>{rent && otherCosts !== null ? formatCurrency(otherCosts + rent.maximum) : '—'}</strong></td></tr>;
    })}</tbody></table></div>
    {selectedEstimate && <section className="city-locality-section" aria-labelledby="city-locality-title"><h2 id="city-locality-title">{selectedCity} neighbourhood rent guide</h2><p>Illustrative monthly rent ranges from the original app. These have no verified listing source or update date; check current local listings before making a decision.</p><div className="city-price-table city-guide-table"><table><caption>Rent ranges by home size in {selectedCity}</caption><thead><tr><th scope="col">Neighbourhood</th><th scope="col">1 bedroom</th><th scope="col">2 bedrooms</th><th scope="col">3 bedrooms</th></tr></thead><tbody>{selectedEstimate.localities.map(locality => <tr key={locality.locality}><th scope="row">{locality.locality}</th><td>{locality.bhk1}</td><td>{locality.bhk2}</td><td>{locality.bhk3}</td></tr>)}</tbody></table></div></section>}
    <p className="city-guide-note">Housing varies by locality and home size. Food, transport and utilities vary by household and usage. Published price data appears below when a city has a current provider feed.</p>
    <CityBenchmarks city={selectedCity} />
  </main>;
}

