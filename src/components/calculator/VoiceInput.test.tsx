import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import VoiceInput from './VoiceInput';

let speech: FakeRecognition;
class FakeRecognition {
  lang='';continuous=false;interimResults=false;
  onstart=()=>{};onspeechstart=()=>{};onspeechend=()=>{};onend=()=>{};onerror=()=>{};onresult=()=>{};
  start=vi.fn(()=>this.onstart());
  stop=vi.fn(()=>this.onend());
  abort=vi.fn();
  constructor(){speech=this;}
}
beforeEach(()=>{vi.useFakeTimers();vi.stubGlobal('SpeechRecognition',FakeRecognition);});
afterEach(()=>{cleanup();vi.useRealTimers();vi.unstubAllGlobals();});
const props=()=>({transcript:'',onTranscript:vi.fn(),onApply:vi.fn()});
describe('voice silence timer',()=>{
  it('finishes the spoken greeting before opening recognition',()=>{
    let utterance: {onend:()=>void};
    vi.stubGlobal('SpeechSynthesisUtterance',class {constructor(public text:string){} });
    const speak=vi.fn(value=>{utterance=value;});
    vi.stubGlobal('speechSynthesis',{speak,cancel:vi.fn()});
    render(<VoiceInput {...props()} autoStart greeting="Good morning, Ravi."/>);
    act(()=>vi.advanceTimersByTime(0));
    expect(speak).toHaveBeenCalledOnce();
    expect(screen.getByRole('button',{name:'Skip greeting and start'})).toBeInTheDocument();
    act(()=>utterance.onend());
    expect(speech.start).toHaveBeenCalledOnce();
    expect(screen.getByRole('button',{name:'Stop recording'})).toBeInTheDocument();
  });
  it('stops after four seconds with no speech',()=>{
    render(<VoiceInput {...props()}/>);
    fireEvent.click(screen.getByRole('button',{name:'Start recording'}));
    act(()=>vi.advanceTimersByTime(3999));expect(speech.stop).not.toHaveBeenCalled();
    act(()=>vi.advanceTimersByTime(1));expect(speech.stop).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('4 seconds without speech');
  });
  it('does not stop during continuous speech and resets when speech resumes',()=>{
    render(<VoiceInput {...props()}/>);
    fireEvent.click(screen.getByRole('button',{name:'Start recording'}));
    act(()=>speech.onspeechstart());act(()=>vi.advanceTimersByTime(10000));
    expect(speech.stop).not.toHaveBeenCalled();
    act(()=>speech.onspeechend());act(()=>vi.advanceTimersByTime(3000));
    act(()=>speech.onspeechstart());act(()=>vi.advanceTimersByTime(5000));
    expect(speech.stop).not.toHaveBeenCalled();
    act(()=>speech.onspeechend());act(()=>vi.advanceTimersByTime(4000));
    expect(speech.stop).toHaveBeenCalledOnce();
  });
  it('cancels the timer on manual stop and aborts on leaving',()=>{
    const {unmount}=render(<VoiceInput {...props()}/>);
    fireEvent.click(screen.getByRole('button',{name:'Start recording'}));
    fireEvent.click(screen.getByRole('button',{name:'Stop recording'}));
    act(()=>vi.advanceTimersByTime(5000));expect(speech.stop).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button',{name:'Start recording'}));
    unmount();expect(speech.abort).toHaveBeenCalledOnce();
  });
  it('makes one automatic attempt and handles a browser block',()=>{
    vi.stubGlobal('SpeechRecognition',class extends FakeRecognition {start=vi.fn(()=>{throw new Error('gesture required');});});
    const consumed=vi.fn();
    render(<VoiceInput {...props()} autoStart onAutoStartConsumed={consumed}/>);
    act(()=>vi.advanceTimersByTime(0));
    expect(consumed).toHaveBeenCalledOnce();expect(speech.start).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent('Choose Start recording');
  });
});
