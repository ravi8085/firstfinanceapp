import { motion } from "framer-motion";
import { Quote, TrendingUp } from "lucide-react";
import investorRakesh from "@/assets/investor-rakesh.jpg";
import investorVijay from "@/assets/investor-vijay.jpg";
import investorDamani from "@/assets/investor-damani.jpg";
import investorPremji from "@/assets/investor-premji.jpg";

const investors = [
  {
    name: "Rakesh Jhunjhunwala",
    title: "The Big Bull of India",
    image: investorRakesh,
    quote: "Buy right, sit tight. The stock market is a device for transferring money from the impatient to the patient.",
    achievement: "Turned ₹5,000 into ₹46,000 Cr+ through disciplined value investing over 3 decades.",
    strategy: "Value Investing",
  },
  {
    name: "Vijay Kedia",
    title: "Small & Mid-Cap King",
    image: investorVijay,
    quote: "Invest in businesses you understand. My SMILE strategy — Small in size, Medium in experience, Large in aspiration, Extra-large in market potential.",
    achievement: "Built a ₹1,000 Cr+ portfolio by identifying multi-bagger small-cap stocks early.",
    strategy: "Growth Investing",
  },
  {
    name: "Radhakishan Damani",
    title: "Retail & Value Investor",
    image: investorDamani,
    quote: "Stay away from the noise. Focus on businesses with strong fundamentals and let compounding do its magic.",
    achievement: "Net worth of ₹1.5 Lakh Cr+. Built DMart and invested in VST Industries, 3M India early.",
    strategy: "Long-Term Value",
  },
  {
    name: "Azim Premji",
    title: "The Czar of Indian IT",
    image: investorPremji,
    quote: "If people are not laughing at your goals, your goals are too small. Stay consistent, stay invested.",
    achievement: "Transformed a ₹2 Lakh cooking oil company into ₹1.5 Lakh Cr+ Wipro IT giant.",
    strategy: "Business Building",
  },
];

const InvestorStories = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
          <TrendingUp className="w-3.5 h-3.5" />
          Learn from the Legends
        </div>
        <h2 className="text-3xl font-display font-bold text-foreground mb-3">
          India's Greatest Investor Stories
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Real stories of wealth creation through patience, discipline, and smart investing.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {investors.map((investor, i) => (
          <motion.div
            key={investor.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all border border-border group"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={investor.image}
                alt={investor.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-secondary/30 group-hover:border-secondary/60 transition-colors"
              />
              <div>
                <h3 className="font-display font-bold text-foreground">{investor.name}</h3>
                <p className="text-sm text-secondary font-medium">{investor.title}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  {investor.strategy}
                </span>
              </div>
            </div>

            <div className="relative mb-4">
              <Quote className="w-4 h-4 text-secondary/40 absolute -top-1 -left-1" />
              <p className="text-sm text-muted-foreground italic leading-relaxed pl-5">
                "{investor.quote}"
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-3 border border-border">
              <p className="text-xs font-medium text-foreground/80">
                🏆 {investor.achievement}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default InvestorStories;
