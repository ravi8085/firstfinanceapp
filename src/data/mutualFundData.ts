import { useQuery } from "@tanstack/react-query";

export interface MFScheme {
  schemeCode: number;
  schemeName: string;
  category: string;
  type: string;
}

export interface MFNavData {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: { date: string; nav: string }[];
}

// Curated popular schemes across categories
export const popularSchemes: MFScheme[] = [
  // Large Cap Equity
  { schemeCode: 120503, schemeName: "SBI Bluechip Fund - Direct Growth", category: "Large Cap", type: "Equity" },
  { schemeCode: 120505, schemeName: "SBI Large & Midcap Fund - Direct Growth", category: "Large & Mid Cap", type: "Equity" },
  { schemeCode: 125497, schemeName: "HDFC Top 100 Fund - Direct Growth", category: "Large Cap", type: "Equity" },
  // Flexi / Multi Cap
  { schemeCode: 118989, schemeName: "Parag Parikh Flexi Cap Fund - Direct Growth", category: "Flexi Cap", type: "Equity" },
  { schemeCode: 120587, schemeName: "SBI Flexicap Fund - Direct Growth", category: "Flexi Cap", type: "Equity" },
  // Mid & Small Cap
  { schemeCode: 125494, schemeName: "HDFC Mid-Cap Opportunities - Direct Growth", category: "Mid Cap", type: "Equity" },
  { schemeCode: 125480, schemeName: "HDFC Small Cap Fund - Direct Growth", category: "Small Cap", type: "Equity" },
  // ELSS
  { schemeCode: 120847, schemeName: "Mirae Asset Tax Saver Fund - Direct Growth", category: "ELSS", type: "Equity" },
  { schemeCode: 119775, schemeName: "Quant Tax Plan - Direct Growth", category: "ELSS", type: "Equity" },
  // Debt
  { schemeCode: 119551, schemeName: "HDFC Short Term Debt Fund - Direct Growth", category: "Short Duration", type: "Debt" },
  { schemeCode: 120837, schemeName: "SBI Magnum Medium Duration Fund - Direct Growth", category: "Medium Duration", type: "Debt" },
  { schemeCode: 119243, schemeName: "ICICI Pru Corporate Bond Fund - Direct Growth", category: "Corporate Bond", type: "Debt" },
  // Hybrid
  { schemeCode: 125492, schemeName: "HDFC Balanced Advantage Fund - Direct Growth", category: "Balanced Advantage", type: "Hybrid" },
  { schemeCode: 119212, schemeName: "ICICI Pru Equity & Debt Fund - Direct Growth", category: "Aggressive Hybrid", type: "Hybrid" },
  // Index / ETF
  { schemeCode: 120716, schemeName: "UTI Nifty 50 Index Fund - Direct Growth", category: "Index Fund", type: "Index/ETF" },
  { schemeCode: 120684, schemeName: "Motilal Oswal Nasdaq 100 FOF - Direct Growth", category: "International", type: "Index/ETF" },
  { schemeCode: 145552, schemeName: "Nippon India Nifty 50 BeES ETF", category: "Nifty 50 ETF", type: "Index/ETF" },
  { schemeCode: 135870, schemeName: "SBI ETF Nifty Bank", category: "Bank ETF", type: "Index/ETF" },
];

const fetchLatestNav = async (schemeCode: number): Promise<MFNavData> => {
  const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}/latest`);
  if (!res.ok) throw new Error(`Failed to fetch NAV for ${schemeCode}`);
  return res.json();
};

export const useMutualFundNav = (schemeCode: number) => {
  return useQuery({
    queryKey: ["mf-nav", schemeCode],
    queryFn: () => fetchLatestNav(schemeCode),
    staleTime: 1000 * 60 * 30, // 30 min cache
    retry: 2,
  });
};

export const searchMutualFunds = async (query: string): Promise<{ schemeCode: number; schemeName: string }[]> => {
  const res = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

export const mfTypes = ["All", "Equity", "Debt", "Hybrid", "Index/ETF"] as const;
export type MFType = (typeof mfTypes)[number];
