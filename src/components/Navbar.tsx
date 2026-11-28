import { LogOut, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import SiteNavigation from './SiteNavigation';

export default function Navbar() {
  const { demo, signOut } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true);
    try { await signOut(); } catch { setError('Could not sign out. Please try again.'); }
    finally { setBusy(false); }
  };

  return <>
    <SiteNavigation footer={<div className="sidebar-account"><span className="sidebar-avatar"><UserRound size={17} aria-hidden="true" /></span><span className="sidebar-account-name">{demo ? 'Interactive demo' : 'My account'}<small>{demo ? 'Preview mode' : 'Signed in'}</small></span><button type="button" className="sidebar-signout" aria-label="Sign out" onClick={logout} disabled={busy}><LogOut size={17} aria-hidden="true" /></button></div>} />
    {error && <p className="signin-message" role="alert">{error}</p>}
  </>;
}

