import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";
import NewsInputForm from "@/components/analysis/NewsInputForm";
import CredibilityReport from "@/components/analysis/CredibilityReport";
import { analyzeNews, AnalysisResult } from "@/lib/aiAnalysis";
import { useToast } from "@/hooks/use-toast";

const Analyzer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzedText, setAnalyzedText] = useState("");
  const { toast } = useToast();

  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setResult(null);

    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const analysisResult = analyzeNews(text);
      setResult(analysisResult);
      setAnalyzedText(text);
      
      toast({
        title: "Analysis Complete",
        description: `Verdict: ${analysisResult.verdict} (${analysisResult.confidence.toFixed(1)}% confidence)`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Badge variant="glass" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Analysis
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            News Credibility Analyzer
          </h1>
          <p className="text-muted-foreground">
            Paste any news content or article URL to receive a comprehensive 
            AI-generated credibility report with detailed explanations.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-3xl mx-auto mb-12">
          <NewsInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <Search className="absolute inset-0 m-auto w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyzing Content</h3>
              <p className="text-muted-foreground mb-4">
                Our AI is examining multiple credibility factors...
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {[
                  "Sentiment Analysis",
                  "Bias Detection",
                  "Source Verification",
                  "Pattern Matching",
                ].map((step, i) => (
                  <Badge 
                    key={step} 
                    variant="secondary"
                    className="shimmer"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    {step}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="max-w-5xl mx-auto">
            <CredibilityReport result={result} originalText={analyzedText} />
          </div>
        )}

        {/* Empty State */}
        {!result && !isLoading && (
          <div className="max-w-3xl mx-auto text-center text-muted-foreground">
            <div className="glass-panel p-12">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enter news content above to begin analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyzer;
