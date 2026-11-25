import { TrendingUp } from 'lucide-react';
import SiteNavigation from './SiteNavigation';

export default function PublicHeader({ activeHref = '/calculators' }: { activeHref?: string }) {
  return <header className="public-site-header unified-header"><a className="public-site-brand" href="/"><span><TrendingUp size={22} aria-hidden="true" /></span>Chanakya Finance</a><SiteNavigation activeHref={activeHref} /><a className="public-site-signin" href="/#customer-signin">Sign in</a></header>;
}
