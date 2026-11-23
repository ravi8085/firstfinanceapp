import {describe,it,expect} from 'vitest';
import {validateFeed,isUsableCity,type CityPrices} from './cityPrices';
const now=Date.parse('2026-11-23T12:00:00Z');
const city:CityPrices={city:'Hyderabad',providerCity:'Hyderabad, India',sourceUrl:'https://www.numbeo.com/cost-of-living/in/Hyderabad',fetchedAt:'2026-11-23T01:00:00Z',sourceMonth:'2026-11',items:[{id:27,name:'Rent',average:15000,low:10000,high:25000,samples:20}]};
describe('sourced city prices',()=>{
 it('allows an empty feed without inventing defaults',()=>expect(validateFeed({version:1,cities:[]}).cities).toEqual([]));
 it('accepts valid INR-normalized observations',()=>expect(validateFeed({version:1,cities:[city]}).cities[0]).toEqual(city));
 it('rejects malformed prices, sources and ranges',()=>{
   expect(()=>validateFeed({version:1,cities:[{...city,sourceUrl:'https://other.example'}]})).toThrow();
   expect(()=>validateFeed({version:1,cities:[{...city,items:[{...city.items[0],average:-1}]}]})).toThrow();
   expect(()=>validateFeed({version:1,cities:[{...city,items:[{...city.items[0],low:20000}]}]})).toThrow();
 });
 it('requires both recent retrieval and a recent dated source for autofill',()=>{
   expect(isUsableCity(city,now)).toBe(true);
   expect(isUsableCity({...city,fetchedAt:'2026-11-01'},now)).toBe(false);
   expect(isUsableCity({...city,sourceMonth:'2025-11'},now)).toBe(false);
   expect(isUsableCity({...city,sourceMonth:null},now)).toBe(false);
   expect(isUsableCity({...city,fetchedAt:'2026-12-01'},now)).toBe(false);
 });
});
