export interface FinancialGoal {
  key: string;
  name: string;
  group: string;
  description: string;
  defaultYearsAway: number;
  kind?: 'protection' | 'custom';
}

const group = (name: string, entries: [string, string, string, number][]): FinancialGoal[] => entries.map(([key, title, description, years]) => ({key, name:title, description, defaultYearsAway:years, group:name}));
export const financialGoals: FinancialGoal[] = [
  ...group('Security & protection', [
    ['security','Build financial security','Build a financial cushion for greater stability.',3],
    ['emergency','Emergency fund','Set aside money for unexpected expenses or income loss.',1],
    ['health','Medical & healthcare fund','Plan for treatment, deductibles, or other out-of-pocket healthcare costs.',2],
    ['insurance','Insurance premium fund','Budget for planned health, life, or other insurance premiums.',1],
    ['career_break','Career break / income buffer','Cover living costs during a planned break from work.',2],
    ['disability','Disability & accessibility support','Plan for equipment, support, or accessibility changes.',3],
  ]),
  {key:'family_security',name:'Family protection / life cover',group:'Security & protection',description:'Estimate a protection amount to discuss with an insurance professional. This is cover, not an investment corpus.',defaultYearsAway:0,kind:'protection'},
  ...group('Debt freedom', [
    ['credit_card','Clear credit card debt','Plan an amount to repay credit card balances.',1],
    ['personal_loan','Repay personal loans','Set a target for clearing personal borrowing.',3],
    ['education_loan','Repay education loan','Plan for repayment of education borrowing.',5],
    ['home_loan','Home loan prepayment','Build a lump sum toward reducing your mortgage.',5],
    ['vehicle_loan','Repay vehicle loan','Plan an amount to clear vehicle finance.',3],
    ['debt_free','Become debt-free','Build a repayment target across your debts.',5],
  ]),
  ...group('Home & property', [
    ['home','Buy a home','Plan for a home purchase or its down payment.',5],
    ['land','Buy land / a plot','Set aside a target amount for a land purchase.',7],
    ['construction','Build a house','Plan for construction and associated costs.',5],
    ['renovation','Home renovation / repairs','Prepare for upgrades, maintenance, or repairs.',3],
    ['furnishing','Furniture & appliances','Budget for furnishing your home or replacing appliances.',2],
    ['rental_deposit','Rental deposit & moving costs','Plan a rental deposit and the cost of moving home.',1],
  ]),
  ...group('Education & career', [
    ['education','Children’s education','Plan for school, college, or higher education.',15],
    ['own_education','My higher education','Save for a degree, postgraduate course, or further study.',3],
    ['study_abroad','Study abroad','Plan tuition, living costs, travel, and related expenses.',5],
    ['skills','Skills & certifications','Fund professional training or certifications.',1],
    ['career_change','Career change / reskilling','Prepare for retraining and a transition between careers.',2],
  ]),
  ...group('Family & care', [
    ['marriage','Wedding / marriage','Create a budget for your own or a family wedding.',5],
    ['new_child','New child / parenthood','Plan for childbirth, adoption, childcare, and parental leave.',3],
    ['child_future','Children’s future fund','Build a flexible fund for a child’s future needs.',15],
    ['parents','Parents’ support & elder care','Plan financial help or care for parents and elders.',5],
    ['dependants','Support dependants','Set aside funds for family members who rely on you.',5],
    ['family_event','Family celebrations','Budget for a milestone celebration or family gathering.',2],
  ]),
  ...group('Retirement & independence', [
    ['retirement','Retirement','Build a target corpus for life after work.',25],
    ['early_retirement','Early retirement / financial independence','Plan a corpus for leaving full-time work earlier.',15],
    ['retirement_home','Retirement home & care','Prepare for later-life housing or support needs.',20],
    ['legacy','Legacy / inheritance fund','Set aside an amount for future beneficiaries.',20],
  ]),
  ...group('Business & wealth', [
    ['business','Start a business','Fund the setup costs of a new business.',3],
    ['business_growth','Expand a business','Build a target for business expansion or equipment.',5],
    ['freelance','Freelance / side-business setup','Prepare for the costs of independent work.',2],
    ['wealth','Long-term wealth creation','Build a flexible long-term corpus.',15],
    ['income','Future income corpus','Build a corpus intended to support future income needs.',15],
  ]),
  ...group('Lifestyle & experiences', [
    ['car','Buy a car','Budget for a car purchase or down payment.',3],
    ['two_wheeler','Buy a two-wheeler','Save toward a motorcycle or scooter.',2],
    ['travel','Travel / dream holiday','Build a budget for a trip or extended holiday.',2],
    ['pilgrimage','Pilgrimage / spiritual travel','Plan the cost of a pilgrimage or retreat.',3],
    ['relocation','Relocation / moving abroad','Prepare for moving, initial housing, and settling-in costs.',3],
    ['purchase','Major purchase / technology','Save for a planned large purchase.',1],
    ['hobbies','Hobbies / personal milestone','Fund a hobby, creative project, or personal ambition.',2],
    ['pets','Pet care fund','Budget for planned pet care and unexpected veterinary costs.',2],
  ]),
  ...group('Giving & planned obligations', [
    ['charity','Charity / philanthropy','Plan a charitable gift or ongoing giving fund.',3],
    ['community','Community / religious contribution','Save for a community project or contribution.',3],
    ['tax','Tax payment reserve','Set aside an amount for expected tax payments.',1],
    ['annual_bills','Annual bills & planned expenses','Budget for recurring annual obligations.',1],
    ['legal','Legal / administrative expenses','Prepare for anticipated legal or administrative costs.',1],
  ]),
  {key:'custom',name:'Other / custom goal',group:'Your own goal',description:'Name your goal and set your own amount, timeline, and assumptions.',defaultYearsAway:3,kind:'custom'},
];
export const goalGroups = [...new Set(financialGoals.map(goal=>goal.group))];
export const customGoalLabel = financialGoals.find(goal=>goal.key==='custom')!.name;

export function goalProjection(cost: number, years: number, inflation: number, annualReturn: number, savings=0) {
  const futureCost = cost * Math.pow(1 + inflation/100, years);
  const grownSavings = savings * Math.pow(1 + annualReturn/100, years);
  const gap = Math.max(0, futureCost-grownSavings);
  const months = Math.round(years*12);
  const rate = Math.pow(1+annualReturn/100,1/12)-1;
  const monthly = months===0 ? 0 : annualReturn===0 ? gap/months : gap*rate/(Math.pow(1+rate,months)-1);
  return {futureCost, gap, monthly, months};
}
