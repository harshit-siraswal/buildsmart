import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Chrome, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth-context";
import { toast } from "@/components/ui/sonner";

type Mode = "login" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, loginWithGoogle } = useAuth();

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  const submit = async () => {
    if (!email.trim() || !password.trim() || (mode === "signup" && !name.trim())) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      if (mode === "signup") {
        await signup({ name, email, password });
        toast.success("Account created successfully.");
      } else {
        await login(email, password);
        toast.success("Welcome back.");
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast.success("Signed in with Google.");
      navigate(redirectTo, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="flex items-center justify-between px-6 py-5 border-b border-border/60">
        <Link to="/" className="inline-flex">
          <BrandLogo textClassName="font-heading text-base font-bold" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-xl"
        >
          <Card className="border-border bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-heading">
                {mode === "login" ? "Login to BuildSmart" : "Create your account"}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "Continue to your dashboard and project workspace."
                  : "Start planning projects with AI-assisted estimates."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button onClick={submit} className="w-full" disabled={loading}>
                {loading ? <Loader2 size={16} className="mr-2 animate-spin" /> : null}
                {mode === "login" ? "Login" : "Sign up"}
              </Button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading}>
                <Chrome size={16} className="mr-2" /> Continue with Google
              </Button>

              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "No account yet?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-primary hover:underline"
                >
                  {mode === "login" ? "Sign up" : "Login"}
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
