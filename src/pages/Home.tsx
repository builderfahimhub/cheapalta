import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, TrendingUp, Zap, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const trendingProducts = [
    { name: "AirPods Pro", price: "$249", alternative: "Sony WF-1000XM5", altPrice: "$198" },
    { name: "iPhone 15", price: "$799", alternative: "Google Pixel 8", altPrice: "$699" },
    { name: "Dyson V15", price: "$749", alternative: "Shark Stratos", altPrice: "$499" },
  ];

  return (
    <div className="space-y-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-fr">
        {/* Hero Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-slate-800 to-slate-950 border border-primary/20 rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute top-6 right-6 bg-accent text-accent-foreground text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">
            Savings Alert
          </div>
          <div className="space-y-6 relative z-10">
            <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Target Product</div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Find Smarter. <br />
                <span className="text-accent">Buy Cheaper.</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Search for any product and we'll find high-quality alternatives that save you money instantly.
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="relative max-w-md">
              <Input
                type="text"
                placeholder="Paste URL or search product..."
                className="h-12 pl-10 pr-4 bg-background/50 border-border/50 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Button type="submit" className="mt-4 w-full rounded-xl font-bold">
                Find Alternatives
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Potential Savings Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-[2rem] p-6 flex flex-col items-center justify-center text-center space-y-2"
        >
          <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Potential Savings</div>
          <div className="text-5xl font-extrabold text-accent">$149+</div>
          <div className="text-sm text-muted-foreground">Average saved per switch</div>
        </motion.div>

        {/* Price History / Chart Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-[2rem] p-6 flex flex-col justify-between"
        >
          <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Price Trends</div>
          <div className="flex items-end gap-1.5 h-20 mt-4">
            {[40, 60, 45, 70, 55, 90, 35].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/60 rounded-sm" 
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="text-[10px] text-muted-foreground mt-2">Market Volatility: Low</div>
        </motion.div>

        {/* Trending Comparisons Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 bg-card border border-border rounded-[2rem] p-6 space-y-4"
        >
          <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Trending Comparisons</div>
          <div className="flex flex-wrap gap-2">
            {["iPhone 15 vs S24", "Mechanical Keyboards", "Airfryers < $50", "Gaming Laptops"].map((tag, i) => (
              <div key={i} className="px-4 py-2 bg-muted/50 rounded-full text-xs font-medium hover:bg-muted transition-colors cursor-pointer">
                {tag}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reviews Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-[2rem] p-6 space-y-3"
        >
          <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Recent Review</div>
          <div className="flex gap-0.5 text-yellow-500">
            {[1, 2, 3, 4, 5].map(i => <span key={i}>★</span>)}
          </div>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            "Found an amazing alternative to my Dyson. Saved $250 and the quality is identical!"
          </p>
        </motion.div>

        {/* Quick Stats Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-[2rem] p-6 flex flex-col justify-center space-y-1"
        >
          <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-muted-foreground">Community</div>
          <div className="text-2xl font-bold">12.4k</div>
          <div className="text-xs text-muted-foreground">Active deal hunters</div>
        </motion.div>
      </div>

      {/* Featured Comparisons Section */}
      <section className="space-y-6 pt-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Top Value Picks
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {trendingProducts.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="cursor-pointer"
              onClick={() => navigate(`/search?q=${encodeURIComponent(item.name)}`)}
            >
              <Card className="rounded-[2rem] border-border/50">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Original</p>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-sm font-medium text-destructive line-through opacity-70">{item.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-accent">Alternative</p>
                      <p className="font-bold">{item.alternative}</p>
                      <p className="text-sm font-bold text-accent">{item.altPrice}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-3/4" />
                  </div>
                  <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest">High Quality Match</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
