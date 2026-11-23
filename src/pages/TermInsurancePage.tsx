import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlannerSession } from '@/components/calculator/PlannerSession';
import TermPlanComparison, { type TermProfile } from '@/components/calculator/TermPlanComparison';

type Answers = { age: number; salary: number; monthlyExpenses: number; dependants: number; premiumBudget: number; occupation: string; annualIncome: number; education: string; tobacco: string };
const steps = ['Occupation', 'Income', 'Education', 'Tobacco', 'Household'];
const incomeChoices = [
  ['Under ₹2 lakh', 150000], ['₹2–5 lakh', 350000], ['₹5–8 lakh', 650000],
  ['₹8–10 lakh', 900000], ['₹10–15 lakh', 1250000], ['₹15–25 lakh', 2000000], ['₹25 lakh+', 3000000],
] as const;

export default function TermInsurancePage() {
  const { insurance, setInsurance } = usePlannerSession();
  const [answers, setAnswers] = useState<Answers>({
    age: insurance?.profile.age || 0,
    salary: insurance?.profile.salary || 0,
    monthlyExpenses: insurance?.profile.monthlyExpenses || 0,
    dependants: insurance?.profile.dependants || 0,
    premiumBudget: insurance?.premiumBudget || 0,
    occupation: insurance?.profile.occupation || '',
    annualIncome: insurance?.profile.annualIncome || 0,
    education: insurance?.profile.education || '',
    tobacco: insurance?.profile.tobacco || '',
  });
  const [editing, setEditing] = useState(!insurance);
  const [step, setStep] = useState(0);
  const [version, setVersion] = useState(0);
  const change = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers(old => ({ ...old, [key]: value }));
  const next = () => setStep(current => Math.min(steps.length - 1, current + 1));
  const complete = () => {
    const profile: TermProfile = {
      age: answers.age, salary: answers.salary, monthlyExpenses: answers.monthlyExpenses,
      dependants: answers.dependants, occupation: answers.occupation,
      annualIncome: answers.annualIncome, education: answers.education, tobacco: answers.tobacco,
    };
    setInsurance({ profile, premiumBudget: answers.premiumBudget });
    setVersion(current => current + 1);
    setEditing(false);
  };

  return <main className="term-insurance-page">
    <div className="term-page-navigation"><Link to="/calculator" className="cf-text-button">Back to my money plan</Link>{insurance && <button className="cf-text-button" onClick={() => { setEditing(!editing); setStep(0); }}>{editing ? 'Back to results' : 'Edit answers'}</button>}</div>
    <div className="planner-heading"><div className="cf-eyebrow">YOUR FAMILY’S FINANCIAL SAFETY NET</div><h1>Term insurance comparison</h1><p>Answer a few questions, then compare plans using the same profile.</p></div>
    {editing && <section className="planner-card term-questionnaire" aria-label="Term insurance questions">
      <div className="term-progress"><span>{step + 1} of {steps.length}</span><div>{steps.map((name, index) => <span key={name} className={index <= step ? 'active' : ''} />)}</div></div>
      {step === 0 && <><h2>What is your occupation?</h2><div className="term-choice-grid">{['Salaried', 'Self-employed', 'Homemaker', 'Student', 'Other'].map(value => <button key={value} type="button" aria-pressed={answers.occupation === value} onClick={() => { change('occupation', value); next(); }}>{value}</button>)}</div></>}
      {step === 1 && <><h2>What is your annual gross income?</h2><p>Select a range to continue. You can enter the exact figure below.</p><div className="term-choice-grid">{incomeChoices.map(([label, amount]) => <button key={label} type="button" aria-pressed={answers.annualIncome === amount} onClick={() => { change('annualIncome', amount); next(); }}>{label}</button>)}</div><label className="term-exact-income">Exact annual gross income (₹)<input type="number" min="0" value={answers.annualIncome || ''} onChange={event => change('annualIncome', Number(event.target.value))}/></label></>}
      {step === 2 && <><h2>What is your education level?</h2><div className="term-choice-grid">{['Post-graduation', 'Graduation', '12th', '10th or below'].map(value => <button key={value} type="button" aria-pressed={answers.education === value} onClick={() => { change('education', value); next(); }}>{value}</button>)}</div></>}
      {step === 3 && <><h2>Have you used tobacco or nicotine in the last 12 months?</h2><div className="term-choice-grid">{['Yes', 'No'].map(value => <button key={value} type="button" aria-pressed={answers.tobacco === value} onClick={() => { change('tobacco', value); next(); }}>{value}</button>)}</div></>}
      {step === 4 && <><h2>Your household and budget</h2><div className="planner-fields"><label>Age<input type="number" required min="18" max="100" value={answers.age || ''} onChange={event => change('age', Number(event.target.value))}/></label><label>Monthly take-home salary (₹)<input type="number" required min="1" value={answers.salary || ''} onChange={event => change('salary', Number(event.target.value))}/></label><label>Monthly family spending (₹)<input type="number" min="0" value={answers.monthlyExpenses || ''} onChange={event => change('monthlyExpenses', Number(event.target.value))}/></label><label>Financial dependants<input type="number" min="0" max="30" value={answers.dependants || ''} onChange={event => change('dependants', Number(event.target.value))}/></label><label>Monthly premium budget (₹)<input type="number" min="0" value={answers.premiumBudget || ''} onChange={event => change('premiumBudget', Number(event.target.value))}/></label></div><button type="button" className="cf-button cf-primary" disabled={answers.age < 18 || answers.salary <= 0} onClick={complete}>Compare plans</button></>}
      <div className="term-step-actions"><button type="button" disabled={step === 0} onClick={() => setStep(current => current - 1)}>Previous</button>{step < steps.length - 1 && <button type="button" disabled={step === 0 && !answers.occupation || step === 1 && !answers.annualIncome || step === 2 && !answers.education || step === 3 && !answers.tobacco} onClick={next}>Next</button>}</div>
    </section>}
    {insurance && !editing && <TermPlanComparison key={version} profile={insurance.profile} premiumBudget={insurance.premiumBudget} />}
  </main>;
}
