import { useState } from 'react';
import { ShieldCheck, ArrowRight, LogIn } from 'lucide-react';
import { authClient } from '@/lib/auth';
import investmentOptionsImage from '@/assets/marketing/investment-choices.webp';
import investmentHeroImage from '@/assets/marketing/investment-horizons-hero.webp';
import OriginalLandingSections from '@/components/home/OriginalLandingSections';
import SiteNavigation from '@/components/SiteNavigation';
import InvestmentHorizonGraphic from '@/components/home/InvestmentHorizonGraphic';
import LandingGoals from '@/components/home/LandingGoals';

export default function SignInPage({ onDemo, initialError = '' }: { onDemo?: () => void; initialError?: string }) {
  const [selectedGoalName,setSelectedGoalName]=useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(initialError);
  const requireAuth = () => {
    if (!authClient) throw new Error('Sign-in is not available yet. Please try again once the service is connected.');
    return authClient;
  };
  const socialSignIn = async (provider: 'google' | 'azure', providerName: string) => {
    setBusy(true); setMessage('');
    try {
      const client=requireAuth();
      sessionStorage.removeItem('chanakya.welcomeName');
      sessionStorage.setItem('chanakya.voiceWelcome','pending');
      const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin + window.location.pathname, ...(provider === 'azure' ? { scopes: 'email' } : {}) } });
      if (error) throw error;
    } catch (error) { sessionStorage.removeItem('chanakya.voiceWelcome'); sessionStorage.removeItem('chanakya.welcomeName'); setMessage(error instanceof Error ? error.message : `Could not start ${providerName} sign-in.`); }
    finally { setBusy(false); }
  };
  return <div className="welcome-shell landing-reference-shell">
    <SiteNavigation activeHref="/" footer={<a className="sidebar-signin" href="#customer-signin"><LogIn size={17} aria-hidden="true"/><span>Sign in to start</span></a>} />
    <main>
      <div className="landing-hero campaign-landing-hero landing-reference-hero">
        <img className="landing-reference-hero-art" src={investmentHeroImage} alt="" aria-hidden="true" />
        <div className="landing-motto" aria-label="ధనం మూలం ఇదం జగత్ | धन ही इस संसार का आधार है। | Money is the foundation that runs this world"><span lang="te">ధనం మూలం ఇదం జగత్</span><span className="motto-divider" aria-hidden="true">|</span><span lang="hi">धन ही इस संसार का आधार है।</span><span className="motto-divider" aria-hidden="true">|</span><span lang="en">Money is the foundation that runs this world</span></div>
        <div className="landing-goal-intro"><span>CHANAKYA FINANCE SOLUTIONS · BUILT FOR INDIA</span><h1>Your salary, <em>smartly invested.</em></h1><p>Choose a goal to get a clear path from today’s income to the future you’re building.</p></div>
        <LandingGoals onSelect={setSelectedGoalName} onDemo={onDemo} />
      </div>
      <div className="landing-showcase">
            <a className="campaign-feature-card" href="/investments">
              <img src={investmentOptionsImage} alt="" loading="lazy" />
              <div className="campaign-feature-copy">
                <span className="campaign-copy-kicker">INVEST WITH CLARITY</span>
                <h2>Small steps today. Bigger possibilities tomorrow.</h2>
                <p>Explore gold, mutual funds and NPS, with risk and potential growth side by side.</p>
              </div>
              <span>Explore investments <ArrowRight size={17} aria-hidden="true" /></span>
            </a>
    <section className="signin-card" id="customer-signin" tabIndex={-1}><div className="cf-eyebrow">YOUR ACCOUNT</div><h2>Sign in to Chanakya</h2><p>{selectedGoalName ? `Planning for ${selectedGoalName.toLowerCase()}. Sign in to continue.` : 'Sign in to start your personal money plan.'}</p><div className="signin-social-options"><button className="cf-button google-button" disabled={busy} onClick={() => socialSignIn('google', 'Google')}><span className="google-letter">G</span>Continue with Google</button><button className="cf-button google-button microsoft-button" disabled={busy} onClick={() => socialSignIn('azure', 'Microsoft')}><span className="microsoft-logo" aria-hidden="true"><i/><i/><i/><i/></span>Continue with Microsoft</button></div>
    {message && <p className="signin-message" role="status">{message}</p>}<div className="signin-privacy"><ShieldCheck size={18} /><p>Your financial details stay yours.<small>We never ask for your bank password or payment PIN.</small></p></div></section>
      </div>
      <InvestmentHorizonGraphic />
      <div className="landing-video-wrap">
        <section className="welcome-video-section" aria-labelledby="welcome-video-title">
          <div className="welcome-video-copy">
            <span className="campaign-copy-kicker">A WELCOME FROM CHANAKYA</span>
            <h2 id="welcome-video-title">Care for what you earn. Build toward what matters.</h2>
            <p>Every rupee reflects your hard work. Give your money care and direction today, and it can help you build the future you dream of.</p>
            <span className="welcome-video-hint">Play the welcome video with Indian English narration</span>
          </div>
          <video className="welcome-video" controls playsInline preload="metadata" poster="/media/chanakya-welcome-poster.webp" aria-label="Narrated welcome to Chanakya Investments">
            <source src="/media/chanakya-welcome.mp4" type="video/mp4" />
            <track kind="captions" src="/media/chanakya-welcome.vtt" srcLang="en" label="English" default />
            Your browser does not support video playback.
          </video>
        </section>
      </div>
      <OriginalLandingSections />
    </main><footer className="cf-footer"><span>© {new Date().getFullYear()} Chanakya Finance Solutions</span><span>Clarity today. Confidence tomorrow.</span></footer>
  </div>;
}

