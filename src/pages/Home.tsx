import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Search, 
  Brain, 
  FileCheck, 
  TrendingUp, 
  Users, 
  ArrowRight,
  Sparkles,
  BarChart3,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced NLP algorithms analyze sentiment, bias, and credibility patterns in real-time.",
    },
    {
      icon: BarChart3,
      title: "Detailed Reports",
      description: "Get comprehensive credibility reports with visual metrics and explanations.",
    },
    {
      icon: AlertTriangle,
      title: "Bias Detection",
      description: "Identify political, emotional, and sensational bias with our Bias Radar.",
    },
    {
      icon: FileCheck,
      title: "Fact Consistency",
      description: "Cross-reference claims against patterns of known misinformation.",
    },
    {
      icon: Users,
      title: "Community Verification",
      description: "Collective intelligence through community voting and feedback.",
    },
    {
      icon: TrendingUp,
      title: "Trust Timeline",
      description: "Track how credibility scores change over time and across sources.",
    },
  ];

  const stats = [
    { value: "99.2%", label: "Detection Accuracy" },
    { value: "50K+", label: "Articles Analyzed" },
    { value: "<2s", label: "Analysis Time" },
    { value: "8", label: "AI Metrics" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="container relative z-10 px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="glass" className="mb-6 px-4 py-2 text-sm fade-in-up">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Fake News Detection
            </Badge>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 fade-in-up delay-100">
              Verify Before You
              <span className="block text-gradient mt-2">Share</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 fade-in-up delay-200">
              Combat misinformation with advanced AI analysis. Get instant credibility reports, 
              bias detection, and fact-checking for any news content.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up delay-300">
              <Link to="/analyzer">
                <Button variant="hero" size="xl" className="gap-2 group">
                  <Search className="w-5 h-5" />
                  Analyze News
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/learn">
                <Button variant="glass" size="xl" className="gap-2">
                  <Brain className="w-5 h-5" />
                  Learn How It Works
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground fade-in-up delay-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Privacy focused</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50 border-y border-border/50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Detection Capabilities
            </h2>
            <p className="text-muted-foreground">
              Our AI analyzes multiple dimensions of news content to provide 
              comprehensive credibility assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i} 
                variant="glass" 
                className="group hover:border-primary/50 transition-all duration-300 fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-card/30">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4">Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to verify any news content
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Submit Content", desc: "Paste news text or article URL" },
              { step: "02", title: "AI Analysis", desc: "Our AI processes multiple credibility metrics" },
              { step: "03", title: "Get Report", desc: "Receive detailed credibility assessment" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4">
          <Card variant="gradient" className="overflow-hidden">
            <CardContent className="p-12 text-center relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 to-accent/10" />
              <div className="relative z-10">
                <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Fight Misinformation?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Join thousands of users who verify news before sharing. 
                  Start analyzing content for free today.
                </p>
                <Link to="/analyzer">
                  <Button variant="hero" size="xl" className="gap-2">
                    <Search className="w-5 h-5" />
                    Start Analyzing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
