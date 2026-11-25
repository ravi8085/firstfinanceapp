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

export default function SiteNavigation({ activeHref, className = '' }: { activeHref?: string; className?: string }) {
  const current = activeHref ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  return <nav className={`unified-site-nav ${className}`} aria-label="Main navigation">
    {items.map(({ href, label, icon: Icon }) => {
      const active = current === href || (href === '/calculators' && ['/calculator', '/fd-calculator', '/sip-calculator', '/nps-calculator', '/investment-calculator'].includes(current));
      return <a className={active ? 'unified-nav-active' : undefined} href={href} key={href} aria-current={active ? 'page' : undefined}><Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></a>;
    })}
  </nav>;
}
