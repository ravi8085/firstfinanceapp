import { motion } from "framer-motion";
import { Shield, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { investmentCategories } from "@/data/investmentData";

const riskIcons = {
  low: Shield,
  medium: AlertTriangle,
  high: TrendingUp,
};

const riskBadgeClasses = {
  low: "bg-emerald-light text-emerald",
  medium: "bg-amber-light text-amber",
  high: "bg-rose-light text-rose",
};

const colorBorderClasses: Record<string, string> = {
  emerald: "border-l-emerald",
  sky: "border-l-sky",
  navy: "border-l-navy",
  amber: "border-l-amber",
  rose: "border-l-rose",
};

const InvestmentsPage = () => {
  const lowRisk = investmentCategories.filter((c) => c.riskLevel === "low");
  const medRisk = investmentCategories.filter((c) => c.riskLevel === "medium");
  const highRisk = investmentCategories.filter((c) => c.riskLevel === "high");

  const sections = [
    { title: "Low Risk Investments", items: lowRisk, icon: Shield, desc: "Stable returns with capital protection" },
    { title: "Medium Risk", items: medRisk, icon: AlertTriangle, desc: "Moderate growth with manageable risk" },
    { title: "High Risk Investments", items: highRisk, icon: TrendingUp, desc: "Higher returns with greater volatility" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">Investment Options</h1>
        <p className="text-muted-foreground mb-8">Explore all recommended investment categories for Indian salaried professionals.</p>
      </motion.div>

      <div className="space-y-10">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <section.icon className="w-5 h-5 text-muted-foreground" />
              <div>
                <h2 className="text-xl font-display font-semibold text-foreground">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.desc}</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((cat, i) => {
                const RiskIcon = riskIcons[cat.riskLevel];
                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow border border-border border-l-4 ${colorBorderClasses[cat.color] || ""}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-display font-semibold text-foreground">{cat.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${riskBadgeClasses[cat.riskLevel]}`}>
                        {cat.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{cat.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <div className="text-xs text-muted-foreground">Recommended</div>
                        <div className="text-lg font-display font-bold text-foreground">{cat.percentage}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Expected Returns</div>
                        <div className="text-sm font-semibold text-secondary">{cat.expectedReturns}</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentsPage;
