import { Link, NavLink } from 'react-router-dom';
import { BarChart3, Calculator, ChartNoAxesCombined, Home, LogOut, MapPin, Menu, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/mutual-funds', label: 'Mutual Funds', icon: ChartNoAxesCombined },
];

export default function Navbar() {
  const { demo, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const logout = async () => { setBusy(true); try { await signOut(); } catch { setError('Could not sign out. Please try again.'); } finally { setBusy(false); } };

  return <><header className="app-header site-header"><Link to="/" className="cf-brand"><span className="cf-logo"><TrendingUp size={22} aria-hidden="true" /></span><span>Chanakya Finance</span></Link><nav className={open ? 'app-links open' : 'app-links'} aria-label="Main navigation">{links.map(({ to, label, icon: Icon }) => <NavLink end={to === '/'} to={to} key={to} onClick={() => setOpen(false)}><Icon size={17} aria-hidden="true" />{label}</NavLink>)}<a href="/investments" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><TrendingUp size={17} aria-hidden="true" />Investments ↗</a><a href="/expenses" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><MapPin size={17} aria-hidden="true" />City Expenses ↗</a><a href="/calculators" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}><BarChart3 size={17} aria-hidden="true" />Financial Calculators ↗</a><NavLink to="/fixed-deposits" onClick={() => setOpen(false)}>Fixed Deposits</NavLink><NavLink to="/term-insurance" onClick={() => setOpen(false)}>Term Insurance</NavLink></nav><div className="account-actions">{demo && <span className="cf-badge">Demo</span>}<button aria-label="Sign out" onClick={logout} disabled={busy}><LogOut size={18} /></button><button className="menu-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div></header>{error && <p className="signin-message" role="alert">{error}</p>}</>;
}
