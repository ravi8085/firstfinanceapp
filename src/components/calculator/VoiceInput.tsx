import { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { parseTranscript, type PlannerDetails } from '@/lib/planner';
interface SpeechResult { isFinal: boolean; 0: { transcript: string } }
interface Recognition { lang: string; continuous: boolean; interimResults: boolean; onresult: (event: { resultIndex: number; results: ArrayLike<SpeechResult> }) => void; onerror: (event: { error: string }) => void; onend: () => void; onstart: () => void; onspeechstart: () => void; onspeechend: () => void; start: () => void; stop: () => void; abort: () => void }
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
export default function VoiceInput({ transcript, onTranscript, onApply, autoStart=false, onAutoStartConsumed, greeting='' }: { autoStart?:boolean; onAutoStartConsumed?:()=>void; greeting?:string; transcript: string; onTranscript: (value: string | ((old: string) => string)) => void; onApply: (values: Partial<PlannerDetails>) => void }) {
  const [language, setLanguage] = useState('en-IN');
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState('');
  const recognition = useRef<Recognition | null>(null);
  const silenceTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const greetingTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const greetingUtterance=useRef<SpeechSynthesisUtterance|null>(null);
  const speechActive=useRef(false);
  const [welcoming,setWelcoming]=useState(false);
  const clearSilence=()=>{if(silenceTimer.current)clearTimeout(silenceTimer.current);silenceTimer.current=null;};
  const stopForSilence=()=>{clearSilence();recognition.current?.stop();setStatus('Recording stopped after 4 seconds without speech. Review your transcript or start again.');};
  const armSilence=()=>{clearSilence();silenceTimer.current=setTimeout(stopForSilence,4000);};
  const cancelWelcome=()=>{
    if(greetingTimer.current)clearTimeout(greetingTimer.current);
    if(greetingUtterance.current){greetingUtterance.current.onend=null;greetingUtterance.current.onerror=null;window.speechSynthesis?.cancel();greetingUtterance.current=null;}
    setWelcoming(false);
  };
  useEffect(() => {
    const hidden=()=>{if(document.hidden){cancelWelcome();clearSilence();recognition.current?.stop();}};
    document.addEventListener('visibilitychange',hidden);
    return ()=>{document.removeEventListener('visibilitychange',hidden);cancelWelcome();clearSilence();if(recognition.current){recognition.current.onresult=()=>{};recognition.current.onerror=()=>{};recognition.current.onend=()=>{};recognition.current.onstart=()=>{};recognition.current.onspeechstart=()=>{};recognition.current.onspeechend=()=>{};recognition.current.abort();}};
  }, []);
  const record = () => {
    cancelWelcome();
    if (recognition.current) { clearSilence(); recognition.current.stop(); setStatus('Recording stopped. Review your transcript or start again.'); return; }
    const Speech = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!Speech) { setStatus('Voice recording is unavailable in this browser. Type your words below or use the form.'); return; }
    const instance = new Speech(); recognition.current = instance;
    instance.lang = language; instance.continuous = true; instance.interimResults = true;
    instance.onstart=()=>{speechActive.current=false;armSilence();};
    instance.onspeechstart=()=>{speechActive.current=true;clearSilence();};
    instance.onspeechend=()=>{speechActive.current=false;armSilence();};
    instance.onresult = event => { if(!speechActive.current)armSilence(); for (let i = event.resultIndex; i < event.results.length; i++) if (event.results[i].isFinal) onTranscript(old => old + (old ? ' ' : '') + event.results[i][0].transcript); };
    instance.onend = () => { clearSilence(); speechActive.current=false; recognition.current = null; setListening(false); };
    instance.onerror = event => { clearSilence(); setStatus(event.error === 'not-allowed' ? 'Microphone access was declined. You can type your details or use the form.' : `Recording stopped (${event.error}). You can edit the transcript and continue.`); };
    try { instance.start(); setListening(true); setStatus('Listening. Recording stops automatically after 4 seconds of silence.'); } catch { recognition.current = null; setListening(false); setStatus('Automatic recording was blocked or could not start. Choose Start recording, allow the microphone, or use the form.'); }
  };
  useEffect(()=>{
    if(!autoStart)return;
    onAutoStartConsumed?.();
    const timer=setTimeout(()=>{
      if(document.hidden){setStatus('Choose Start recording when you are ready.');return;}
      if(greeting && window.speechSynthesis && typeof SpeechSynthesisUtterance!=='undefined'){
        setWelcoming(true);setStatus('Welcome. Listening will begin after the greeting.');
        const utterance=new SpeechSynthesisUtterance(greeting+' Welcome to Chanakya. Tell me about your salary and monthly expenses.');
        utterance.lang='en-IN';greetingUtterance.current=utterance;
        const begin=()=>{if(greetingTimer.current)clearTimeout(greetingTimer.current);greetingUtterance.current=null;setWelcoming(false);record();};
        utterance.onend=begin;
        utterance.onerror=()=>{greetingUtterance.current=null;setWelcoming(false);record();};
        // Some browsers suppress automatic playback without raising an event.
        greetingTimer.current=setTimeout(()=>{cancelWelcome();setStatus('Choose Start recording to begin. Your browser requires a tap before voice can start.');},12000);
        window.speechSynthesis.speak(utterance);
      }else record();
    },0);
    return ()=>clearTimeout(timer);
  }, []);
  const apply = () => {
    clearSilence(); recognition.current?.stop(); const values = parseTranscript(transcript); onApply(values);
    setStatus(Object.keys(values).length ? `Captured ${Object.keys(values).length} details. Check every highlighted amount below before continuing.` : 'No details could be captured confidently. Try “salary 80000, rent 18000” or fill in the form.');
  };
  return <section className="voice-panel"><div className="voice-title"><h3>Your story, in your words.</h3><select aria-label="Voice language" value={language} disabled={listening} onChange={e=>setLanguage(e.target.value)}><option value="en-IN">English (India)</option><option value="hi-IN">Hindi</option><option value="te-IN">Telugu</option></select></div>{greeting&&<p className="voice-greeting">{greeting} Tell us about your salary and expenses.</p>}<p>Try: “My salary is eighty thousand. Rent is eighteen thousand, food is eight thousand, and EMI is ten thousand.”</p><button type="button" className={`cf-button ${listening ? 'recording' : 'cf-primary'}`} onClick={record}>{listening ? <Square size={17} /> : <Mic size={17} />}{welcoming?'Skip greeting and start':listening ? 'Stop recording' : 'Start recording'}</button>{welcoming&&<button type="button" className="cf-button cf-secondary" onClick={()=>{cancelWelcome();setStatus('Voice welcome cancelled. You can start recording or use the form.');}}>Cancel voice welcome</button>}<p className="cf-help">After sign-in, voice starts automatically where your browser permits it. You may need to allow microphone access. Recording stops after 4 seconds without speech; you can stop it at any time. Audio is processed by your browser’s speech service. English amount words and labelled numeric amounts are supported; review regional-language transcripts manually.</p><label htmlFor="voice-transcript">Your transcript — edit anything that needs correcting</label><textarea className="cf-input" id="voice-transcript" value={transcript} onChange={e=>onTranscript(e.target.value)} rows={4} placeholder="Your words appear here. You can also type them." /><button className="cf-button cf-secondary" type="button" disabled={listening || !transcript.trim()} onClick={apply}>Fill my details from this</button><p className="cf-help" role="status">{status}</p></section>;
}
