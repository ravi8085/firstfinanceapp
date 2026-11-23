import {afterEach,describe,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import CityBenchmarks from './CityBenchmarks';
afterEach(()=>{cleanup();vi.unstubAllGlobals();});
function mockFeed(daysOld=0){const now=new Date();vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({version:1,cities:[{city:'Hyderabad',providerCity:'Hyderabad, India',sourceUrl:'https://www.numbeo.com/cost-of-living/in/Hyderabad',fetchedAt:new Date(now.getTime()-daysOld*86400000).toISOString(),sourceMonth:now.toISOString().slice(0,7),items:[{id:27,name:'One bedroom outside centre',average:15000,low:10000,high:20000,samples:30},{id:20,name:'Public transport pass',average:1200,low:1000,high:1500,samples:12}]}]})}));}
describe('city benchmark selection',()=>{
 it('applies only explicitly selected figures and supports the reported low',async()=>{
  mockFeed();const apply=vi.fn();render(<CityBenchmarks city="Hyderabad" onApply={apply}/>);
  const rent=await screen.findByLabelText('Use Monthly rent');
  expect(screen.getByRole('button',{name:'Apply selected prices'})).toBeDisabled();
  fireEvent.click(rent);fireEvent.click(screen.getByRole('button',{name:'Apply selected prices'}));
  expect(apply).toHaveBeenLastCalledWith({rent:15000});
  fireEvent.change(screen.getByLabelText('Compare'),{target:{value:'low'}});
  expect(screen.getByRole('button',{name:'Apply selected prices'})).toBeDisabled();
  fireEvent.click(rent);fireEvent.click(screen.getByRole('button',{name:'Apply selected prices'}));
  expect(apply).toHaveBeenLastCalledWith({rent:10000});
 });
 it('shows older data without allowing it to replace customer amounts',async()=>{
  mockFeed(10);render(<CityBenchmarks city="Hyderabad" onApply={vi.fn()}/>);
  expect(await screen.findByLabelText('Use Monthly rent')).toBeDisabled();
  expect(screen.getByRole('button',{name:'Apply selected prices'})).toBeDisabled();
 });
 it('keeps missing data unavailable instead of falling back to examples',async()=>{
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({version:1,cities:[]})}));
  render(<CityBenchmarks city="Hyderabad" onApply={vi.fn()}/>);
  expect(await screen.findByText(/Live city prices are not connected yet/)).toBeVisible();
  expect(screen.queryByRole('button',{name:'Apply selected prices'})).not.toBeInTheDocument();
 });
});
