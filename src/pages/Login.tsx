import * as React from "react"
import { useState } from "react";
import { signInWithGoogle, signUpWithEmail, loginWithEmail } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ShieldCheck, AlertCircle, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

export default function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Login popup was closed. Please try again.");
      } else {
        toast.error(`Sign in failed: ${error.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      if (mode === "signup") {
        if (!name) throw new Error("Please enter your name");
        await signUpWithEmail(email, password, name);
        toast.success("Account created! Please check your email for verification.");
      } else {
        await loginWithEmail(email, password);
        toast.success("Signed in successfully!");
      }
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-[3rem] border-primary/20 shadow-2xl overflow-hidden bg-card/50 backdrop-blur-xl">
          <div className="h-2 bg-primary" />
          <CardHeader className="text-center space-y-4 pt-10 pb-6">
            <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black tracking-tight">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription>
                {mode === "login" 
                  ? "Sign in to access your wishlist and admin tools." 
                  : "Join CHEAPALTA to start saving on your favorite brands."}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            <div className="flex p-1 bg-muted rounded-2xl mb-6">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${mode === "login" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${mode === "signup" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10 rounded-xl h-11"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={mode === "signup"}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 rounded-xl h-11"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 rounded-xl h-11"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full h-12 rounded-xl font-bold gap-2"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Processing..." : (mode === "login" ? "Sign In" : "Create Account")}
                {!isLoggingIn && <ArrowRight className="h-4 w-4" />}
              </Button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-bold">Or continue with</span>
              </div>
            </div>

            <Button 
              variant="outline"
              className="w-full h-12 rounded-xl font-bold gap-3 border-primary/20 hover:bg-primary/5"
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.54 6.16-4.54z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>

            <div className="bg-muted/30 p-4 rounded-2xl flex gap-3 items-start">
              <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-wider font-bold">
                Verification required for new accounts. Please check your inbox after signing up.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
