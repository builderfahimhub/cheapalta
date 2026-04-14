import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getAffiliateLink } from "@/lib/affiliate";

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "wishlists"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const wishlistItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(wishlistItems);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "wishlists");
    });

    return () => unsubscribe();
  }, [user]);

  const removeItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "wishlists", id));
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Please sign in to view your wishlist</h2>
        <p className="text-muted-foreground">Save your favorite alternatives and track prices.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20">Loading your wishlist...</div>;
  }

  return (
    <div className="space-y-8">
      <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-8 w-8 text-primary" /> My Wishlist
        </h1>
        <p className="text-muted-foreground">You have {items.length} items saved.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl space-y-4">
          <p className="text-xl text-muted-foreground">Your wishlist is empty.</p>
          <Link to="/">
            <Button>Start Searching</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{item.productName}</CardTitle>
                  <CardDescription className="text-primary font-bold">{item.price}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Platform: {item.platform}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1" asChild>
                    <a href={getAffiliateLink(item.link)} target="_blank" rel="noopener noreferrer">
                      Buy Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
