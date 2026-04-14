import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { findAlternatives, ProductAlternative } from "@/lib/gemini";
import { getAffiliateLink } from "@/lib/affiliate";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Heart, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "@/components/auth-provider";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query as firestoreQuery, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "sonner";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [alternatives, setAlternatives] = useState<ProductAlternative[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchWishlist() {
      if (!user) return;
      const q = firestoreQuery(collection(db, "wishlists"), where("uid", "==", user.uid));
      const snap = await getDocs(q);
      const mapping: Record<string, string> = {};
      snap.docs.forEach(doc => {
        const data = doc.data() as any;
        mapping[data.productName] = doc.id;
      });
      setWishlistIds(mapping);
    }
    fetchWishlist();
  }, [user]);

  const toggleWishlist = async (alt: ProductAlternative) => {
    if (!user) {
      toast.error("Please sign in to save items");
      return;
    }

    const existingId = wishlistIds[alt.name];
    if (existingId) {
      try {
        await deleteDoc(doc(db, "wishlists", existingId));
        const newMapping = { ...wishlistIds };
        delete newMapping[alt.name];
        setWishlistIds(newMapping);
        toast.success("Removed from wishlist");
      } catch (error) {
        toast.error("Failed to remove item");
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "wishlists"), {
          uid: user.uid,
          productName: alt.name,
          price: alt.price,
          link: alt.link,
          platform: alt.platform,
          addedAt: serverTimestamp()
        });
        setWishlistIds({ ...wishlistIds, [alt.name]: docRef.id });
        toast.success("Added to wishlist!");
      } catch (error) {
        toast.error("Failed to add item");
      }
    }
  };

  useEffect(() => {
    async function fetchResults() {
      if (!queryParam) return;
      setLoading(true);
      const results = await findAlternatives(queryParam);
      setAlternatives(results);
      setLoading(false);
    }
    fetchResults();
  }, [queryParam]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Alternatives for "{queryParam}"</h1>
        <p className="text-muted-foreground">Found {alternatives.length} smart alternatives for you.</p>
      </div>

      {alternatives.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <p className="text-xl text-muted-foreground">No alternatives found. Try a different search term.</p>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternatives.map((alt, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full flex flex-col hover:shadow-2xl transition-all duration-300 border-border/50 rounded-[2rem] overflow-hidden group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.1em] font-bold text-muted-foreground">Top Alternative</div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{alt.name}</CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={`h-10 w-10 rounded-full bg-muted/20 ${wishlistIds[alt.name] ? 'text-red-500 fill-red-500' : ''}`}
                      onClick={() => toggleWishlist(alt)}
                    >
                      <Heart className={`h-5 w-5 ${wishlistIds[alt.name] ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <CardDescription className="text-accent font-bold text-2xl mt-2">
                    {alt.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {alt.description}
                  </p>
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 space-y-1">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Expert Verdict</p>
                    <p className="text-sm italic text-foreground/90">"{alt.reason}"</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    <ShoppingBag className="h-3 w-3" />
                    Available on: <span className="text-foreground">{alt.platform}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex gap-3">
                  <Button className="flex-1 rounded-xl font-bold h-11" asChild>
                    <a href={getAffiliateLink(alt.link)} target="_blank" rel="noopener noreferrer">
                      Buy Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Link to={`/product/${i}`} state={{ product: alt }}>
                    <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border/50">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
