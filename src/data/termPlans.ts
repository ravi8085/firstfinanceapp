export interface TermPlan {
  id:string; insurer:string; name:string; url:string;
  entryAge?:[number,number]; minCover?:number; minTerm?:number; maxEndAge?:number;
  payout:string; options:string; note:string; publishedExample?:{monthly:number;basis:string;source:string};
}
export const termPlansReviewed='23 November 2026';
export const termPlans:TermPlan[]=[
  {id:'hdfc',publishedExample:{monthly:706,basis:'Advertised ₹1 crore Life option example. Check the source for age, term and discount conditions.',source:'https://www.hdfclife.com/term-insurance-plans/term-insurance-in-chandigarh'},insurer:'HDFC Life',name:'Click 2 Protect Supreme Plus',url:'https://www.hdfclife.com/term-insurance-plans/click-2-protect-supreme-plus',payout:'Compare Life and Life Plus options',options:'Pure protection and return-of-premium variants; conditions differ.',note:'Entry ages, minimum cover, and term vary by option and distribution channel; confirm the current brochure.'},
  {id:'icici',insurer:'ICICI Life',name:'iProtect Smart Plus',url:'https://www.icicilife.com/term-insurance-plans/iprotect-smart-Plus-term-plan.html',entryAge:[18,65],maxEndAge:99,payout:'Lump sum, income, increasing income, or a combination, depending on option',options:'Terminal illness benefit; optional critical illness / accidental death cover.',note:'Published entry ages for NRIs and housewives differ: 21–60. Optional benefits and quoted prices depend on variant and underwriting.'},
  {id:'axis',insurer:'Axis Max Life',name:'Smart Term Plan Plus',url:'https://www.axismaxlife.com/term-insurance-plans/smart-term-plan-plus',payout:'Confirm payout choices for the selected variant',options:'Terminal illness protection; optional critical illness cover and plan variants.',note:'Confirm current entry ages, cover limits, rider scope, and payment terms with the insurer.'},
  {id:'tata',publishedExample:{monthly:Math.round(10150/12),basis:'Published ₹10,150 annual example for age 30 male non-smoker, ₹1 crore, 30-year term, regular pay and stated first-year discounts.',source:'https://www.tataaia.com/life-insurance-plans/term-insurance/sampoorna-raksha-promise.html'},insurer:'Tata AIA',name:'Sampoorna Raksha Promise',url:'https://www.tataaia.com/life-insurance-plans/term-insurance/sampoorna-raksha-promise.html',payout:'Compare pure-protection and return-of-premium options',options:'Terminal illness benefits; premium deferment and additional rider options, subject to terms.',note:'Availability, cover duration, discounts, and underwriting depend on the chosen variant. Confirm the latest product version.'},
  {id:'lic',insurer:'LIC',name:'New Tech-Term · Plan 954',url:'https://d2conline.licindia.in/eSales/liconline/setprop?plan=954',entryAge:[18,65],minCover:5000000,payout:'Confirm death-benefit payment choices in the current brochure',options:'Online pure-protection term assurance.',note:'Entry age is last birthday. Special rates for women and non-smokers; final cover and acceptance remain subject to underwriting.'},
  {id:'bajaj',insurer:'Bajaj Life',name:'eTouch II',url:'https://www.bajajlifeinsurance.com/term-insurance-plans/etouch-term-insurance-plan.html',entryAge:[18,65],minCover:5000000,maxEndAge:99,payout:'Lump sum, income, or a combination, depending on option',options:'Life Shield, Life Shield Plus, and Life Shield ROP variants.',note:'Age 65 is an outer entry limit; payment options can lower it. Variant-specific maturity ages and policy terms must be confirmed.'},
  {id:'pnb',publishedExample:{monthly:546,basis:'Advertised starting example for healthy non-smoking male age 25, ₹1 crore, 25-year term, excluding taxes.',source:'https://www.pnbmetlife.com/insurance-plans/term-insurance-plans.html'},insurer:'PNB MetLife',name:'Mera Term Plan Plus',url:'https://www.pnbmetlife.com/insurance-plans/family-protection/pnb-metlife-mera-term-plan-plus.html',entryAge:[18,60],minCover:2500000,minTerm:10,maxEndAge:99,payout:'Compare death-benefit and spouse-cover options',options:'Life / Life Plus / Life Plus Health and optional return of premium.',note:'Pay-till-age-60 entry limit is 55. Health and return-of-premium variants have lower maturity limits; confirm the selected option.'},
];

export function planChecks(plan:TermPlan,age:number,cover:number,endAge:number,residency:string,occupation:string) {
  const messages:string[]=[];
  let ageRange=plan.entryAge;
  if(plan.id==='icici'&&(residency==='NRI'||occupation==='Homemaker'))ageRange=[21,60];
  if(ageRange)messages.push(age<ageRange[0]||age>ageRange[1]?`Outside published entry-age range (${ageRange[0]}–${ageRange[1]}). Confirm alternatives with insurer.`:`Within published entry-age range (${ageRange[0]}–${ageRange[1]}); this is not acceptance.`);
  else messages.push('Entry-age rules require confirmation for your selected variant.');
  if(plan.minCover&&cover<plan.minCover)messages.push('Requested cover is below the published minimum.');
  if(plan.minTerm&&endAge-age<plan.minTerm)messages.push(`Requested duration is below the published ${plan.minTerm}-year minimum.`);
  if(plan.maxEndAge&&endAge>plan.maxEndAge)messages.push('Requested end age exceeds the published outer limit.');
  return messages;
}

export function protectionGap(monthlyExpenses:number,supportYears:number,liabilities:number,futureNeeds:number,assets:number,existingCover:number) {
  return Math.max(0,monthlyExpenses*12*supportYears+liabilities+futureNeeds-assets-existingCover);
}
