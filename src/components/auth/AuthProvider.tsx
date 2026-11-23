import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { authClient, demoEnabled } from '@/lib/auth';
import SignInPage from '@/pages/SignInPage';
import {customerFirstName} from '@/lib/greeting';

interface AuthState { session: Session | null; demo: boolean; signOut: () => Promise<void>; customerName:string; autoVoicePending:boolean; consumeAutoVoice:()=>void }
const AuthContext = createContext<AuthState | null>(null);
export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider is required');
  return value;
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [enteredName,setEnteredName]=useState('');
  const [autoVoicePending,setAutoVoicePending] = useState(false);
  const consumeAutoVoice = useCallback(()=>setAutoVoicePending(false),[]);
  const [session, setSession] = useState<Session | null>(null);
  const [demo, setDemo] = useState(false);
  const [loading, setLoading] = useState(!!authClient);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!authClient) return;
    let active = true;
    const { data: { subscription } } = authClient.auth.onAuthStateChange((event, next) => {
      if (active) {
        setSession(next); setLoading(false);
        if (next && (event==='SIGNED_IN'||event==='INITIAL_SESSION') && sessionStorage.getItem('chanakya.voiceWelcome')==='pending') {
          sessionStorage.removeItem('chanakya.voiceWelcome');
          setEnteredName(customerFirstName({name:sessionStorage.getItem('chanakya.welcomeName')}));
          sessionStorage.removeItem('chanakya.welcomeName');
          setAutoVoicePending(true);
        }
      }
    });
    authClient.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError('Your session could not be restored. Please sign in again.');
      else setSession(data.session);
      setLoading(false);
    }).catch(() => { if (active) { setError('Could not connect. Please try signing in again.'); setLoading(false); } });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);
  useEffect(()=>{if(autoVoicePending&&(session||demo))navigate('/calculator?mode=voice',{replace:true});},[autoVoicePending,session,demo,navigate]);
  const signOut = async () => {
    if (authClient && session) {
      const { error: signOutError } = await authClient.auth.signOut();
      if (signOutError) throw signOutError;
    }
    sessionStorage.removeItem('chanakya.voiceWelcome');sessionStorage.removeItem('chanakya.welcomeName');setEnteredName('');
    setAutoVoicePending(false); setDemo(false); setSession(null);
  };
  if (loading) return <main className="auth-loading" role="status">Restoring your secure session…</main>;
  if (!session && !demo) return <SignInPage initialError={error} onDemo={demoEnabled ? () => {setAutoVoicePending(true);setDemo(true);} : undefined} />;
  return <AuthContext.Provider value={{ session, demo, signOut, customerName:customerFirstName(session?.user.user_metadata)||enteredName, autoVoicePending, consumeAutoVoice }}>{children}</AuthContext.Provider>;
}
