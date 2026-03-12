import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  AlertTriangle, 
  MousePointer, 
  Shield, 
  Scale, 
  FileCheck, 
  Pen, 
  Fingerprint,
  Lightbulb,
  Shuffle,
  Download,
  Share2
} from "lucide-react";
import { AnalysisResult } from "@/lib/aiAnalysis";
import TrustMeter from "./TrustMeter";
import BiasRadar from "./BiasRadar";
import MetricCard from "./MetricCard";
import VerdictBadge from "./VerdictBadge";

interface CredibilityReportProps {
  result: AnalysisResult;
  originalText: string;
}

const CredibilityReport = ({ result, originalText }: CredibilityReportProps) => {
  const metricIcons = {
    sentimentPolarity: Heart,
    emotionalManipulation: AlertTriangle,
    clickbaitProbability: MousePointer,
    sourceCredibility: Shield,
    keywordBias: Scale,
    factConsistency: FileCheck,
    writingTone: Pen,
    fakePatternMatch: Fingerprint,
  };

  const getMetricDetails = (key: string) => {
    const metric = result.metrics[key as keyof typeof result.metrics];
    if ("triggers" in metric) return metric.triggers;
    if ("indicators" in metric) return metric.indicators;
    if ("factors" in metric) return metric.factors;
    if ("biasedTerms" in metric) return metric.biasedTerms;
    if ("issues" in metric) return metric.issues;
    if ("characteristics" in metric) return metric.characteristics;
    if ("patterns" in metric) return metric.patterns;
    if ("details" in metric) return metric.details;
    return "";
  };

  return (
    <div className="space-y-6 fade-in-up">
      {/* Main Verdict Section */}
      <Card variant="gradient" className="overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <CardContent className="relative p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Trust Meter */}
            <div className="flex flex-col items-center">
              <TrustMeter score={result.overallScore} size="lg" />
              <p className="text-sm text-muted-foreground mt-2">Trust Score</p>
            </div>

            {/* Verdict Info */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex flex-col lg:flex-row items-center gap-4">
                <VerdictBadge verdict={result.verdict} size="lg" />
                <Badge variant="glass" className="text-sm">
                  {result.confidence.toFixed(1)}% Confidence
                </Badge>
              </div>
              
              <p className="text-lg text-foreground/90 max-w-2xl">
                {result.explanation}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Button variant="glass" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-primary" />
          Analysis Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(result.metrics).map(([key, value], index) => (
            <MetricCard
              key={key}
              title={key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              score={value.score}
              icon={metricIcons[key as keyof typeof metricIcons]}
              details={getMetricDetails(key)}
              delay={index * 100}
            />
          ))}
        </div>
      </div>

      {/* Bias Radar & Misleading Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bias Radar */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="w-5 h-5 text-primary" />
              Bias Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BiasRadar data={result.biasRadar} />
          </CardContent>
        </Card>

        {/* Misleading Sentences */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Flagged Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.misleadingSentences.length > 0 ? (
              result.misleadingSentences.map((sentence, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm"
                >
                  <p className="text-foreground/80 italic">"{sentence}"</p>
                </div>
              ))
            ) : (
              <div className="p-4 rounded-lg bg-success/10 border border-success/30 text-center">
                <p className="text-success">No misleading content detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendation */}
      <Card variant="elevated" className={`border-l-4 ${
        result.verdict === "REAL" ? "border-l-success" :
        result.verdict === "SUSPICIOUS" ? "border-l-warning" : "border-l-destructive"
      }`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${
              result.verdict === "REAL" ? "bg-success/20" :
              result.verdict === "SUSPICIOUS" ? "bg-warning/20" : "bg-destructive/20"
            }`}>
              <Lightbulb className={`w-6 h-6 ${
                result.verdict === "REAL" ? "text-success" :
                result.verdict === "SUSPICIOUS" ? "text-warning" : "text-destructive"
              }`} />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Recommendation</h4>
              <p className="text-muted-foreground">{result.recommendation}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fake News Mutation Simulator */}
      {result.mutatedVersions.length > 0 && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shuffle className="w-5 h-5 text-primary" />
              Fake News Mutation Simulator
              <Badge variant="glass" className="ml-2">Educational</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              See how legitimate content could be manipulated into misinformation
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.mutatedVersions.map((mutation, i) => (
              <div 
                key={i}
                className="p-4 rounded-lg bg-destructive/5 border border-destructive/20"
              >
                <Badge variant="destructive" className="mb-2 text-xs">
                  Mutation {i + 1}
                </Badge>
                <p className="text-sm text-foreground/80">{mutation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Explainability Panel */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Fingerprint className="w-5 h-5 text-primary" />
            AI Explainability Panel
            <Badge variant="glass" className="ml-2">Academic</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Analysis Method</h5>
              <p className="text-xs text-muted-foreground">
                Natural Language Processing (NLP) combined with pattern recognition, 
                sentiment analysis, and source credibility evaluation.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Scoring Algorithm</h5>
              <p className="text-xs text-muted-foreground">
                Weighted average of 8 metrics: Sentiment (10%), Emotional Manipulation (15%), 
                Clickbait (15%), Source Credibility (20%), Bias (10%), Fact Consistency (15%), 
                Writing Tone (5%), Pattern Matching (10%).
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Verdict Thresholds</h5>
              <p className="text-xs text-muted-foreground">
                Score ≥70: Credible | Score 45-69: Suspicious | Score &lt;45: Unreliable
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Confidence Calculation</h5>
              <p className="text-xs text-muted-foreground">
                Based on metric score variance analysis. Higher consistency across 
                metrics increases confidence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredibilityReport;
