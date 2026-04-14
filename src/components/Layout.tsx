import { Link, Outlet } from "react-router-dom";
import { Search, Heart, User, Moon, Sun, Menu, X, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/components/auth-provider";
import { signInWithGoogle, logout, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import AdminQuickAccess from "@/components/AdminQuickAccess";

export default function Layout() {
  const { theme, setTheme } = useTheme();
  const { user, profile } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const isAdmin = profile?.role === "admin" || user?.email === "ahfahimsylhet@gmail.com";

  useEffect(() => {
    // Visitor counter logic
    const countVisitor = async () => {
      const statsRef = doc(db, "stats", "global");
      try {
        await updateDoc(statsRef, {
          visitors: increment(1)
        });
      } catch (e) {
        // If doc doesn't exist, create it
        await setDoc(statsRef, { visitors: 1, totalEarnings: 0 }, { merge: true });
      }
    };
    
    // Only count once per session
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      countVisitor();
      sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully!");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Login popup was closed. Please try again and keep the window open.");
      } else if (error.code === "auth/cancelled-by-user") {
        toast.error("Login was cancelled.");
      } else {
        toast.error(`Sign in failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully!");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-1 text-2xl font-extrabold tracking-[-0.04em]">
            <span className="text-foreground">CHEAP</span>
            <span className="text-accent">ALTA</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold uppercase tracking-wider">
            <Link to="/" className="transition-colors hover:text-primary text-muted-foreground">Dashboard</Link>
            <Link to="/wishlist" className="transition-colors hover:text-primary text-muted-foreground">Wishlist</Link>
            <Link to="/about" className="transition-colors hover:text-primary text-muted-foreground">About</Link>
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-80 transition-opacity">
                  <Avatar className="h-9 w-9 border-2 border-background shadow-sm">
                    <AvatarImage src={user.photoURL || ""} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="font-bold text-primary">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" onClick={handleLogin} disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </div>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> Sign In
                  </>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background md:hidden pt-20"
          >
            <nav className="flex flex-col items-center space-y-8 p-4 text-xl font-semibold">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CHEAPALTA. Find smarter. Buy cheaper.</p>
        </div>
      </footer>

      <AdminQuickAccess />
    </div>
  );
}
