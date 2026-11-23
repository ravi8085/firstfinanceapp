export interface PriceItem { id:number; name:string; average:number; low:number|null; high:number|null; samples:number|null }
export interface CityPrices { city:string; providerCity:string; sourceUrl:string; fetchedAt:string; sourceMonth:string|null; items:PriceItem[] }
export interface CityPriceFeed { version:1; cities:CityPrices[] }
export const cityNames = ['Mumbai','Delhi NCR','Bangalore','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Lucknow','Chandigarh','Indore','Bhopal','Coimbatore'];
export function isUsableCity(city:CityPrices, now=Date.now()) {
  const fetched=Date.parse(city.fetchedAt);
  const source=city.sourceMonth ? Date.parse(city.sourceMonth+'-01') : NaN;
  return Number.isFinite(fetched)&&fetched<=now+86400000&&now-fetched<=7*86400000&&Number.isFinite(source)&&source<=now+86400000&&now-source<=180*86400000;
}
export function validateFeed(value:unknown):CityPriceFeed {
  const feed=value as CityPriceFeed;
  if(feed?.version!==1||!Array.isArray(feed.cities))throw new Error('Invalid city price feed');
  for(const city of feed.cities){
    if(!cityNames.includes(city.city)||!city.providerCity||!/^https:\/\/www\.numbeo\.com\/cost-of-living\/in\//.test(city.sourceUrl)||!Number.isFinite(Date.parse(city.fetchedAt))||!(city.sourceMonth===null||/^\d{4}-(0[1-9]|1[0-2])$/.test(city.sourceMonth))||!Array.isArray(city.items))throw new Error('Invalid city price record');
    for(const p of city.items)if(!Number.isInteger(p.id)||typeof p.name!=='string'||!Number.isFinite(p.average)||p.average<=0||![p.low,p.high,p.samples].every(v=>v===null||(Number.isFinite(v)&&v>=0))||(p.low!==null&&p.low>p.average)||(p.high!==null&&p.high<p.average))throw new Error('Invalid city price');
  }
  return feed;
}
