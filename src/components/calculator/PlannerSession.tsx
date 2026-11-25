import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialDetails, type PlannerDetails } from '@/lib/planner';
import type { TermProfile } from './TermPlanComparison';
import { financialGoals } from '@/data/financialGoals';

function useSessionState(){
  const [details,setDetails]=useState<PlannerDetails>(() => {
    const selected = sessionStorage.getItem('chanakya.selectedGoal');
    sessionStorage.removeItem('chanakya.selectedGoal');
    const goal = financialGoals.find(item => item.key === selected);
    return {...initialDetails, ...(goal ? { goal: goal.name } : {})};
  });
  const [mode,setMode]=useState<'form'|'voice'>('form');
  const [step,setStep]=useState(0);
  const [transcript,setTranscript]=useState('');
  const [customGoal,setCustomGoal]=useState('');
  const [captured,setCaptured]=useState<string[]>([]);
  const [notice,setNotice]=useState('');
  const [insurance,setInsurance]=useState<{profile:TermProfile;premiumBudget:number}|null>(null);
  return {details,setDetails,mode,setMode,step,setStep,transcript,setTranscript,customGoal,setCustomGoal,captured,setCaptured,notice,setNotice,insurance,setInsurance};
}
export const PlannerSessionContext=createContext<ReturnType<typeof useSessionState>|null>(null);
export const usePlannerSession=()=>{const value=useContext(PlannerSessionContext);if(!value)throw new Error('Planner session is required');return value;};
export function PlannerSessionProvider({children}:{children:ReactNode}){const state=useSessionState();return <PlannerSessionContext.Provider value={state}>{children}</PlannerSessionContext.Provider>;}
