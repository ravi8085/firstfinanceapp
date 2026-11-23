import { describe, expect, it } from 'vitest';
import { affordableAllocation, cashFlow, initialDetails, parseTranscript } from './planner';

describe('voice detail capture', () => {
  it('extracts Indian formatted digits without mixing fields', () => {
    expect(parseTranscript('My salary is 80,000. Rent 18,000, food 8,000 and EMI 10,000.')).toEqual({salary:80000,rent:18000,food:8000,emis:10000});
  });
  it('understands English spoken amounts and lakh units', () => {
    expect(parseTranscript('Salary is one lakh twenty thousand, rent eighteen thousand, food eight thousand, EMI ten thousand')).toEqual({salary:120000,rent:18000,food:8000,emis:10000});
    expect(parseTranscript('salary 1.5 lakh and savings 2 lac')).toEqual({salary:150000,savings:200000});
  });
  it('accepts Devanagari digits with supported labels', () => {
    expect(parseTranscript('सैलरी ८०००० किराया १८०००')).toEqual({salary:80000,rent:18000});
  });
  it('does not invent missing amounts or accept invalid ages', () => {
    expect(parseTranscript('salary unknown, rent negative, age 80000')).toEqual({});
    expect(parseTranscript('salary -80000')).toEqual({});
  });
  it('keeps a later explicit correction', () => {
    expect(parseTranscript('salary 80000, salary 90000')).toEqual({salary:90000});
  });
});
describe('cash flow and affordable allocation', () => {
  it('includes every expense and subtracts existing emergency savings', () => {
    const d={...initialDetails,salary:80000,rent:18000,food:8000,emis:10000,transport:3000,utilities:2000,schoolFees:4000,miscellaneous:5000,savings:100000};
    expect(cashFlow(d)).toEqual({expenses:50000,surplus:30000,emergencyTarget:300000,emergencyGap:200000});
  });
  it('caps investment illustrations at actual surplus', () => {
    expect(affordableAllocation(80000,79000,20000)).toBe(1000);
    expect(affordableAllocation(80000,90000,20000)).toBe(0);
    expect(affordableAllocation(80000,20000,20000)).toBe(20000);
  });
  it('never produces a negative emergency gap', () => {
    expect(cashFlow({...initialDetails,rent:1000,savings:10000}).emergencyGap).toBe(0);
  });
});
