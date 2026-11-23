import { motion } from "framer-motion";
import { MapPin, Home, Utensils, Bus, Zap, Film, ShoppingBag, Building } from "lucide-react";
import { type CityExpense, formatCurrency } from "@/data/investmentData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

const expenseItems = [
  { key: "rent" as const, label: "Rent / Housing", icon: Home, color: "#e05570" },
  { key: "food" as const, label: "Food & Groceries", icon: Utensils, color: "#e8943a" },
  { key: "transport" as const, label: "Transport", icon: Bus, color: "#38a3d5" },
  { key: "utilities" as const, label: "Utilities & Bills", icon: Zap, color: "#2eb87a" },
  { key: "entertainment" as const, label: "Entertainment", icon: Film, color: "#a855f7" },
  { key: "miscellaneous" as const, label: "Miscellaneous", icon: ShoppingBag, color: "#2a3f6f" },
];

interface Props {
  cityData: CityExpense;
  salary: number;
  familyMembers?: number;
}

const CityExpenseBreakdown = ({ cityData, salary, familyMembers = 1 }: Props) => {
  const expensePercent = Math.round((cityData.total / salary) * 100);

  const chartData = expenseItems.map((item) => ({
    name: item.label,
    amount: cityData[item.key],
    fill: item.color,
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 shadow-card border border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber" />
            <h3 className="font-display font-semibold text-foreground">
              Living in {cityData.city} {familyMembers > 1 ? `(${familyMembers} members)` : ""}
            </h3>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">
            {cityData.tier}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={18}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {expenseItems.map((item) => {
              const amount = cityData[item.key];
              const pct = Math.round((amount / cityData.total) * 100);
              return (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-foreground">{formatCurrency(amount)}</span>
                    <span className="text-xs text-muted-foreground ml-2">({pct}%)</span>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Total Monthly</span>
              <div className="text-right">
                <span className="text-sm font-bold text-amber">{formatCurrency(cityData.total)}</span>
                <span className="text-xs text-muted-foreground ml-2">({expensePercent}% of salary)</span>
              </div>
            </div>
          </div>
        </div>

        {expensePercent > 60 && (
          <div className="mt-4 p-3 rounded-xl bg-rose/5 border border-rose/20">
            <p className="text-xs text-rose font-medium">
              ⚠️ Your city expenses consume {expensePercent}% of salary. Consider optimizing rent or exploring Tier 2/3 cities for better savings potential.
            </p>
          </div>
        )}
        {expensePercent <= 40 && (
          <div className="mt-4 p-3 rounded-xl bg-emerald/5 border border-emerald/20">
            <p className="text-xs text-emerald font-medium">
              ✅ Great! City expenses are only {expensePercent}% of salary — you have strong room for aggressive investments.
            </p>
          </div>
        )}
      </motion.div>

      {/* Locality Rent Breakdown */}
      {cityData.localities && cityData.localities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-card border border-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-secondary" />
            <h3 className="font-display font-semibold text-foreground">
              Rent by Locality — {cityData.city}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Approximate monthly rent ranges across popular localities.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Locality</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">1 BHK</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">2 BHK</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">3 BHK</th>
                </tr>
              </thead>
              <tbody>
                {cityData.localities.map((loc, i) => (
                  <tr key={loc.locality} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                    <td className="py-2.5 pr-4 font-medium text-foreground">{loc.locality}</td>
                    <td className="py-2.5 px-3 text-center text-muted-foreground whitespace-nowrap">{loc.bhk1}</td>
                    <td className="py-2.5 px-3 text-center text-muted-foreground whitespace-nowrap">{loc.bhk2}</td>
                    <td className="py-2.5 px-3 text-center text-muted-foreground whitespace-nowrap">{loc.bhk3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CityExpenseBreakdown;