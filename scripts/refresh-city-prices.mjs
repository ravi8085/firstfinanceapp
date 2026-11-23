import {readFile,writeFile,mkdir,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const target=fileURLToPath(new URL('../public/data/city-prices.json',import.meta.url));
const cities=[['Mumbai','Mumbai'],['Delhi NCR','Delhi'],['Bangalore','Bangalore'],['Hyderabad','Hyderabad'],['Chennai','Chennai'],['Pune','Pune'],['Kolkata','Kolkata'],['Ahmedabad','Ahmedabad'],['Jaipur','Jaipur'],['Lucknow','Lucknow'],['Chandigarh','Chandigarh'],['Indore','Indore'],['Bhopal','Bhopal'],['Coimbatore','Coimbatore']];
const key=process.env.NUMBEO_API_KEY;
if(!key){
 if(process.env.GITHUB_EVENT_NAME==='schedule'||!process.argv.includes('--optional')){console.error('NUMBEO_API_KEY is required. Activate a licensed feed first.');process.exit(1);}
 console.log('City price feed not configured; publishing the unavailable state, without example prices.');
 process.exit(0);
}
let previous={version:1,cities:[]};
try{previous=JSON.parse(await readFile(target,'utf8'));}catch{}
const output=[];let successes=0;
for(const [city,providerCity] of cities){
 try{
  const url=new URL('https://www.numbeo.com/api/city_prices');
  url.searchParams.set('api_key',key);url.searchParams.set('query',providerCity+', India');url.searchParams.set('currency','INR');
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error('Provider request failed');
  const data=await response.json();
  if(data.currency!=='INR'||!Array.isArray(data.prices)||!data.name?.toLowerCase().includes(providerCity.toLowerCase()))throw new Error('Unexpected location or currency');
  const finite=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
  // Keep original item units. Never convert unit prices into an invented monthly basket.
  const items=data.prices.filter(p=>Number.isInteger(p.item_id)&&typeof p.item_name==='string'&&finite(p.average_price)&&p.average_price>0).map(p=>({id:p.item_id,name:p.item_name,average:p.average_price,low:finite(p.lowest_price)&&p.lowest_price<=p.average_price?p.lowest_price:null,high:finite(p.highest_price)&&p.highest_price>=p.average_price?p.highest_price:null,samples:Number.isInteger(p.data_points)&&p.data_points>=0?p.data_points:null}));
  if(!items.length)throw new Error('No valid prices');
  const month=Number(data.monthLastUpdate),year=Number(data.yearLastUpdate);
  const sourceMonth=Number.isInteger(month)&&month>=1&&month<=12&&Number.isInteger(year)&&year>=2000&&year<=new Date().getUTCFullYear()?`${year}-${String(month).padStart(2,'0')}`:null;
  output.push({city,providerCity:data.name,sourceUrl:'https://www.numbeo.com/cost-of-living/in/'+encodeURIComponent(providerCity),fetchedAt:new Date().toISOString(),sourceMonth,items});successes++;
  console.log(city+': updated');
 }catch{
  // Never print provider URLs/errors: the query contains the private API key.
  console.warn(city+': unavailable; keeping prior timestamp if present');
  const old=previous.cities?.find(c=>c.city===city);if(old)output.push(old);
 }
}
if(!successes){console.error('No cities refreshed. Existing published snapshot was not replaced.');process.exit(1);}
await mkdir(fileURLToPath(new URL('../public/data/',import.meta.url)),{recursive:true});
await writeFile(target+'.tmp',JSON.stringify({version:1,cities:output},null,2)+'\n');await rename(target+'.tmp',target);
console.log(`Refreshed ${successes}/${cities.length} cities. Missing cities remain unavailable; old records keep their original dates.`);
