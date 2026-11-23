import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, IndianRupee, ArrowDown } from "lucide-react";
import { indiaInflationHistory, averageInflation, futureValue, futurePurchasingPower } from "@/data/inflationData";
import { formatCurrency } from "@/data/investmentData";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

interface Props {
  salary: number;
}

const InflationProjector = ({ salary }: Props) => {
  const [years, setYears] = useState(10);
  const [customInflation, setCustomInflation] = useState(Math.round(averageInflation * 10) / 10);

  const projectionData = Array.from({ length: years + 1 }, (_, i) => ({
    year: `Year ${i}`,
    costNeeded: Math.round(futureValue(salary, customInflation, i)),
    purchasingPower: Math.round(futurePurchasingPower(salary, customInflation, i)),
  }));

  const futureSalaryNeeded = futureValue(salary, customInflation, years);
  const currentPowerInFuture = futurePurchasingPower(salary, customInflation, years);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Historical Inflation */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-secondary" />
          <h3 className="font-display font-semibold text-foreground">India Inflation History (CPI)</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Average inflation over the last {indiaInflationHistory.length} years: <span className="font-bold text-secondary">{averageInflation.toFixed(2)}%</span>
        </p>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={indiaInflationHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(val: number) => [`${val}%`, "Inflation Rate"]}
              />
              <Line type="monotone" dataKey="rate" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 3, fill: "hsl(var(--secondary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Future Value Calculator */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="w-5 h-5 text-amber" />
          <h3 className="font-display font-semibold text-foreground">Future Currency Value</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          See what your current salary of {formatCurrency(salary)} will be worth in the future.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Years into future
            </label>
            <input
              type="range"
              min={1}
              max={40}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full accent-emerald"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 yr</span>
              <span className="font-bold text-foreground">{years} years</span>
              <span>40 yrs</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Assumed Inflation Rate
            </label>
            <input
              type="number"
              value={customInflation}
              onChange={(e) => setCustomInflation(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              min={1}
              max={15}
              step={0.1}
            />
          </div>
        </div>

        {/* Results cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-amber/10 rounded-xl p-4 border border-amber/20">
            <div className="text-xs text-amber font-medium mb-1">
              To maintain today's lifestyle in {years} yrs
            </div>
            <div className="text-xl font-display font-bold text-amber">
              {formatCurrency(Math.round(futureSalaryNeeded))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              You'll need this much salary to match today's ₹{salary.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="bg-rose/10 rounded-xl p-4 border border-rose/20">
            <div className="flex items-center gap-1 text-xs text-rose font-medium mb-1">
              <ArrowDown className="w-3 h-3" /> Today's ₹{salary.toLocaleString("en-IN")} in {years} yrs
            </div>
            <div className="text-xl font-display font-bold text-rose">
              {formatCurrency(Math.round(currentPowerInFuture))}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Purchasing power lost: {formatCurrency(salary - Math.round(currentPowerInFuture))}
            </div>
          </div>
        </div>

        {/* Projection chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={Math.max(1, Math.floor(years / 8))} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(val: number, name: string) => [formatCurrency(val), name === "costNeeded" ? "Salary needed" : "Purchasing power"]}
              />
              <Line type="monotone" dataKey="costNeeded" stroke="#e8943a" strokeWidth={2} dot={false} name="costNeeded" />
              <Line type="monotone" dataKey="purchasingPower" stroke="#e05570" strokeWidth={2} dot={false} name="purchasingPower" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 justify-center">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-3 h-0.5 bg-amber rounded" /> Salary needed to match today
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="w-3 h-0.5 bg-rose rounded" /> Today's salary worth in future
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InflationProjector;
