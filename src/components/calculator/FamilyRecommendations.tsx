import { motion } from "framer-motion";
import { Heart, GraduationCap, Shield, TrendingUp } from "lucide-react";
import { getFamilyRecommendations, type FamilyInstrument } from "@/data/familyInvestmentData";
import { formatCurrency } from "@/data/investmentData";

const colorMap: Record<string, string> = {
  emerald: "#2eb87a",
  sky: "#38a3d5",
  navy: "#2a3f6f",
  amber: "#e8943a",
  rose: "#e05570",
};

const riskBadge: Record<string, string> = {
  low: "bg-emerald/10 text-emerald",
  medium: "bg-amber/10 text-amber",
  high: "bg-rose/10 text-rose",
};

const InstrumentCard = ({ instrument }: { instrument: FamilyInstrument }) => (
  <div className="bg-muted/50 rounded-xl p-4 border border-border hover:border-secondary/40 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <h4 className="text-sm font-semibold text-foreground leading-tight flex-1">{instrument.name}</h4>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ml-2 shrink-0 ${riskBadge[instrument.riskLevel]}`}>
        {instrument.riskLevel}
      </span>
    </div>
    <p className="text-xs text-muted-foreground mb-3">{instrument.description}</p>
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <span className="text-muted-foreground">Returns: </span>
        <span className="font-medium text-foreground">{instrument.expectedReturns}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Provider: </span>
        <span className="font-medium text-foreground">{instrument.provider}</span>
      </div>
      {instrument.minInvestment && (
        <div>
          <span className="text-muted-foreground">Min: </span>
          <span className="font-medium text-foreground">{instrument.minInvestment}</span>
        </div>
      )}
      {instrument.lockIn && (
        <div>
          <span className="text-muted-foreground">Lock-in: </span>
          <span className="font-medium text-foreground">{instrument.lockIn}</span>
        </div>
      )}
      {instrument.taxBenefit && (
        <div className="col-span-2">
          <span className="text-muted-foreground">Tax: </span>
          <span className="font-medium text-emerald">{instrument.taxBenefit}</span>
        </div>
      )}
    </div>
    <div className="mt-2 pt-2 border-t border-border">
      <span className="text-[10px] text-muted-foreground">Best for: </span>
      <span className="text-[10px] font-medium text-secondary">{instrument.bestFor}</span>
    </div>
  </div>
);

interface Props {
  salary: number;
  hasChildren: boolean;
}

const sectionConfig = [
  { key: "education" as const, title: "Children's Education", icon: GraduationCap, budgetKey: "educationBudget" as const, instrumentsKey: "educationInstruments" as const },
  { key: "protection" as const, title: "Family Protection", icon: Shield, budgetKey: "protectionBudget" as const, instrumentsKey: "protectionInstruments" as const },
  { key: "wealth" as const, title: "Wealth Building", icon: TrendingUp, budgetKey: "wealthBudget" as const, instrumentsKey: "wealthInstruments" as const },
];

const FamilyRecommendations = ({ salary, hasChildren }: Props) => {
  const recs = getFamilyRecommendations(salary, hasChildren);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Family budget summary */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose" />
          <h3 className="font-display font-semibold text-foreground">
            Family Investment Plan {hasChildren ? "(With Children)" : "(Spouse Only)"}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Recommended additional {formatCurrency(recs.totalFamilyBudget)}/month for family security & growth.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {sectionConfig.map(({ key, title, budgetKey }) => (
            <div key={key} className="bg-muted/50 rounded-xl p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">{title}</div>
              <div className="text-lg font-display font-bold text-foreground">{formatCurrency(recs[budgetKey])}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Instrument sections */}
      {sectionConfig.map(({ key, title, icon: Icon, instrumentsKey }) => (
        <div key={key} className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Icon className="w-5 h-5 text-secondary" />
            <h3 className="font-display font-semibold text-foreground">{title}</h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {recs[instrumentsKey].map((inst) => (
              <InstrumentCard key={inst.name} instrument={inst} />
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default FamilyRecommendations;
