import { useState } from "react";
import { motion } from "framer-motion";
import { Landmark, Building2, Wallet } from "lucide-react";
import { fdRates, type FDRate } from "@/data/marketData";

type BankType = "all" | "public" | "private" | "small-finance";

const typeLabels: Record<BankType, string> = {
  all: "All Banks",
  public: "Public Sector",
  private: "Private Banks",
  "small-finance": "Small Finance",
};

const typeIcons: Record<string, React.ReactNode> = {
  public: <Landmark className="w-3.5 h-3.5" />,
  private: <Building2 className="w-3.5 h-3.5" />,
  "small-finance": <Wallet className="w-3.5 h-3.5" />,
};

const FDRatesTable = () => {
  const [activeType, setActiveType] = useState<BankType>("all");

  const filtered = activeType === "all" ? fdRates : fdRates.filter((r) => r.type === activeType);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Landmark className="w-5 h-5 text-amber" />
        <h2 className="text-xl font-display font-bold text-foreground">Fixed Deposit Interest Rates</h2>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(Object.keys(typeLabels) as BankType[]).map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeType === type
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Bank</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">Tenure</th>
                <th className="text-center py-3 px-4 font-semibold text-emerald">General Rate</th>
                <th className="text-center py-3 px-4 font-semibold text-amber">Senior Citizen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((fd, i) => (
                <tr
                  key={fd.bank}
                  className={`border-t border-border hover:bg-muted/30 transition-colors ${
                    i % 2 === 0 ? "" : "bg-muted/10"
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-foreground flex items-center gap-2">
                    {typeIcons[fd.type]}
                    {fd.bank}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground capitalize text-xs">
                    {fd.type === "small-finance" ? "Small Finance" : fd.type === "public" ? "PSU" : "Private"}
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground">{fd.tenure}</td>
                  <td className="py-3 px-4 text-center font-semibold text-emerald">{fd.generalRate}</td>
                  <td className="py-3 px-4 text-center font-semibold text-amber">{fd.seniorRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2">
        * Rates shown for 1–2 year tenure. Actual rates may vary. Please verify with the bank before investing.
      </p>
    </motion.section>
  );
};

export default FDRatesTable;
