import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/components/ui/sonner";

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [company, setCompany] = useState(user?.company ?? "");
  const [role, setRole] = useState(user?.role ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");

  const save = () => {
    updateProfile({ name, company, role, bio });
    toast.success("Profile updated");
  };

  const signOut = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-5 border-b border-border/60">
        <Link to="/" className="inline-flex">
          <BrandLogo textClassName="font-heading text-base font-bold" />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" variant="outline" onClick={signOut}>
            <LogOut size={15} className="mr-1" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </Button>
          <p className="text-xs text-muted-foreground">Signed in via {user.provider}</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Profile</CardTitle>
              <CardDescription>Manage your account details and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-name">Full name</Label>
                  <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-email">Email</Label>
                  <Input id="profile-email" value={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-company">Company</Label>
                  <Input id="profile-company" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile-role">Role</Label>
                  <Input id="profile-role" value={role} onChange={(e) => setRole(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-bio">Bio</Label>
                <Textarea
                  id="profile-bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your work in construction planning..."
                />
              </div>

              <Button onClick={save}>
                <Save size={15} className="mr-2" /> Save Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
