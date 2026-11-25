import { Link } from 'react-router-dom';
import { LogOut, TrendingUp } from 'lucide-react';
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
    <header className="app-header site-header unified-header">
      <Link to="/" className="cf-brand"><span className="cf-logo"><TrendingUp size={22} aria-hidden="true" /></span><span>Chanakya Finance</span></Link>
      <SiteNavigation />
      <div className="account-actions">{demo && <span className="cf-badge">Demo</span>}<button aria-label="Sign out" onClick={logout} disabled={busy}><LogOut size={18} /></button></div>
    </header>
    {error && <p className="signin-message" role="alert">{error}</p>}
  </>;
}
