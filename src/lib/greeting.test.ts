import { describe, expect, it } from 'vitest';
import { customerFirstName, customerGreeting } from './greeting';
describe('customer greetings',()=>{
  it('uses the customer name and local time of day',()=>{
    expect(customerGreeting('Ravi',9)).toBe('Good morning, Ravi.');
    expect(customerGreeting('Ravi',14)).toBe('Good afternoon, Ravi.');
    expect(customerGreeting('Ravi',20)).toBe('Good evening, Ravi.');
  });
  it('does not invent a name for mobile-only accounts',()=>{
    expect(customerFirstName({full_name:' Ravi Kumar '})).toBe('Ravi');
    expect(customerFirstName({})).toBe('');
    expect(customerGreeting('',14)).toBe('Good afternoon.');
  });
});
