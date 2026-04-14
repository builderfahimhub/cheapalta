import * as React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { db, handleFirestoreError, OperationType } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, DollarSign, Wallet, Landmark, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<"crypto" | "bank">("crypto");
  const [withdrawDetails, setWithdrawDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = profile?.role === "admin" || user?.email === "ahfahimsylhet@gmail.com";

  useEffect(() => {
    if (!isAdmin) return;

    // Listen to stats
    const statsUnsubscribe = onSnapshot(doc(db, "stats", "global"), (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.data());
      } else {
        // Initialize stats if not exists
        setDoc(doc(db, "stats", "global"), {
          visitors: 0,
          totalEarnings: 0,
          lastUpdated: serverTimestamp()
        });
      }
    });

    // Listen to withdrawals
    const q = query(collection(db, "withdrawals"));
    const withdrawalsUnsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWithdrawals(list.sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds));
    });

    return () => {
      statsUnsubscribe();
      withdrawalsUnsubscribe();
    };
  }, [isAdmin]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !isAdmin) return;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > (stats?.totalEarnings || 0)) {
      toast.error("Insufficient balance");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "withdrawals"), {
        uid: user.uid,
        amount,
        method: withdrawMethod,
        details: withdrawDetails,
        status: "pending",
        createdAt: serverTimestamp()
      });

      // Deduct from earnings (optional, or just track separately)
      await updateDoc(doc(db, "stats", "global"), {
        totalEarnings: increment(-amount)
      });

      toast.success("Withdrawal request submitted!");
      setWithdrawAmount("");
      setWithdrawDetails("");
    } catch (error) {
      toast.error("Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <div className="p-8 text-center">Verifying admin access...</div>;
  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your earnings and track performance.</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-primary/20 rounded-[2rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Total Visitors</CardDescription>
            <CardTitle className="text-4xl font-black">{stats?.visitors || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-accent font-bold">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-primary/20 rounded-[2rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Available Balance</CardDescription>
            <CardTitle className="text-4xl font-black text-accent">${(stats?.totalEarnings || 0).toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-primary font-bold">
              <Clock className="h-3 w-3 mr-1" />
              <span>Next payout in 2 days</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900 to-slate-950 border-primary/20 rounded-[2rem] overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight className="h-24 w-24" />
          </div>
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Total Withdrawn</CardDescription>
            <CardTitle className="text-4xl font-black">$0.00</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground font-bold">
              <span>No recent withdrawals</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="withdraw" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-muted/50 p-1 rounded-full">
          <TabsTrigger value="withdraw" className="rounded-full">Withdraw Funds</TabsTrigger>
          <TabsTrigger value="history" className="rounded-full">History</TabsTrigger>
        </TabsList>

        <TabsContent value="withdraw" className="mt-8">
          <Card className="max-w-2xl mx-auto rounded-[2.5rem] border-border/50 overflow-hidden">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Request Withdrawal</CardTitle>
              <CardDescription>Choose your preferred method and enter details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    type="button"
                    variant={withdrawMethod === "crypto" ? "default" : "outline"}
                    className="h-20 flex-col gap-2 rounded-2xl"
                    onClick={() => setWithdrawMethod("crypto")}
                  >
                    <Wallet className="h-6 w-6" />
                    Crypto (USDT/BTC)
                  </Button>
                  <Button 
                    type="button"
                    variant={withdrawMethod === "bank" ? "default" : "outline"}
                    className="h-20 flex-col gap-2 rounded-2xl"
                    onClick={() => setWithdrawMethod("bank")}
                  >
                    <Landmark className="h-6 w-6" />
                    Bank Transfer
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount to Withdraw ($)</label>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="h-12 text-lg font-bold rounded-xl"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    {withdrawMethod === "crypto" ? "Wallet Address (Network)" : "Bank Details (IBAN/Swift)"}
                  </label>
                  <Input 
                    placeholder={withdrawMethod === "crypto" ? "0x... (ERC20)" : "Bank Name, Account Number..."} 
                    className="h-12 rounded-xl"
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    required
                  />
                </div>

                <Button className="w-full h-14 text-lg font-bold rounded-2xl" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : "Submit Withdrawal Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-8">
          <Card className="rounded-[2.5rem] border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Method</th>
                      <th className="p-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-muted-foreground">No withdrawal history yet.</td>
                      </tr>
                    ) : (
                      withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-6 text-sm">
                            {w.createdAt?.toDate().toLocaleDateString()}
                          </td>
                          <td className="p-6 font-bold text-lg">
                            ${w.amount.toFixed(2)}
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2 text-xs font-medium capitalize">
                              {w.method === "crypto" ? <Wallet className="h-3 w-3" /> : <Landmark className="h-3 w-3" />}
                              {w.method}
                            </div>
                          </td>
                          <td className="p-6">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              w.status === "completed" ? "bg-green-500/10 text-green-500" :
                              w.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                              "bg-red-500/10 text-red-500"
                            }`}>
                              {w.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                              {w.status === "pending" && <Clock className="h-3 w-3" />}
                              {w.status === "rejected" && <XCircle className="h-3 w-3" />}
                              {w.status}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
