import { useEffect, useState, type FormEvent } from 'react';
import { ShieldCheck, ArrowRight, TrendingUp, Home, Calculator, ChartNoAxesCombined, MapPin } from 'lucide-react';
import { authClient } from '@/lib/auth';
import termInsuranceImage from '@/assets/marketing/family-protection.webp';
import investmentOptionsImage from '@/assets/marketing/investment-choices.webp';
import OriginalLandingSections from '@/components/home/OriginalLandingSections';

export default function SignInPage({ onDemo, initialError = '' }: { onDemo?: () => void; initialError?: string }) {
  const [phone, setPhone] = useState('');
  const [customerName,setCustomerName]=useState('');
  const [sentPhone, setSentPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(initialError);
  const [cooldown, setCooldown] = useState(0);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  const requireAuth = () => {
    if (!authClient) throw new Error('Sign-in is not available yet. Please try again once the service is connected.');
    return authClient;
  };
  const google = async () => {
    setBusy(true); setMessage('');
    try {
      const client=requireAuth();
      sessionStorage.removeItem('chanakya.welcomeName');
      sessionStorage.setItem('chanakya.voiceWelcome','pending');
      const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + window.location.pathname } });
      if (error) throw error;
    } catch (error) { sessionStorage.removeItem('chanakya.voiceWelcome'); sessionStorage.removeItem('chanakya.welcomeName'); setMessage(error instanceof Error ? error.message : 'Could not start Google sign-in.'); }
    finally { setBusy(false); }
  };
  const sendCode = async (event?: FormEvent) => {
    event?.preventDefault();
    if (busy || cooldown) return;
    const number = sentPhone || '+91' + phone;
    if (!/^\+91[6-9]\d{9}$/.test(number)) { setMessage('Enter a valid 10-digit Indian mobile number.'); return; }
    setBusy(true); setMessage('');
    try {
      const { error } = await requireAuth().auth.signInWithOtp({ phone: number });
      if (error) throw error;
      setSentPhone(number); setOtp(''); setCooldown(60); setMessage('Code sent. Check your SMS messages.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not send the code. Please retry.'); }
    finally { setBusy(false); }
  };
  const verify = async (event: FormEvent) => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setMessage('');
    try {
      const client=requireAuth();
      sessionStorage.setItem('chanakya.voiceWelcome','pending');
      sessionStorage.setItem('chanakya.welcomeName',customerName.trim());
      const { data, error } = await client.auth.verifyOtp({ phone: sentPhone, token: otp, type: 'sms' });
      if (error) throw error;
      if (!data.session) throw new Error('Verification did not complete. Please request a new code.');
    } catch (error) { sessionStorage.removeItem('chanakya.voiceWelcome'); sessionStorage.removeItem('chanakya.welcomeName'); setMessage(error instanceof Error ? error.message : 'Code verification failed.'); }
    finally { setBusy(false); }
  };
  return <div className="welcome-shell">
    <main>
      <div className="landing-hero campaign-landing-hero">
        <header className="welcome-header has-demo">
          <div className="landing-brand-stack">
            <a href="/" className="cf-brand"><span className="cf-logo"><TrendingUp size={22} aria-hidden="true" /></span><span>Chanakya Finance</span></a>
            <a href="/demo" className="landing-demo-button" onClick={onDemo ? event => { event.preventDefault(); onDemo(); } : undefined}>Interactive demo</a>
          </div>
          <nav className="landing-nav" aria-label="On this page">
            <a className="landing-nav-home" href="/"><Home size={18} aria-hidden="true" />Home</a>
            <a href="/calculators" target="_blank" rel="noopener noreferrer"><Calculator size={18} aria-hidden="true" />Calculator</a>
            <a href="/investments"><TrendingUp size={18} aria-hidden="true" />Investments</a>
            <a href="/mutual-funds"><ChartNoAxesCombined size={18} aria-hidden="true" />Mutual Funds</a>
            <a href="/expenses"><MapPin size={18} aria-hidden="true" />City Expenses</a>
          </nav>
          <a className="cf-button cf-primary landing-signin-link" href="#customer-signin">Sign in</a>
        </header>
        <div className="landing-motto"><p lang="te">ధనం మూలం ఇదం జగత్</p><p lang="hi">धन ही इस संसार का आधार है।</p><p lang="en">Money is the foundation that runs this world</p></div>
        <div className="campaign-hero-content">
          <img src={termInsuranceImage} alt="" />
          <div className="campaign-hero-copy">
            <span className="campaign-copy-kicker">FAMILY PROTECTION</span>
            <h1>I'm 26. How do I protect the people I love?</h1>
            <p>Compare term cover and estimated premiums with your own details.</p>
            <a className="cf-button cf-primary campaign-hero-cta" href="#customer-signin">Start my plan <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <div className="landing-showcase">
            <a className="campaign-feature-card" href="/investments">
              <img src={investmentOptionsImage} alt="" loading="lazy" />
              <div className="campaign-feature-copy">
                <span className="campaign-copy-kicker">INVEST WITH CLARITY</span>
                <h2>Your dreams deserve more than a guess.</h2>
                <p>Compare gold, mutual funds and NPS, with risk beside potential growth.</p>
              </div>
              <span>Explore investments <ArrowRight size={17} aria-hidden="true" /></span>
            </a>
    <section className="signin-card" id="customer-signin" tabIndex={-1}><div className="cf-eyebrow">YOUR ACCOUNT</div><h2>Sign in to Chanakya</h2><p>Sign in to start your personal money plan.</p><button className="cf-button google-button" disabled={busy} onClick={google}><span className="google-letter">G</span>Continue with Google</button><div className="signin-divider">or use your mobile number</div>
    {!sentPhone ? <form onSubmit={sendCode}><label htmlFor="customer-name">Your first name (optional)</label><input id="customer-name" className="cf-input" autoComplete="given-name" maxLength={60} value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="How should we greet you?" disabled={busy} style={{marginBottom:16}}/><label htmlFor="mobile">Mobile number</label><div className="mobile-field"><span>🇮🇳 &nbsp; +91</span><input id="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="Enter 10-digit number" required disabled={busy} /></div><p className="cf-help">We’ll send a one-time code to verify it.</p><button className="cf-button cf-primary" disabled={busy || cooldown > 0}>{busy ? 'Please wait…' : cooldown > 0 ? `Request a code in ${cooldown}s` : 'Get verification code'}</button></form>
    : <form onSubmit={verify}><label htmlFor="code">Code sent to {sentPhone.slice(0, 3)} ••••••{sentPhone.slice(-4)}</label><input id="code" className="cf-input otp-input" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required autoFocus /><button className="cf-button cf-primary" disabled={busy}>{busy ? 'Verifying…' : 'Verify and continue'}</button><div className="signin-links"><button type="button" disabled={busy} onClick={() => { setSentPhone(''); setOtp(''); setMessage(''); }}>Change number</button><button type="button" disabled={busy || cooldown > 0} onClick={() => sendCode()}>{cooldown ? `Resend in ${cooldown}s` : 'Resend code'}</button></div></form>}
    {message && <p className="signin-message" role="status">{message}</p>}<div className="signin-privacy"><ShieldCheck size={18} /><p>Your financial details stay yours.<small>We never ask for your bank password or payment PIN.</small></p></div></section>
      </div>
      <OriginalLandingSections />
    </main><footer className="cf-footer"><span>© {new Date().getFullYear()} Chanakya Finance Solutions</span><span>Clarity today. Confidence tomorrow.</span></footer>
  </div>;
}
