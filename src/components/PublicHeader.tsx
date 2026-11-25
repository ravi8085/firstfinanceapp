import { Calculator, ChartNoAxesCombined, Home, MapPin, TrendingUp } from 'lucide-react';

const links = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/calculators', label: 'Calculator', icon: Calculator },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
  { href: '/mutual-funds', label: 'Mutual Funds', icon: ChartNoAxesCombined },
  { href: '/expenses', label: 'City Expenses', icon: MapPin },
];

export default function PublicHeader({ activeHref = '/calculators' }: { activeHref?: string }) {
  return <header className="public-site-header"><a className="public-site-brand" href="/"><span><TrendingUp size={22} aria-hidden="true" /></span>Chanakya Finance</a><nav aria-label="Main navigation">{links.map(({ href, label, icon: Icon }) => <a className={href === activeHref ? 'public-site-active' : ''} href={href} key={href}><Icon size={17} aria-hidden="true" />{label}</a>)}</nav><a className="public-site-signin" href="/#customer-signin">Sign in</a></header>;
}
