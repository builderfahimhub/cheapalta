import { useParams, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ExternalLink, Heart, ArrowLeft, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { motion } from "motion/react";
import { getAffiliateLink } from "@/lib/affiliate";

export default function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const passedProduct = location.state?.product;
  
  // Use passed data or fallback to mock
  const product = passedProduct || {
    name: "Sony WF-1000XM5",
    price: "$198",
    originalPrice: "$299",
    rating: 4.8,
    reviews: 1240,
    description: "Industry-leading noise canceling with two high-performance processors and dual feedback microphones. Dynamic Driver X for wide frequency reproduction and rich detail.",
    features: [
      "Integrated Processor V2",
      "High-Resolution Audio Wireless",
      "AI-based noise reduction",
      "Up to 24 hours battery life"
    ],
    platform: "Amazon",
    link: "https://example.com/sony-wf-1000xm5"
  };

  // If it's a passed product, it might not have all fields (like features)
  const features = product.features || [
    "High-quality alternative",
    "Verified platform",
    "Great value for money",
    "Fast delivery options"
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Link to={-1 as any}>
        <Button variant="ghost" className="pl-0 hover:bg-transparent">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to results
        </Button>
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square bg-muted rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4"
        >
          <div className="text-6xl">📦</div>
          <p className="text-muted-foreground font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground/60">Image coming from {product.platform}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Badge variant="secondary" className="text-primary font-bold">BEST VALUE ALTERNATIVE</Badge>
            <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 font-bold text-foreground">{product.rating}</span>
              </div>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-3xl font-bold text-primary">{product.price}</p>
            {product.originalPrice && (
              <>
                <p className="text-sm text-muted-foreground line-through">Original: {product.originalPrice}</p>
                <p className="text-sm text-green-600 font-semibold">High Value Alternative</p>
              </>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="flex gap-4">
            <Button className="flex-1 h-12 text-lg" asChild>
              <a href={getAffiliateLink(product.link)} target="_blank" rel="noopener noreferrer">
                Buy on {product.platform} <ExternalLink className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-12 w-12">
              <Heart className="h-6 w-6" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center space-y-1">
              <ShieldCheck className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-wider">Verified</p>
            </div>
            <div className="text-center space-y-1">
              <Truck className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-wider">Fast Shipping</p>
            </div>
            <div className="text-center space-y-1">
              <RefreshCcw className="h-5 w-5 mx-auto text-muted-foreground" />
              <p className="text-[10px] font-bold uppercase tracking-wider">Easy Returns</p>
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="comparison">Price History</TabsTrigger>
          <TabsTrigger value="reviews">User Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="features" className="p-6 border rounded-xl mt-4">
          <ul className="grid md:grid-cols-2 gap-4">
            {features.map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="comparison" className="p-6 border rounded-xl mt-4">
          <p className="text-muted-foreground text-center py-8">Price history chart coming soon...</p>
        </TabsContent>
        <TabsContent value="reviews" className="p-6 border rounded-xl mt-4">
          <p className="text-muted-foreground text-center py-8">User reviews coming soon...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
