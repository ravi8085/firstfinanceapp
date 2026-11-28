import type { ReactNode } from 'react';
import { BookOpen, Calculator, ChartNoAxesCombined, Home, Landmark, MapPin, ShieldCheck, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type NavigationItem = { href: string; label: string; icon: LucideIcon };

const workspaceItems: NavigationItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/calculators', label: 'Calculator', icon: Calculator },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
  { href: '/mutual-funds', label: 'Mutual Funds', icon: ChartNoAxesCombined },
];

const planningItems: NavigationItem[] = [
  { href: '/expenses', label: 'City Expenses', icon: MapPin },
  { href: '/fixed-deposits', label: 'Fixed Deposits', icon: Landmark },
  { href: '/term-insurance', label: 'Term Insurance', icon: ShieldCheck },
  { href: '/knowledge', label: 'Knowledge', icon: BookOpen },
];

const calculatorPaths = ['/calculator', '/fd-calculator', '/sip-calculator', '/nps-calculator', '/investment-calculator'];

export default function SiteNavigation({ activeHref, className = '', footer }: { activeHref?: string; className?: string; footer?: ReactNode }) {
  const current = activeHref ?? (typeof window === 'undefined' ? '/' : window.location.pathname);
  const renderItems = (links: NavigationItem[]) => links.map(({ href, label, icon: Icon }) => {
    const active = current === href || (href === '/calculators' && calculatorPaths.includes(current));
    return <a className={active ? 'unified-nav-active' : undefined} href={href} key={href} aria-current={active ? 'page' : undefined}><Icon size={18} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></a>;
  });

  return <aside className={`unified-sidebar ${className}`} aria-label="Chanakya navigation">
    <a href="/" className="sidebar-brand"><span className="sidebar-logo"><TrendingUp size={21} aria-hidden="true" /></span><span>Chanakya Finance<small>FINANCE, SIMPLIFIED</small></span></a>
    <nav className="unified-site-nav" aria-label="Main navigation">
      <div className="sidebar-nav-group"><span className="sidebar-nav-heading">WORKSPACE</span>{renderItems(workspaceItems)}</div>
      <div className="sidebar-nav-group"><span className="sidebar-nav-heading">PLANNING</span>{renderItems(planningItems)}</div>
    </nav>
    {footer && <footer className="sidebar-footer">{footer}</footer>}
  </aside>;
}

