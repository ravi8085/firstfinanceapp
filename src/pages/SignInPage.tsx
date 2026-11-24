import { useEffect, useState, type FormEvent } from 'react';
import { ShieldCheck, ArrowUpRight, BriefcaseBusiness, ReceiptText, TrendingUp, Target, RefreshCw } from 'lucide-react';
import { authClient } from '@/lib/auth';
import financeHero from '@/assets/finance-hero.jpg';

const journeySteps = [
  { title: 'Understand', description: 'Income, family & expenses', icon: BriefcaseBusiness },
  { title: 'Organise', description: 'Budget & debt payments', icon: ReceiptText },
  { title: 'Protect', description: 'Emergency fund & insurance', icon: ShieldCheck },
  { title: 'Invest', description: 'Goals, time & risk', icon: TrendingUp },
  { title: 'Plan ahead', description: 'Home, education & retirement', icon: Target },
  { title: 'Review', description: 'Adjust as life changes', icon: RefreshCw },
];

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
      <div className="landing-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(5, 12, 25, .88), rgba(5, 12, 25, .55)), url(${financeHero})` }}>
        <header className="welcome-header">
          <a href="/" className="cf-brand"><span className="cf-logo">च</span><span>chanakya<small>FINANCE, SIMPLIFIED</small></span></a>
          <nav className="landing-nav" aria-label="On this page">
            <a href="#sample-budget">Sample budget</a>
            <a href="#planning-journey">How it works</a>
            <a href="/calculators" target="_blank" rel="noopener noreferrer">Calculators ↗</a>
          </nav>
          <a className="cf-button cf-primary landing-signin-link" href="#customer-signin">Sign in</a>
        </header>
        <div className="landing-hero-inner">
          <div className="landing-intro">
            <h1>Plan your money.<br /><em>Build your future.</em></h1>
            <p>Start with your salary and expenses. See what you can save, how to protect your family, and what it takes to fund your goals.</p>
            <a className="cf-button cf-primary landing-start" href="#customer-signin">Start planning <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <div className="landing-showcase">
            <div id="sample-budget" className="landing-example">
            <figure className="landing-income-visual"><div className="budget-art"><div className="budget-art-header"><div><span className="budget-art-kicker">EXAMPLE PLAN</span><h2>A month with a plan.</h2><p>Take-home income</p></div><strong>₹80,000<small>/ month</small></strong></div><div className="budget-art-main"><div className="budget-donut" role="img" aria-label="Monthly income: 50% everyday living, 10% safety buffer, 40% investments"><div className="budget-donut-core"><span>YOUR MONTH</span><strong>₹80k</strong><small>planned</small></div></div><div className="budget-breakdown"><div className="budget-breakdown-row living"><span>Everyday living</span><strong>₹40,000</strong><b>50%</b></div><div className="budget-breakdown-row safety"><span>Safety buffer</span><strong>₹8,000</strong><b>10%</b></div><div className="budget-breakdown-row investing"><span>Investments</span><strong>₹32,000</strong><b>40%</b></div></div></div><div className="budget-investment-header"><span>INSIDE THE ₹32,000 INVESTMENT BUCKET</span><small>Illustrative mix</small></div><div className="budget-investments"><div className="budget-investment-card fd"><span>Bank fixed deposit</span><strong>₹8,000</strong><small>Lower risk*</small></div><div className="budget-investment-card debt"><span>Debt mutual fund</span><strong>₹8,000</strong><small>Risk varies*</small></div><div className="budget-investment-card equity"><span>Equity mutual fund</span><strong>₹16,000</strong><small>High / very high*</small></div></div></div><figcaption>Illustrative split, not a recommendation. Your plan depends on your expenses, goals and risk capacity. <details><summary>Understand the risk labels</summary><p>Risk labels are indicative, not official ratings for a particular product. Mutual fund risk varies by scheme; check its latest <a href="https://investor.sebi.gov.in/riskometer.html" target="_blank" rel="noreferrer">SEBI Riskometer</a>. Bank deposits carry bank, inflation and liquidity risks; <a href="https://www.dicgc.org.in/guide-to-deposit-insurance" target="_blank" rel="noreferrer">DICGC cover</a> has eligibility and per-depositor, per-bank limits. Insurance is protection, separate from investments.</p></details></figcaption></figure>
            </div>
    <section className="signin-card" id="customer-signin" tabIndex={-1}><div className="cf-eyebrow">YOUR ACCOUNT</div><h2>Sign in to Chanakya</h2><p>Sign in to start your personal money plan.</p><button className="cf-button google-button" disabled={busy} onClick={google}><span className="google-letter">G</span>Continue with Google</button><div className="signin-divider">or use your mobile number</div>
    {!sentPhone ? <form onSubmit={sendCode}><label htmlFor="customer-name">Your first name (optional)</label><input id="customer-name" className="cf-input" autoComplete="given-name" maxLength={60} value={customerName} onChange={e=>setCustomerName(e.target.value)} placeholder="How should we greet you?" disabled={busy} style={{marginBottom:16}}/><label htmlFor="mobile">Mobile number</label><div className="mobile-field"><span>🇮🇳 &nbsp; +91</span><input id="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="Enter 10-digit number" required disabled={busy} /></div><p className="cf-help">We’ll send a one-time code to verify it.</p><button className="cf-button cf-primary" disabled={busy || cooldown > 0}>{busy ? 'Please wait…' : cooldown > 0 ? `Request a code in ${cooldown}s` : 'Get verification code'}</button></form>
    : <form onSubmit={verify}><label htmlFor="code">Code sent to {sentPhone.slice(0, 3)} ••••••{sentPhone.slice(-4)}</label><input id="code" className="cf-input otp-input" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} required autoFocus /><button className="cf-button cf-primary" disabled={busy}>{busy ? 'Verifying…' : 'Verify and continue'}</button><div className="signin-links"><button type="button" disabled={busy} onClick={() => { setSentPhone(''); setOtp(''); setMessage(''); }}>Change number</button><button type="button" disabled={busy || cooldown > 0} onClick={() => sendCode()}>{cooldown ? `Resend in ${cooldown}s` : 'Resend code'}</button></div></form>}
    {message && <p className="signin-message" role="status">{message}</p>}<div className="signin-privacy"><ShieldCheck size={18} /><p>Your financial details stay yours.<small>We never ask for your bank password or payment PIN.</small></p></div>{onDemo && <div className="demo-entry"><span>Want to see how it works?</span><button onClick={onDemo}>Explore the interactive demo</button><small>Demo only · no account created</small></div>}</section>
      </div>
      <div className="landing-access">
        <div className="landing-access-copy">
          <h2>Start with what you know.</h2>
          <p>Tell us about your income and expenses in your own words, or enter them in a simple form. Review your details before you build your plan.</p>
        </div>
</div><section id="planning-journey" className="landing-journey" aria-labelledby="journey-title"><div className="landing-journey-heading"><div><div className="cf-eyebrow">THE BIG PICTURE</div><h2 id="journey-title">From your first input to your future goals.</h2><p>See how your income, protection, investments and life goals fit together.</p></div><a className="cf-button cf-secondary" href="#customer-signin">Build my plan</a></div><div className="journey-scene"><div className="journey-scene-heading"><span>YOUR FINANCIAL PLANNING JOURNEY</span><strong>Clarity today. A plan that grows with you.</strong></div><ol className="journey-workflow">{journeySteps.map((step, index) => { const Icon = step.icon; return <li className="journey-step" key={step.title}><div className="journey-step-number">{String(index + 1).padStart(2, '0')}</div><div className="journey-icon"><Icon size={31} strokeWidth={1.8} aria-hidden="true" /></div><h3>{step.title}</h3><p>{step.description}</p></li>; })}</ol></div><p className="landing-journey-note">Start with your voice or a form. Review your details, explore the illustrations, and update your plan as your circumstances change.</p></section></main><footer className="cf-footer"><span>© {new Date().getFullYear()} Chanakya Finance Solutions</span><span>Clarity today. Confidence tomorrow.</span></footer>
  </div>;
}
