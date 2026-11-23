export const expenseKeys = ['rent', 'emis', 'food', 'transport', 'schoolFees', 'utilities', 'miscellaneous'] as const;
export interface PlannerDetails {
  salary: number; age: number; experience: string; maritalStatus: 'single' | 'married'; numberOfChildren: number;
  city: string; savings: number; bufferMonths: number; goal: string;
  rent: number; emis: number; food: number; transport: number; schoolFees: number; utilities: number; miscellaneous: number;
}
export const initialDetails: PlannerDetails = { salary: 0, age: 28, experience: '0-5', maritalStatus: 'single', numberOfChildren: 0, city: 'Hyderabad', savings: 0, bufferMonths: 6, goal: 'Build financial security', rent: 0, emis: 0, food: 0, transport: 0, schoolFees: 0, utilities: 0, miscellaneous: 0 };
export function cashFlow(details: PlannerDetails) {
  const expenses = expenseKeys.reduce((sum, key) => sum + details[key], 0);
  const surplus = details.salary - expenses;
  const emergencyTarget = expenses * details.bufferMonths;
  return { expenses, surplus, emergencyTarget, emergencyGap: Math.max(0, emergencyTarget - details.savings) };
}
export function affordableAllocation(salary: number, expenses: number, target: number) {
  return Math.max(0, Math.min(target, salary - expenses));
}
const words: Record<string, number> = { zero:0, one:1, two:2, three:3, four:4, five:5, six:6, seven:7, eight:8, nine:9, ten:10, eleven:11, twelve:12, thirteen:13, fourteen:14, fifteen:15, sixteen:16, seventeen:17, eighteen:18, nineteen:19, twenty:20, thirty:30, forty:40, fifty:50, sixty:60, seventy:70, eighty:80, ninety:90 };
function amount(text: string): number | null {
  const clean = text.trim().replace(/,/g, '').toLowerCase();
  if (/^\d+(?:\.\d+)?\s*(?:k|thousand|lakh|lac|crore|हजार|लाख)?$/.test(clean)) {
    return Number(clean.match(/^\d+(?:\.\d+)?/)![0]) * (/crore/.test(clean) ? 1e7 : /lakh|lac|लाख/.test(clean) ? 1e5 : /k|thousand|हजार/.test(clean) ? 1000 : 1);
  }
  let total = 0, current = 0, found = false;
  for (const word of clean.replace(/-/g, ' ').split(/\s+/)) {
    if (word === 'and') continue;
    if (word in words) { current += words[word]; found = true; }
    else if (word === 'hundred') { current = (current || 1) * 100; found = true; }
    else if (['thousand', 'lakh', 'lac', 'crore'].includes(word)) { total += (current || 1) * (word === 'thousand' ? 1000 : word === 'crore' ? 1e7 : 1e5); current = 0; found = true; }
    else return null;
  }
  return found ? total + current : null;
}
const aliases: Record<string, string> = { 'take home salary':'salary', 'take-home salary':'salary', 'salary':'salary', 'income':'salary', 'सैलरी':'salary', 'वेतन':'salary', 'rent':'rent', 'किराया':'rent', 'emi':'emis', 'emis':'emis', 'loan payments':'emis', 'ईएमआई':'emis', 'food':'food', 'groceries':'food', 'खाना':'food', 'transport':'transport', 'travel':'transport', 'school fees':'schoolFees', 'education':'schoolFees', 'utilities':'utilities', 'bills':'utilities', 'miscellaneous':'miscellaneous', 'other expenses':'miscellaneous', 'savings':'savings', 'बचत':'savings', 'age':'age', 'aged':'age', 'children':'numberOfChildren' };
export function parseTranscript(raw: string): Partial<PlannerDetails> {
  const text = raw.toLowerCase().replace(/[०-९]/g, c => String(c.charCodeAt(0) - 0x966));
  const terms = Object.keys(aliases).sort((a,b)=>b.length-a.length).join('|');
  const labels = new RegExp(`(?<![a-z])(${terms})(?![a-z])`, 'g');
  const matches = [...text.matchAll(labels)];
  const result: Partial<PlannerDetails> = {};
  matches.forEach((match, index) => {
    const rest = text.slice(match.index! + match[0].length, matches[index+1]?.index).replace(/^(?:\s|:|=|₹|is\b|are\b|of\b|about\b|around\b|rupees\b|rs\.?|है|मेरा|मेरी)+/g, '');
    const numberTokens = rest.match(/^(?:\d[\d,]*(?:\.\d+)?\s*(?:thousand|lakh|lac|crore|k\b|हजार|लाख)?|(?:(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|lakh|lac|crore|and)(?:\b|$)[\s-]*)+)/)?.[0];
    if (!numberTokens) return;
    const value = amount(numberTokens.trim());
    const key = aliases[match[0]];
    if (value === null || !Number.isFinite(value) || value < 0 || value > 1e9) return;
    if (key === 'age' && (!Number.isInteger(value) || value < 18 || value > 100)) return;
    if (key === 'numberOfChildren' && (!Number.isInteger(value) || value > 20)) return;
    Object.assign(result, { [key]: value });
  });
  return result;
}
