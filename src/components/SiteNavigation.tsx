import { useEffect, useState, type ReactNode } from 'react';
import { BookOpen, Calculator, ChartNoAxesCombined, Home, Landmark, MapPin, Menu, ShieldCheck, TrendingUp, X } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = previousOverflow; };
  }, [open]);

  const renderItems = (links: NavigationItem[]) => links.map(({ href, label, icon: Icon }) => {
    const active = current === href || (href === '/calculators' && calculatorPaths.includes(current));
    return <a className={active ? 'unified-nav-active' : undefined} href={href} key={href} aria-current={active ? 'page' : undefined} onClick={close}><Icon size={19} strokeWidth={1.8} aria-hidden="true" /><span>{label}</span></a>;
  });

  return <>
    <header className={`unified-menu-header ${className}`}>
      <a href="/" className="sidebar-brand"><span className="sidebar-logo"><TrendingUp size={21} aria-hidden="true" /></span><span>Chanakya<small>FINANCE, SIMPLIFIED</small></span></a>
      <button type="button" className="menu-trigger" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="chanakya-menu-drawer" onClick={() => setOpen(value => !value)}>{open ? <X size={22} /> : <Menu size={22} />}<span>Menu</span></button>
    </header>
    {open && <>
      <button type="button" className="menu-backdrop" aria-label="Close navigation menu" onClick={close} />
      <aside className="unified-sidebar" id="chanakya-menu-drawer" aria-label="Chanakya navigation">
        <div className="drawer-heading"><span>MENU</span><button type="button" className="drawer-close" aria-label="Close menu" onClick={close}><X size={20} /></button></div>
        <nav className="unified-site-nav" aria-label="Main navigation">
          <div className="sidebar-nav-group"><span className="sidebar-nav-heading">WORKSPACE</span>{renderItems(workspaceItems)}</div>
          <div className="sidebar-nav-group"><span className="sidebar-nav-heading">PLANNING</span>{renderItems(planningItems)}</div>
        </nav>
        {footer && <footer className="sidebar-footer">{footer}</footer>}
      </aside>
    </>}
  </>;
}

