import { useMutualFundNav, type MFScheme } from "@/data/mutualFundData";
import { Loader2 } from "lucide-react";

const MFSchemeCard = ({ scheme }: { scheme: MFScheme }) => {
  const { data, isLoading, isError } = useMutualFundNav(scheme.schemeCode);

  const nav = data?.data?.[0]?.nav;
  const date = data?.data?.[0]?.date;
  const fundHouse = data?.meta?.fund_house;

  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border hover:border-secondary/40 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-foreground leading-tight flex-1">
          {scheme.schemeName}
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium shrink-0">
          {scheme.category}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-3">
          <Loader2 className="w-3 h-3 animate-spin" />
          Loading NAV…
        </div>
      ) : isError ? (
        <p className="text-xs text-rose mt-3">Failed to load data</p>
      ) : (
        <div className="mt-3 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-display font-bold text-foreground">
              ₹{Number(nav).toFixed(2)}
            </span>
            <span className="text-[10px] text-muted-foreground">NAV as on {date}</span>
          </div>
          {fundHouse && (
            <p className="text-xs text-muted-foreground">{fundHouse}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MFSchemeCard;
