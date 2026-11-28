import { LogIn } from 'lucide-react';
import SiteNavigation from './SiteNavigation';

export default function PublicHeader({ activeHref = '/calculators' }: { activeHref?: string }) {
  return <SiteNavigation activeHref={activeHref} footer={<a className="sidebar-signin" href="/#customer-signin"><LogIn size={17} aria-hidden="true"/><span>Sign in</span></a>} />;
}

