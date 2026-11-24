import { ArrowRight, BarChart3, BookOpen, Landmark, MapPin, PiggyBank, Shield, TrendingUp } from 'lucide-react';
import investorRakesh from '@/assets/investor-rakesh.jpg';
import investorVijay from '@/assets/investor-vijay.jpg';
import investorDamani from '@/assets/investor-damani.jpg';
import investorPremji from '@/assets/investor-premji.jpg';

const instruments = [
  { title: 'Bank deposits', detail: 'Compare deposit terms and interest schedules.', icon: Landmark, href: '/fixed-deposits' },
  { title: 'Mutual funds', detail: 'Explore fund categories, NAV data, and risk.', icon: TrendingUp, href: '/mutual-funds' },
  { title: 'Family protection', detail: 'Review your insurance cover and protection gap.', icon: Shield, href: '/term-insurance' },
  { title: 'Retirement', detail: 'Explore long-term saving and pension scenarios.', icon: PiggyBank, href: '/calculators' },
];

const investors = [
  { name: 'Rakesh Jhunjhunwala', approach: 'Long-term equity investing', image: investorRakesh },
  { name: 'Vijay Kedia', approach: 'Growth investing', image: investorVijay },
  { name: 'Radhakishan Damani', approach: 'Value investing', image: investorDamani },
  { name: 'Azim Premji', approach: 'Business building', image: investorPremji },
];

const features = [
  { title: 'Smart Allocation', detail: 'See a proposed split based on your income, expenses, goals, and risk.', icon: PiggyBank },
  { title: 'Insurance Planning', detail: 'Estimate how much cover your family may need.', icon: Shield },
  { title: 'Risk Balanced', detail: 'Compare lower and higher risk choices in one view.', icon: TrendingUp },
  { title: 'City-Wise Expenses', detail: 'Explore approximate budgets and source notes across Indian cities.', icon: MapPin },
];

export default function OriginalLandingSections() {
  return <div className="original-landing-sections">
    <section className="original-section original-tools" aria-labelledby="original-tools-title"><div className="original-section-heading"><span className="original-kicker"><BarChart3 size={15} /> FINANCIAL INSTRUMENTS</span><h2 id="original-tools-title">Explore where your money could go</h2><p>Understand the role of savings, investing, and protection before building your personal plan.</p></div><div className="original-instrument-grid">{instruments.map(({ title, detail, icon: Icon, href }) => <a href={href} key={title}><span className="original-icon"><Icon size={24} /></span><h3>{title}</h3><p>{detail}</p><b>Explore <ArrowRight size={16} /></b></a>)}</div></section>
    <section className="original-section original-featured" aria-labelledby="original-fd-title"><div><span className="original-kicker"><Landmark size={15} /> FIXED DEPOSITS</span><h2 id="original-fd-title">Compare bank deposit options</h2><p>Review published bank schedules, choose a tenure, and estimate the interest on your deposit.</p><a className="original-yellow-link" href="/fixed-deposits">View FD comparison <ArrowRight size={17} /></a></div><div className="original-fd-graphic" aria-hidden="true"><span>Deposit</span><div><i/><i/><i/><i/></div><strong>Interest over time</strong></div></section>
    <section className="original-section" aria-labelledby="original-investors-title"><div className="original-section-heading"><span className="original-kicker"><BookOpen size={15} /> LEARN FROM INVESTORS</span><h2 id="original-investors-title">India's investor stories</h2><p>Explore different approaches to long-term investing. Their outcomes are individual and are not return expectations.</p></div><div className="original-investor-grid">{investors.map(({ name, approach, image }) => <article key={name}><img src={image} alt="" loading="lazy" /><div><h3>{name}</h3><p>{approach}</p></div></article>)}</div></section>
    <section className="original-section" aria-labelledby="original-features-title"><div className="original-section-heading"><h2 id="original-features-title">Everything you need to plan</h2><p>Simple tools and illustrations designed for Indian salaried professionals.</p></div><div className="original-feature-grid">{features.map(({ title, detail, icon: Icon }) => <article key={title}><span className="original-icon"><Icon size={22} /></span><h3>{title}</h3><p>{detail}</p></article>)}</div></section>
    <section className="original-section original-last-cta"><h2>Ready to take control of your finances?</h2><p>Start with your salary and expenses, then explore a plan you can adjust.</p><a href="#customer-signin" className="original-yellow-link">Start Planning <ArrowRight size={17} /></a></section>
  </div>;
}
