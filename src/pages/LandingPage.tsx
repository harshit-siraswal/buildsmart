import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Brain, Clock, DollarSign, Layers, Shield, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLogo } from "@/components/BrandLogo";

const features = [
  { icon: Brain, title: "AI-Powered Estimates", desc: "Get instant, accurate cost breakdowns powered by machine learning trained on thousands of projects." },
  { icon: DollarSign, title: "Cost Optimization", desc: "Identify savings opportunities with intelligent material and labor cost analysis." },
  { icon: Users, title: "Resource Planning", desc: "Optimize workforce allocation, materials procurement, and equipment scheduling." },
  { icon: Clock, title: "Timeline Generation", desc: "Auto-generate Gantt charts with critical path analysis and milestone tracking." },
  { icon: Shield, title: "Risk Assessment", desc: "Proactive risk identification with contingency planning built into every estimate." },
  { icon: Layers, title: "Multi-Project View", desc: "Manage multiple projects simultaneously with a unified dashboard." },
];

const stats = [
  { value: "95%", label: "Estimation Accuracy" },
  { value: "3x", label: "Faster Planning" },
  { value: "40%", label: "Cost Savings Found" },
  { value: "10K+", label: "Projects Analyzed" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <BrandLogo textClassName="font-heading text-xl font-bold text-foreground" />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#stats" className="hover:text-foreground transition">Results</a>
            <a href="#cta" className="hover:text-foreground transition">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/auth")}>
              Sign in
            </Button>
            <Button size="sm" onClick={() => navigate("/auth")} className="gap-1.5">
              Start free trial <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-sm text-muted-foreground mb-8">
            <Zap size={14} className="text-accent" />
            AI-powered construction intelligence
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-bold leading-[1.1] tracking-tight mb-6">
            The smartest way to
            <br />
            <span className="text-primary">plan & estimate</span>
            <br />
            construction projects.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            BuildSmart AI combines machine learning with construction expertise to deliver 
            instant cost estimates, resource plans, and project timelines — all from a single input.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/dashboard")} className="text-base px-8 gap-2 shadow-glow">
              Start Building <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8">
              View demo
            </Button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative max-w-5xl mx-auto mt-16"
        >
          <div className="rounded-xl border border-border bg-card p-1.5 shadow-2xl shadow-primary/5">
            <div className="rounded-lg bg-secondary/50 border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">BuildSmart AI — Dashboard</div>
              </div>
              <div className="p-6 grid grid-cols-3 gap-4">
                <DemoCard title="Total Cost" value="₹2.61 Cr" change="+3.2%" />
                <DemoCard title="Timeline" value="24 Weeks" change="On track" positive />
                <DemoCard title="Resources" value="35 Active" change="87% utilized" positive />
              </div>
              <div className="px-6 pb-6">
                <div className="h-32 rounded-lg bg-background/50 border border-border/30 flex items-center justify-center">
                  <BarChart3 size={48} className="text-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-6 border-y border-border/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Everything you need to plan smarter
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From initial estimates to project handover — one intelligent platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group rounded-xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to build smarter?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of construction professionals using AI to deliver projects on time and under budget.
          </p>
          <Button size="lg" onClick={() => navigate("/dashboard")} className="text-base px-10 gap-2 shadow-glow">
            Get Started Free <ArrowRight size={18} />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <BrandLogo textClassName="font-heading font-semibold text-foreground" />
          <span>© 2025 BuildSmart AI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function DemoCard({ title, value, change, positive }: { title: string; value: string; change: string; positive?: boolean }) {
  return (
    <div className="rounded-lg bg-background/50 border border-border/30 p-4">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <p className="text-xl font-heading font-bold">{value}</p>
      <p className={`text-xs mt-1 ${positive ? "text-success" : "text-accent"}`}>{change}</p>
    </div>
  );
}
