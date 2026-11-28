import { BookOpen, Calculator, ChartNoAxesCombined, Home, Landmark, MapPin, ShieldCheck, TrendingUp } from 'lucide-react';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/calculators', label: 'Calculator', icon: Calculator },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
  { href: '/knowledge', label: 'Knowledge', icon: BookOpen },
  { href: '/mutual-funds', label: 'Mutual Funds', icon: ChartNoAxesCombined },
  { href: '/expenses', label: 'City Expenses', icon: MapPin },
  { href: '/fixed-deposits', label: 'Fixed Deposits', icon: Landmark },
  { href: '/term-insurance', label: 'Term Insurance', icon: ShieldCheck },
];
const landingItems = [
  { href: '/calculators', label: 'Calculators', icon: Calculator },
  { href: '/expenses', label: 'City Expenses', icon: MapPin },
  { href: '/knowledge', label: 'Knowledge', icon: BookOpen },
  { href: '/investments', label: 'Investment Types', icon: TrendingUp },
  { href: '/mutual-funds', label: 'Mutual funds', icon: ChartNoAxesCombined },
  { href: '/term-insurance', label: 'Term Insurance', icon: ShieldCheck },
];

export default function SiteNavigation({ activeHref, className = '', variant = 'standard' }: { activeHref?: string; className?: string; variant?: 'standard' | 'landing' }) {
  const current = activeHref ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  const links = variant === 'landing' ? landingItems : items;
  return <nav className={`unified-site-nav ${className}`} aria-label="Main navigation">
    {links.map(({ href, label, icon: Icon }) => {
      const active = current === href || (href === '/calculators' && ['/calculator', '/fd-calculator', '/sip-calculator', '/nps-calculator', '/investment-calculator'].includes(current));
      return <a className={active ? 'unified-nav-active' : undefined} href={href} key={href} aria-current={active ? 'page' : undefined}><Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></a>;
    })}
  </nav>;
}
