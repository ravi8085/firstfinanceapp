export interface RetirementInputs {
  currentAge:number; retirementAge:number; yearsInRetirement:number;
  monthlyExpenses:number; inflation:number; annualReturn:number; retirementReturn:number;
  existingCorpus:number; monthlyContribution:number;
}

export function calculateRetirement(input:RetirementInputs) {
  const years=Math.max(0,input.retirementAge-input.currentAge);
  const months=Math.round(years*12);
  const futureMonthlyExpense=input.monthlyExpenses*Math.pow(1+input.inflation/100,years);
  // Annual beginning-of-year withdrawals; expenses continue growing during retirement.
  const ratio=(1+input.inflation/100)/(1+input.retirementReturn/100);
  let expenseFactor=0;
  for(let year=0;year<input.yearsInRetirement;year++)expenseFactor+=Math.pow(ratio,year);
  const requiredCorpus=futureMonthlyExpense*12*expenseFactor;
  const monthlyRate=Math.pow(1+input.annualReturn/100,1/12)-1;
  const growth=Math.pow(1+monthlyRate,months);
  const contributionFactor=months===0?0:input.annualReturn===0?months:(growth-1)/monthlyRate;
  const futureExisting=input.existingCorpus*growth;
  const corpusToFund=Math.max(0,requiredCorpus-futureExisting);
  const requiredMonthly=months>0?corpusToFund/contributionFactor:null;
  const projectedCorpus=futureExisting+input.monthlyContribution*contributionFactor;
  const gap=Math.max(0,requiredCorpus-projectedCorpus);
  const additionalMonthly=requiredMonthly===null?null:Math.max(0,requiredMonthly-input.monthlyContribution);
  return {years,months,futureMonthlyExpense,requiredCorpus,futureExisting,requiredMonthly,projectedCorpus,gap,additionalMonthly};
}
