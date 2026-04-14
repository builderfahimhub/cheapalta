import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, Shield, Settings, LogOut, Heart, MessageSquare, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { logout, auth } from "@/lib/firebase";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };

  const handleResendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  if (loading) return <div className="p-20 text-center">Loading profile...</div>;

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Please sign in to view your profile</h2>
        <Button onClick={() => navigate("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {!user.emailVerified && user.providerData[0]?.providerId === "password" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <p className="text-sm font-medium text-amber-200">Your email is not verified. Please check your inbox.</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl border-amber-500/50 text-amber-500 hover:bg-amber-500/10" onClick={handleResendVerification}>
            Resend Email
          </Button>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Column: Profile Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/3 space-y-6"
        >
          <Card className="rounded-[2.5rem] border-border/50 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20" />
            <CardContent className="relative pt-0 pb-8 text-center">
              <div className="flex justify-center -mt-12 mb-4">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="text-2xl">{user.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold">{user.displayName}</h2>
              <p className="text-muted-foreground text-sm mb-4">{user.email}</p>
              <Badge variant="secondary" className="rounded-full px-4">
                {profile?.role === "admin" ? "Administrator" : "Member"}
              </Badge>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
                <Link to="/wishlist" className="space-y-1 group">
                  <Heart className="h-5 w-5 mx-auto text-muted-foreground group-hover:text-red-500 transition-colors" />
                  <p className="text-xs font-bold uppercase tracking-wider">Wishlist</p>
                </Link>
                <div className="space-y-1">
                  <MessageSquare className="h-5 w-5 mx-auto text-muted-foreground" />
                  <p className="text-xs font-bold uppercase tracking-wider">Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full rounded-2xl h-12 text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>

        {/* Right Column: Details & Settings */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 space-y-6"
        >
          <Card className="rounded-[2.5rem] border-border/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" /> Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Email Address</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Verified</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Member Since</p>
                      <p className="font-medium">{user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account Security</p>
                      <p className="font-medium">Google Authentication</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-bold mb-4 uppercase tracking-widest text-muted-foreground">Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <div className="h-6 w-10 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Public Profile</span>
                    <div className="h-6 w-10 bg-muted rounded-full relative">
                      <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {profile?.role === "admin" && (
            <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Administrative Access
                </CardTitle>
                <CardDescription>You have full access to the platform analytics and management.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full rounded-xl font-bold" onClick={() => navigate("/admin")}>
                  Go to Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
