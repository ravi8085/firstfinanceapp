import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw, ArrowUpDown } from "lucide-react";
import { useMarketData, type MarketItem } from "@/data/marketData";

const MarketTickerItem = ({ item }: { item: MarketItem }) => {
  const isPositive = item.change >= 0;
  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border hover:border-secondary/40 transition-colors min-w-[180px]">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground">{item.symbol}</span>
        {isPositive ? (
          <TrendingUp className="w-3.5 h-3.5 text-emerald" />
        ) : (
          <TrendingDown className="w-3.5 h-3.5 text-rose" />
        )}
      </div>
      <div className="text-lg font-display font-bold text-foreground">
        ₹{item.price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        {item.unit && <span className="text-xs text-muted-foreground font-normal">{item.unit}</span>}
      </div>
      <div className={`text-xs font-medium mt-1 ${isPositive ? "text-emerald" : "text-rose"}`}>
        {isPositive ? "+" : ""}{item.change.toFixed(2)} ({isPositive ? "+" : ""}{item.changePercent}%)
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{item.name}</div>
    </div>
  );
};

const MarketTicker = () => {
  const { data, isLoading, dataUpdatedAt, refetch, isFetching } = useMarketData();

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : "";

  const indices = data?.filter((d) => d.category === "index") || [];
  const commodities = data?.filter((d) => d.category === "commodity") || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-secondary" />
          <h2 className="text-xl font-display font-bold text-foreground">Live Market Data</h2>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] text-muted-foreground">Updated: {lastUpdated}</span>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${isFetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 shadow-card border border-border animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <>
          {/* Indices */}
          <div className="mb-3">
            <span className="text-xs font-medium text-muted-foreground mb-2 block">Market Indices</span>
            <div className="grid grid-cols-3 gap-3">
              {indices.map((item) => (
                <MarketTickerItem key={item.symbol} item={item} />
              ))}
            </div>
          </div>
          {/* Commodities */}
          <div>
            <span className="text-xs font-medium text-muted-foreground mb-2 block">Commodities</span>
            <div className="grid grid-cols-3 gap-3">
              {commodities.map((item) => (
                <MarketTickerItem key={item.symbol} item={item} />
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-1 mt-3">
        <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
        <span className="text-[10px] text-muted-foreground">Auto-refreshes every 30 seconds</span>
      </div>
    </motion.section>
  );
};

export default MarketTicker;
