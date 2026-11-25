import { Landmark, TrendingUp, Building2, Umbrella, Gem, Users, Shield, PiggyBank, Wallet, Coins, BarChart3, LineChart, Clock, Home, Handshake } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './financial-instruments.css';

type Risk = 'Lower' | 'Varies' | 'Higher' | 'Very high' | 'Protection';
type Instrument = { name: string; risk: Risk; detail?: string };
type Group = { title: string; icon: LucideIcon; accent: string; instruments: Instrument[] };

export const groups: Group[] = [
  { title: 'Banks & savings', icon: Landmark, accent: 'teal', instruments: [
    { name: 'Fixed Deposits', risk: 'Lower', detail: 'Bank deposit' }, { name: 'Recurring Deposits', risk: 'Lower', detail: 'Regular bank deposit' },
    { name: 'PPF', risk: 'Lower', detail: 'Long-term small savings' }, { name: 'NSC', risk: 'Lower', detail: 'Small-savings certificate' },
    { name: 'SCSS', risk: 'Lower', detail: 'Eligibility applies' }, { name: 'Bank Bonds & Debentures', risk: 'Varies', detail: 'Issuer credit matters' },
    { name: 'Sovereign Gold Bonds', risk: 'Varies', detail: 'Check current availability' }, { name: 'Section 54EC Bonds', risk: 'Varies', detail: 'Eligibility and lock-in apply' },
  ] },
  { title: 'Markets', icon: TrendingUp, accent: 'cyan', instruments: [
    { name: 'Direct Stocks', risk: 'Higher' }, { name: 'IPOs', risk: 'Higher' }, { name: 'Mutual Funds', risk: 'Varies', detail: 'Check scheme Riskometer' },
    { name: 'SIP', risk: 'Varies', detail: 'Investment method' }, { name: 'ETFs', risk: 'Varies' }, { name: 'Futures & Options', risk: 'Very high' },
    { name: 'Commodities', risk: 'Higher' }, { name: 'Forex', risk: 'Very high' }, { name: 'Cryptocurrency', risk: 'Very high' },
  ] },
  { title: 'Government & retirement', icon: Building2, accent: 'gold', instruments: [
    { name: 'EPF', risk: 'Lower', detail: 'Employment-linked' }, { name: 'NPS', risk: 'Varies', detail: 'Market-linked retirement' },
    { name: 'NPS Vatsalya', risk: 'Varies', detail: 'Guardian-managed account' },
  ] },
  { title: 'Insurance & protection', icon: Umbrella, accent: 'pink', instruments: [
    { name: 'Guaranteed Income Plans', risk: 'Varies', detail: 'Read insurer terms' }, { name: 'ULIPs', risk: 'Varies', detail: 'Insurance plus investment' },
    { name: 'Pension Plans', risk: 'Varies' }, { name: 'Savings Plans', risk: 'Varies' }, { name: 'Term Insurance', risk: 'Protection', detail: 'Life cover, not investment return' },
  ] },
  { title: 'Physical assets', icon: Gem, accent: 'amber', instruments: [
    { name: 'Gold', risk: 'Varies' }, { name: 'Silver', risk: 'Varies' }, { name: 'Real Estate', risk: 'Higher', detail: 'Costs and liquidity matter' },
  ] },
  { title: 'Informal arrangements', icon: Users, accent: 'slate', instruments: [
    { name: 'Chits', risk: 'Higher', detail: 'Check registration and terms' }, { name: 'Hand Loans', risk: 'Very high', detail: 'Private lending risk' },
  ] },
];

const groupIcons: Record<string, LucideIcon> = { 'Fixed Deposits': PiggyBank, 'Recurring Deposits': Wallet, PPF: Shield, NSC: Coins, SCSS: Clock, 'Direct Stocks': BarChart3, 'Mutual Funds': LineChart, Gold: Coins, 'Real Estate': Home, Chits: Handshake };

import { investmentKnowledge } from '@/data/investmentKnowledge';

export default function FinancialInstruments() {
  return <section className="financial-instruments" aria-labelledby="financial-instruments-title">
    <div className="financial-instruments-heading"><span>THE FULL LANDSCAPE</span><h2 id="financial-instruments-title">Financial Instruments in India</h2><p>Explore the major ways people save, invest and protect their families. Select a category in the directory below to learn how products work.</p></div>
    <div className="instrument-groups">{groups.map(({ title, icon: Icon, accent, instruments }) => <article className={`instrument-group instrument-${accent}`} key={title}><header><span className="instrument-group-icon"><Icon size={21} aria-hidden="true" /></span><h3>{title}</h3><span className="instrument-count">{instruments.length} options</span></header><div className="instrument-grid">{instruments.map(({ name, risk, detail }) => { const ItemIcon = groupIcons[name] ?? Icon; const knowledge = investmentKnowledge[name]; return <div className="instrument-tile knowledge-hover-tile" key={name} tabIndex={0} aria-label={`${name}. ${knowledge?.definition ?? detail ?? ''} ${risk === 'Protection' ? 'Protection only' : `${risk} risk`}. ${knowledge?.why ?? ''}`}><div className="instrument-name"><ItemIcon size={17} aria-hidden="true" /><strong>{name}</strong></div><span className={`instrument-risk risk-${risk.toLowerCase().replace(' ', '-')}`}>{risk === 'Protection' ? 'Protection only' : `${risk} risk`}</span>{detail && <small>{detail}</small>}<span className="knowledge-hover-panel" aria-hidden="true"><b>What it is</b>{knowledge?.definition ?? detail}<b>When it may help</b>{knowledge?.why ?? 'Compare this option with your goal, time horizon and its current terms.'}<b>Risk</b>{risk === 'Protection' ? 'Protection product, not investment return' : `${risk} risk; check the specific product`}</span></div>; })}</div></article>)}</div>
    <p className="instrument-note">For learning only. These are different products and methods, not equal alternatives. Risk and access vary by provider and product; returns and tax treatment are not shown because they change and require current documents. SIP is a way to invest regularly. Term insurance provides protection, not an investment return.</p>
  </section>;
}
