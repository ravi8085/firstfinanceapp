import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Filter } from "lucide-react";
import { popularSchemes, mfTypes, type MFType } from "@/data/mutualFundData";
import MFSchemeCard from "@/components/mutualfunds/MFSchemeCard";

const MutualFundsPage = () => {
  const [activeType, setActiveType] = useState<MFType>("All");
  const [search, setSearch] = useState("");

  const filtered = popularSchemes.filter((s) => {
    const matchType = activeType === "All" || s.type === activeType;
    const matchSearch =
      !search ||
      s.schemeName.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-7 h-7 text-secondary" />
          <h1 className="text-3xl font-display font-bold text-foreground">Mutual Funds</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Live NAV data for popular Indian mutual funds, ETFs, and index funds.
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 mb-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by fund name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-secondary text-sm"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {mfTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 shadow-card border border-border text-center">
          <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No funds match your search.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((scheme) => (
            <MFSchemeCard key={scheme.schemeCode} scheme={scheme} />
          ))}
        </motion.div>
      )}

      <p className="text-xs text-muted-foreground text-center mt-8">
        Data sourced from MFAPI.in · NAV updates daily · Chanakya Finance Solutions
      </p>
    </div>
  );
};

export default MutualFundsPage;
