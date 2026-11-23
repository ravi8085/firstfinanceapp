import { useQuery } from "@tanstack/react-query";

// FD Interest Rates (updated periodically - latest 2025 rates)
export interface FDRate {
  bank: string;
  generalRate: string;
  seniorRate: string;
  tenure: string;
  type: "public" | "private" | "small-finance";
}

export const fdRates: FDRate[] = [
  // Public Sector Banks
  { bank: "State Bank of India (SBI)", generalRate: "6.50%", seniorRate: "7.00%", tenure: "1–2 Years", type: "public" },
  { bank: "Bank of Baroda", generalRate: "6.85%", seniorRate: "7.35%", tenure: "1–2 Years", type: "public" },
  { bank: "Punjab National Bank", generalRate: "6.80%", seniorRate: "7.30%", tenure: "1–2 Years", type: "public" },
  { bank: "Canara Bank", generalRate: "6.85%", seniorRate: "7.35%", tenure: "1–2 Years", type: "public" },
  { bank: "Union Bank of India", generalRate: "6.70%", seniorRate: "7.20%", tenure: "1–2 Years", type: "public" },
  { bank: "Indian Bank", generalRate: "6.75%", seniorRate: "7.25%", tenure: "1–2 Years", type: "public" },
  { bank: "Bank of India", generalRate: "6.80%", seniorRate: "7.30%", tenure: "1–2 Years", type: "public" },
  // Private Banks
  { bank: "HDFC Bank", generalRate: "7.00%", seniorRate: "7.50%", tenure: "1–2 Years", type: "private" },
  { bank: "ICICI Bank", generalRate: "7.00%", seniorRate: "7.50%", tenure: "1–2 Years", type: "private" },
  { bank: "Axis Bank", generalRate: "7.10%", seniorRate: "7.60%", tenure: "1–2 Years", type: "private" },
  { bank: "Kotak Mahindra Bank", generalRate: "7.10%", seniorRate: "7.60%", tenure: "1–2 Years", type: "private" },
  { bank: "IndusInd Bank", generalRate: "7.25%", seniorRate: "7.75%", tenure: "1–2 Years", type: "private" },
  { bank: "Yes Bank", generalRate: "7.25%", seniorRate: "7.75%", tenure: "1–2 Years", type: "private" },
  { bank: "IDFC First Bank", generalRate: "7.25%", seniorRate: "7.75%", tenure: "1–2 Years", type: "private" },
  { bank: "RBL Bank", generalRate: "7.50%", seniorRate: "8.00%", tenure: "1–2 Years", type: "private" },
  // Small Finance Banks
  { bank: "AU Small Finance Bank", generalRate: "7.50%", seniorRate: "8.00%", tenure: "1–2 Years", type: "small-finance" },
  { bank: "Equitas Small Finance", generalRate: "7.75%", seniorRate: "8.25%", tenure: "1–2 Years", type: "small-finance" },
  { bank: "Ujjivan Small Finance", generalRate: "7.80%", seniorRate: "8.30%", tenure: "1–2 Years", type: "small-finance" },
  { bank: "Unity Small Finance", generalRate: "8.00%", seniorRate: "8.50%", tenure: "1–2 Years", type: "small-finance" },
];

// Market data types
export interface MarketItem {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  category: "index" | "commodity";
  unit?: string;
}

// Fetch live commodity data from metals.live (free, no CORS)
const fetchMetalPrices = async (): Promise<{ gold: number; silver: number }> => {
  try {
    const res = await fetch("https://api.metals.live/v1/spot");
    if (!res.ok) throw new Error("Metals API failed");
    const data = await res.json();
    const gold = data.find((m: any) => m.gold)?.gold || 0;
    const silver = data.find((m: any) => m.silver)?.silver || 0;
    return { gold: Number(gold), silver: Number(silver) };
  } catch {
    return { gold: 0, silver: 0 };
  }
};

// Generate market data with real metals + simulated indices
const fetchMarketData = async (): Promise<MarketItem[]> => {
  const metals = await fetchMetalPrices();

  // USD to INR approximate rate
  const usdToInr = 83.5;
  // Gold is per troy ounce, convert to per gram INR
  const goldPerGramInr = metals.gold > 0 ? (metals.gold / 31.1035) * usdToInr : 7650;
  // Silver per troy ounce to per gram INR
  const silverPerGramInr = metals.silver > 0 ? (metals.silver / 31.1035) * usdToInr : 92;

  // Small random variation for indices to simulate live feel
  const vary = (base: number, pct: number) => {
    const change = base * (pct / 100) * (Math.random() * 2 - 1);
    return { price: Math.round((base + change) * 100) / 100, change: Math.round(change * 100) / 100 };
  };

  const nifty = vary(23500, 0.8);
  const sensex = vary(77500, 0.7);
  const bankNifty = vary(49800, 0.9);
  const copper = vary(780, 1.2);

  return [
    { name: "Nifty 50", symbol: "NIFTY", ...nifty, changePercent: Number(((nifty.change / 23500) * 100).toFixed(2)), category: "index" },
    { name: "Sensex", symbol: "SENSEX", ...sensex, changePercent: Number(((sensex.change / 77500) * 100).toFixed(2)), category: "index" },
    { name: "Bank Nifty", symbol: "BANKNIFTY", ...bankNifty, changePercent: Number(((bankNifty.change / 49800) * 100).toFixed(2)), category: "index" },
    { name: "Gold", symbol: "GOLD", price: Math.round(goldPerGramInr * 100) / 100, change: vary(goldPerGramInr, 0.3).change, changePercent: Number((vary(goldPerGramInr, 0.3).change / goldPerGramInr * 100).toFixed(2)), category: "commodity", unit: "/gram" },
    { name: "Silver", symbol: "SILVER", price: Math.round(silverPerGramInr * 100) / 100, change: vary(silverPerGramInr, 0.5).change, changePercent: Number((vary(silverPerGramInr, 0.5).change / silverPerGramInr * 100).toFixed(2)), category: "commodity", unit: "/gram" },
    { name: "Copper", symbol: "COPPER", price: copper.price, change: copper.change, changePercent: Number(((copper.change / 780) * 100).toFixed(2)), category: "commodity", unit: "/kg" },
  ];
};

export const useMarketData = () => {
  return useQuery({
    queryKey: ["market-data"],
    queryFn: fetchMarketData,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 15000,
  });
};
