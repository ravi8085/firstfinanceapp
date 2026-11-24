import { Link, NavLink } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
const links = [['/', 'Overview'], ['/calculator', 'My money plan'], ['/investments', 'Learn'], ['/mutual-funds', 'Mutual funds'], ['/expenses', 'City expenses'], ['/fixed-deposits', 'Fixed deposits'], ['/term-insurance', 'Term insurance']];
export default function Navbar() {
  const { demo, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const logout = async () => { setBusy(true); try { await signOut(); } catch { setError('Could not sign out. Please try again.'); } finally { setBusy(false); } };
  return <><header className="app-header"><Link to="/" className="cf-brand"><span className="cf-logo">च</span><span>chanakya<small>FINANCE, SIMPLIFIED</small></span></Link><nav className={open ? 'app-links open' : 'app-links'} aria-label="Main navigation">{links.map(([to, label]) => <NavLink end={to === '/'} to={to} key={to} onClick={() => setOpen(false)}>{label}</NavLink>)}<a href="/calculators" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Calculators ↗</a></nav><div className="account-actions">{demo && <span className="cf-badge">Demo</span>}<button aria-label="Sign out" onClick={logout} disabled={busy}><LogOut size={18} /></button><button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div></header>{error && <p className="signin-message" role="alert">{error}</p>}</>;
}
