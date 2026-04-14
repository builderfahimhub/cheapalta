import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Shield, LayoutDashboard, Settings, LogOut, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { logout } from "@/lib/firebase";
import { toast } from "sonner";

export default function AdminQuickAccess() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = profile?.role === "admin" || user?.email === "ahfahimsylhet@gmail.com";

  if (!isAdmin && user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 bg-slate-950 border border-primary/30 rounded-[2rem] p-4 shadow-2xl min-w-[220px] space-y-2"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 px-2">
              {user ? "Admin Quick Access" : "Guest Access"}
            </p>
            
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl hover:bg-primary/10"
                  onClick={() => { navigate("/admin"); setIsOpen(false); }}
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl hover:bg-primary/10"
                  onClick={() => { navigate("/profile"); setIsOpen(false); }}
                >
                  <Settings className="mr-2 h-4 w-4" /> Profile
                </Button>
                <div className="h-px bg-white/10 my-2" />
                <Button 
                  variant="ghost" 
                  className="w-full justify-start rounded-xl text-destructive hover:bg-destructive/10"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <Button 
                className="w-full rounded-xl font-bold"
                onClick={() => { navigate("/login"); setIsOpen(false); }}
              >
                <LogIn className="mr-2 h-4 w-4" /> Go to Login Page
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className={`h-14 w-14 rounded-full shadow-2xl border-4 border-background transition-all duration-300 ${
          isOpen ? 'bg-slate-900 scale-110' : 'bg-primary hover:scale-105'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {user ? (
          <Shield className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        ) : (
          <LogIn className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
