import { useEffect, useRef, useState } from 'react';
import { ArrowRight, LoaderCircle, Mic, Search } from 'lucide-react';
import { financialGoals } from '@/data/financialGoals';

interface RecognitionResult { isFinal: boolean; 0: { transcript: string } }
interface GoalRecognition { lang: string; continuous: boolean; interimResults: boolean; onresult: (event: { resultIndex: number; results: ArrayLike<RecognitionResult> }) => void; onerror: (event: { error: string }) => void; onend: () => void; start: () => void; stop: () => void; abort: () => void }
type SpeechWindow = Window & { SpeechRecognition?: new () => GoalRecognition; webkitSpeechRecognition?: new () => GoalRecognition };

const goalAliases: Record<string, string[]> = {
  home: ['buy house', 'buying house', 'buy a house', 'buying a house', 'buy home', 'buying home', 'buy a home', 'buying a home', 'down payment', 'flat'],
  education: ['children education', 'child education', 'kids education', 'education for children', 'college fees'],
  car: ['buy car', 'buying car', 'buy a car', 'car purchase'],
  marriage: ['sister marriage', 'marriage for sister', 'wedding for sister', 'sister wedding'],
  retirement: ['pension', 'retire', 'retirement planning'],
  emergency: ['emergency savings', 'rainy day fund'],
  family_security: ['life insurance', 'family protection', 'term cover'],
  wealth: ['wealth creation', 'grow wealth', 'long term wealth'],
};

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\b(a|an|the|for|my)\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function matchesGoal(goal: typeof financialGoals[number], query: string) {
  const needle = normalize(query);
  if (!needle) return false;
  const phrases = [goal.name, ...(goalAliases[goal.key] ?? [])].map(normalize);
  return phrases.some(phrase => phrase.includes(needle) || needle.includes(phrase) || needle.split(' ').every(word => phrase.split(' ').some(part => part.startsWith(word))));
}

export default function LandingGoals({onSelect, onDemo}: {onSelect?: (goalName: string) => void; onDemo?: () => void}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const recognition = useRef<GoalRecognition | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const suggestions = query.trim().length >= 2 ? financialGoals.filter(goal => matchesGoal(goal, query)).slice(0, 6) : [];
  const selectedGoal = financialGoals.find(goal => goal.key === selected);

  useEffect(() => () => recognition.current?.abort(), []);
  useEffect(() => {
    const dismiss = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, []);

  const choose = (key: string) => {
    const goal = financialGoals.find(item => item.key === key);
    if (!goal) return;
    sessionStorage.setItem('chanakya.selectedGoal', key);
    setSelected(key);
    setQuery(goal.name);
    setOpen(false);
    onSelect?.(goal.name);
    window.setTimeout(() => document.getElementById('customer-signin')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const startVoice = () => {
    if (recognition.current) { recognition.current.stop(); return; }
    const Speech = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!Speech) { setVoiceMessage('Voice input is unavailable in this browser. Type your goal instead.'); return; }
    const instance = new Speech();
    recognition.current = instance;
    instance.lang = 'en-IN'; instance.continuous = false; instance.interimResults = true;
    instance.onresult = event => {
      const phrase = Array.from(event.results).map(result => result[0].transcript).join(' ').trim();
      if (phrase) { setQuery(phrase); setSelected(null); setOpen(true); }
    };
    instance.onerror = event => setVoiceMessage(event.error === 'not-allowed' ? 'Microphone access is off. You can type your goal.' : 'Voice input stopped. You can type your goal.');
    instance.onend = () => { recognition.current = null; setListening(false); };
    try { instance.start(); setListening(true); setVoiceMessage('Listening for your goal…'); }
    catch { recognition.current = null; setListening(false); setVoiceMessage('Could not start the microphone. Type your goal instead.'); }
  };

  const continueToSignIn = () => {
    if (selectedGoal) {
      document.getElementById('customer-signin')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('customer-signin')?.focus({ preventScroll: true });
      return;
    }
    setOpen(true);
    document.getElementById('financial-goal-input')?.focus();
  };

  return <section className="landing-goals" aria-labelledby="landing-goals-title" ref={root}>
    <div className="landing-goal-composer">
      <div className="landing-goal-compose-row"><h1 id="landing-goals-title">Enter your financial goal</h1><div className="landing-goal-entry-wrap">
        <label className="landing-goal-entry" htmlFor="financial-goal-input">
          <Search size={19} aria-hidden="true" />
          <input id="financial-goal-input" aria-label="Enter your financial goal" role="combobox" aria-autocomplete="list" aria-expanded={open && suggestions.length > 0} aria-controls="financial-goal-options" value={query} onChange={event => { setQuery(event.target.value); setSelected(null); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); if (event.key === 'Enter' && suggestions[0]) { event.preventDefault(); choose(suggestions[0].key); } }} placeholder="e.g. Buying a house, children’s education" autoComplete="off" />
        </label>
        <button type="button" className={`landing-goal-mic ${listening ? 'is-listening' : ''}`} onClick={startVoice} aria-label={listening ? 'Stop voice input' : 'Speak your goal'} title={listening ? 'Stop listening' : 'Speak your goal'}>{listening ? <LoaderCircle size={23} className="landing-goal-spinner" /> : <Mic size={23} />}</button>
        {open && suggestions.length > 0 && <div id="financial-goal-options" className="landing-goal-suggestions" role="listbox" aria-label="Matching financial goals">{suggestions.map(goal => <button type="button" role="option" aria-selected={selected===goal.key} key={goal.key} onMouseDown={event => event.preventDefault()} onClick={() => choose(goal.key)}><span><strong>{goal.name}</strong><small>{goal.description}</small></span><ArrowRight size={17} aria-hidden="true" /></button>)}</div>}
      </div></div>
      <div className="landing-goal-actions"><button type="button" className="landing-goal-action secondary" onClick={() => onDemo ? onDemo() : window.location.assign('/demo')}>Interactive demo</button><button type="button" className="landing-goal-action primary" onClick={continueToSignIn}>{selectedGoal ? 'Continue to sign in' : 'Sign in'} <ArrowRight size={17} aria-hidden="true" /></button></div>
      <p className="landing-goal-feedback" role="status">{selectedGoal ? <><strong>{selectedGoal.name} selected.</strong> Sign in to add your salary and goal details.</> : voiceMessage || (query.length >= 2 && suggestions.length === 0 ? 'No exact match yet. Try “home”, “education”, “car”, or browse the goal list below.' : 'Choose a suggestion to start your plan.')}</p>
      <details className="landing-goal-browse"><summary>Browse all {financialGoals.length} goals</summary><div>{financialGoals.map(goal => <button type="button" key={goal.key} onClick={() => choose(goal.key)}>{goal.name}</button>)}</div></details>
    </div>
  </section>;
}
