import { Mail, Shield, Info, HelpCircle, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";

export default function About() {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-black tracking-tighter"
        >
          About <span className="text-primary">CHEAPALTA</span>
        </motion.h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We are dedicated to helping you find the best value for your money by discovering high-quality alternatives to expensive brand-name products.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              In a world of overpriced brands, CHEAPALTA uses advanced AI to scan the market and find products that offer the same or better performance for a fraction of the cost. Our goal is to democratize quality shopping.
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full rounded-[2.5rem] border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl font-bold">How it Works</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              When you search for a product, our Gemini-powered engine analyzes features, reviews, and pricing data across multiple platforms to suggest "Smart Alternatives" that match your needs and budget.
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Help Centre Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Help Centre</h2>
        </div>
        
        <Card className="rounded-[3rem] border-primary/20 bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden">
          <CardContent className="p-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Need assistance?</h3>
              <p className="text-muted-foreground">
                Our support team is here to help you with any questions regarding product comparisons, your account, or partnership inquiries.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Us</p>
                    <a href="mailto:fahimzzhasan0@gmail.com" className="text-lg font-semibold hover:text-primary transition-colors">
                      fahimzzhasan0@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Location</p>
                    <p className="text-lg font-semibold">Global / Digital First</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/10 rounded-[2rem] p-8 border border-white/5 space-y-4">
              <h4 className="font-bold">Frequently Asked Questions</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer transition-colors">→ How do you verify alternatives?</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">→ Is my data secure?</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">→ How can I suggest a product?</li>
                <li className="hover:text-foreground cursor-pointer transition-colors">→ Do you offer price tracking?</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  );
}
