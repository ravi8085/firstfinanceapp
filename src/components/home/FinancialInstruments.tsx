import { motion } from "framer-motion";
import {
  Landmark, TrendingUp, Shield, Building2, Users, Coins,
  PiggyBank, Wallet, BarChart3, ArrowUpDown, Gem, CircleDollarSign,
  HandCoins, LineChart, CandlestickChart, Globe, Bitcoin, Package,
  HeartPulse, Umbrella, Clock, BadgePercent, Home, GraduationCap,
  Handshake
} from "lucide-react";

interface Instrument {
  name: string;
  icon: React.ElementType;
  returnRange: string;
  risk: "Low" | "Medium" | "High" | "Very High";
  lockIn?: string;
  taxBenefit?: boolean;
}

interface InstrumentCategory {
  title: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  instruments: Instrument[];
}

const riskColor: Record<string, string> = {
  Low: "bg-emerald/15 text-emerald",
  Medium: "bg-amber/15 text-amber",
  High: "bg-rose/15 text-rose",
  "Very High": "bg-rose/25 text-rose",
};

const categories: InstrumentCategory[] = [
  {
    title: "Banks",
    icon: Landmark,
    colorClass: "text-emerald",
    bgClass: "bg-emerald/10",
    borderClass: "border-emerald/20",
    instruments: [
      { name: "Fixed Deposits", icon: PiggyBank, returnRange: "6.5% – 7.5%", risk: "Low", lockIn: "1–5 yrs", taxBenefit: true },
      { name: "PPF", icon: Shield, returnRange: "7.1%", risk: "Low", lockIn: "15 yrs", taxBenefit: true },
      { name: "Recurring Deposit", icon: Wallet, returnRange: "6.0% – 7.0%", risk: "Low", lockIn: "6mo–10 yrs" },
      { name: "NSC", icon: BadgePercent, returnRange: "7.7%", risk: "Low", lockIn: "5 yrs", taxBenefit: true },
      { name: "SCSS", icon: Clock, returnRange: "8.2%", risk: "Low", lockIn: "5 yrs", taxBenefit: true },
      { name: "Bank Bonds & Debentures", icon: Landmark, returnRange: "7% – 9%", risk: "Medium", lockIn: "Varies" },
      { name: "Sovereign Gold Bonds", icon: Coins, returnRange: "2.5% + Gold", risk: "Medium", lockIn: "8 yrs", taxBenefit: true },
      { name: "Sec-54 EC Bonds", icon: BadgePercent, returnRange: "5.25%", risk: "Low", lockIn: "5 yrs", taxBenefit: true },
    ],
  },
  {
    title: "Markets",
    icon: TrendingUp,
    colorClass: "text-sky",
    bgClass: "bg-sky/10",
    borderClass: "border-sky/20",
    instruments: [
      { name: "Direct Stocks", icon: BarChart3, returnRange: "12% – 20%", risk: "High" },
      { name: "IPOs", icon: ArrowUpDown, returnRange: "Varies", risk: "High" },
      { name: "Mutual Funds", icon: LineChart, returnRange: "10% – 15%", risk: "Medium" },
      { name: "SIP", icon: CircleDollarSign, returnRange: "12% – 15%", risk: "Medium" },
      { name: "ETFs", icon: Package, returnRange: "10% – 14%", risk: "Medium" },
      { name: "Futures & Options", icon: CandlestickChart, returnRange: "Varies", risk: "Very High" },
      { name: "Commodities", icon: Gem, returnRange: "Varies", risk: "High" },
      { name: "Forex", icon: Globe, returnRange: "Varies", risk: "Very High" },
      { name: "Cryptocurrency", icon: Bitcoin, returnRange: "Varies", risk: "Very High" },
    ],
  },
  {
    title: "Government",
    icon: Building2,
    colorClass: "text-amber",
    bgClass: "bg-amber/10",
    borderClass: "border-amber/20",
    instruments: [
      { name: "EPF", icon: Shield, returnRange: "8.25%", risk: "Low", lockIn: "Till retirement", taxBenefit: true },
      { name: "NPS", icon: PiggyBank, returnRange: "9% – 12%", risk: "Medium", lockIn: "Till 60", taxBenefit: true },
      { name: "NPS Vatsalya", icon: GraduationCap, returnRange: "9% – 12%", risk: "Medium", lockIn: "Till child is 18", taxBenefit: true },
    ],
  },
  {
    title: "Insurance",
    icon: Umbrella,
    colorClass: "text-rose",
    bgClass: "bg-rose/10",
    borderClass: "border-rose/20",
    instruments: [
      { name: "Guaranteed Income", icon: HandCoins, returnRange: "5% – 6.5%", risk: "Low", lockIn: "10–20 yrs" },
      { name: "ULIP", icon: LineChart, returnRange: "8% – 12%", risk: "Medium", lockIn: "5 yrs", taxBenefit: true },
      { name: "Pension Plans", icon: Clock, returnRange: "5% – 8%", risk: "Low", lockIn: "Till retirement" },
      { name: "Savings Plans", icon: PiggyBank, returnRange: "5% – 7%", risk: "Low", lockIn: "10–15 yrs" },
      { name: "Term Insurance", icon: Shield, returnRange: "Protection only", risk: "Low" },
    ],
  },
  {
    title: "Physical Investments",
    icon: Gem,
    colorClass: "text-secondary",
    bgClass: "bg-secondary/10",
    borderClass: "border-secondary/20",
    instruments: [
      { name: "Gold", icon: Coins, returnRange: "8% – 10%", risk: "Medium" },
      { name: "Silver", icon: Gem, returnRange: "7% – 12%", risk: "Medium" },
      { name: "Real Estate", icon: Home, returnRange: "8% – 15%", risk: "Medium", lockIn: "Long-term" },
    ],
  },
  {
    title: "Social Investments",
    icon: Users,
    colorClass: "text-muted-foreground",
    bgClass: "bg-muted",
    borderClass: "border-border",
    instruments: [
      { name: "Chits", icon: Handshake, returnRange: "Varies", risk: "High" },
      { name: "Hand Loans", icon: HandCoins, returnRange: "12% – 24%", risk: "Very High" },
    ],
  },
];

const FinancialInstruments = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-display font-bold text-foreground mb-3">
          Financial Instruments in India
        </h2>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Explore all major investment avenues — from safe bank deposits to high-risk market plays.
        </p>
      </motion.div>

      <div className="space-y-6">
        {categories.map((cat, ci) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.05 }}
            className="bg-card rounded-2xl p-5 sm:p-6 shadow-card border border-border"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cat.bgClass}`}>
                <cat.icon className={`w-4 h-4 ${cat.colorClass}`} />
              </div>
              <h3 className={`font-display font-semibold text-lg ${cat.colorClass}`}>{cat.title}</h3>
              <span className="text-xs text-muted-foreground ml-auto">{cat.instruments.length} instruments</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {cat.instruments.map((inst) => (
                <div
                  key={inst.name}
                  className={`rounded-lg p-2.5 border ${cat.borderClass} bg-muted/30 hover:bg-muted/60 transition-colors`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <inst.icon className={`w-3.5 h-3.5 ${cat.colorClass} shrink-0`} />
                    <span className="text-xs font-medium text-foreground leading-tight truncate">{inst.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-muted-foreground">
                      <span className="font-medium text-foreground">{inst.returnRange}</span>
                    </span>
                    <span className={`text-[9px] px-1 py-0.5 rounded-full font-medium ${riskColor[inst.risk]}`}>
                      {inst.risk}
                    </span>
                  </div>
                  {(inst.lockIn || inst.taxBenefit) && (
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      {inst.lockIn && (
                        <span className="text-[9px] text-muted-foreground">🔒 {inst.lockIn}</span>
                      )}
                      {inst.taxBenefit && (
                        <span className="text-[9px] text-emerald font-medium">✅ Tax</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FinancialInstruments;
