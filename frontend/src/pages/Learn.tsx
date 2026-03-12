import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Brain,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Target,
  Eye,
  MessageSquare,
  Link as LinkIcon,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const Learn = () => {
  const spotFakeNewsTips = [
    {
      icon: Eye,
      title: "Check the Source",
      description: "Verify the credibility of the website or publication. Look for established news organizations with editorial standards.",
    },
    {
      icon: MessageSquare,
      title: "Analyze the Language",
      description: "Be wary of sensational headlines, excessive punctuation, or emotionally charged language designed to provoke reactions.",
    },
    {
      icon: LinkIcon,
      title: "Verify with Multiple Sources",
      description: "Cross-reference the story with other reputable news outlets. If only one source is reporting it, be skeptical.",
    },
    {
      icon: Clock,
      title: "Check the Date",
      description: "Old stories are sometimes recirculated as new. Verify the publication date and context.",
    },
    {
      icon: Users,
      title: "Consider the Author",
      description: "Research the author's credentials and track record. Anonymous or fake author names are red flags.",
    },
    {
      icon: Target,
      title: "Question the Intent",
      description: "Consider why this content was created. Is it to inform, persuade, sell something, or provoke?",
    },
  ];

  const redFlags = [
    "ALL CAPS headlines or excessive exclamation marks!!!",
    "Claims that 'they' don't want you to know something",
    "Emotional manipulation (fear, anger, outrage)",
    "No citations or sources for claims",
    "Vague attributions like 'experts say' or 'studies show'",
    "Conspiracy theories or unverifiable claims",
    "Request to share urgently before it gets 'deleted'",
    "Too good to be true claims",
  ];

  const greenFlags = [
    "Clear author attribution with credentials",
    "Citations to primary sources and studies",
    "Balanced presentation of multiple viewpoints",
    "Neutral, professional tone",
    "Correction policies and updates noted",
    "Contact information for newsroom",
    "Separation of news from opinion/editorial",
    "Fact-checking partnerships noted",
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="glass" className="mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Educational Resource
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Fact-Check Learning Center
          </h1>
          <p className="text-muted-foreground">
            Learn how to identify misinformation and become a more critical consumer of news.
            These skills are essential in today's digital information landscape.
          </p>
        </div>

        {/* How Our AI Works */}
        <Card variant="gradient" className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              How Our AI Detects Fake News
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Our AI system uses Natural Language Processing (NLP) to analyze multiple dimensions 
              of news content. Here's what we examine:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  metric: "Sentiment Polarity",
                  weight: "10%",
                  desc: "Detects emotional language patterns like fear, anger, and exaggeration.",
                },
                {
                  metric: "Emotional Manipulation",
                  weight: "15%",
                  desc: "Identifies trigger words designed to provoke emotional responses.",
                },
                {
                  metric: "Clickbait Probability",
                  weight: "15%",
                  desc: "Recognizes sensational patterns common in misleading headlines.",
                },
                {
                  metric: "Source Credibility",
                  weight: "20%",
                  desc: "Evaluates citation quality and source attribution.",
                },
                {
                  metric: "Keyword Bias",
                  weight: "10%",
                  desc: "Detects political, sensational, or loaded language.",
                },
                {
                  metric: "Fact Consistency",
                  weight: "15%",
                  desc: "Checks for logical contradictions and unverifiable claims.",
                },
                {
                  metric: "Writing Tone",
                  weight: "5%",
                  desc: "Analyzes overall writing style for propaganda markers.",
                },
                {
                  metric: "Pattern Matching",
                  weight: "10%",
                  desc: "Compares against known fake news patterns and structures.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-secondary/40 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.metric}</span>
                    <Badge variant="glass">{item.weight}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How to Spot Fake News</h2>
            <p className="text-muted-foreground">
              Develop your critical thinking skills with these expert tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spotFakeNewsTips.map((tip, i) => (
              <Card
                key={i}
                variant="glass"
                className="fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <tip.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Red Flags vs Green Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Red Flags */}
          <Card variant="glass" className="border-l-4 border-l-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                Red Flags to Watch For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Green Flags */}
          <Card variant="glass" className="border-l-4 border-l-success">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                Signs of Credible Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {greenFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-foreground/80">{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quiz CTA */}
        <Card variant="gradient" className="text-center">
          <CardContent className="p-12">
            <Lightbulb className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">
              Ready to Test Your Knowledge?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Put your new skills to the test by analyzing real news content 
              with our AI-powered credibility checker.
            </p>
            <Link to="/analyzer">
              <Button variant="hero" size="lg" className="gap-2">
                Start Analyzing
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Learn;
