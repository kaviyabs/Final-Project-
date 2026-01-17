import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Link, 
  Search, 
  Loader2, 
  AlertCircle,
  Type,
  Globe
} from "lucide-react";
import { countWords, detectLanguage, isGibberish } from "@/lib/aiAnalysis";
import { useToast } from "@/hooks/use-toast";

interface NewsInputFormProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const NewsInputForm = ({ onAnalyze, isLoading }: NewsInputFormProps) => {
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const { toast } = useToast();

  const wordCount = countWords(textInput);
  const language = textInput.length > 20 ? detectLanguage(textInput) : "—";
  const hasGibberish = textInput.length > 20 && isGibberish(textInput);

  const handleSubmit = () => {
    const text = inputType === "text" ? textInput : urlInput;
    
    if (inputType === "text") {
      if (text.trim().length < 20) {
        toast({
          title: "Text too short",
          description: "Please enter at least 20 characters of news content to analyze.",
          variant: "destructive",
        });
        return;
      }

      if (hasGibberish) {
        toast({
          title: "Invalid content detected",
          description: "The text appears to contain spam or gibberish. Please enter valid news content.",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!urlInput.match(/^https?:\/\/.+/)) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL starting with http:// or https://",
          variant: "destructive",
        });
        return;
      }

      // For URL input, simulate fetched content (in production, this would fetch the actual article)
      toast({
        title: "URL Analysis",
        description: "URL scraping requires backend integration. For now, please paste the article text directly.",
      });
      return;
    }

    onAnalyze(text);
  };

  return (
    <Card variant="glass" className="w-full">
      <CardContent className="p-6">
        <Tabs value={inputType} onValueChange={(v) => setInputType(v as "text" | "url")}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="gap-2">
              <FileText className="w-4 h-4" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-4 h-4" />
              Article URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Paste the news article or content you want to analyze...

Example: 'Scientists discover that drinking coffee every day can increase your lifespan by 20 years, according to a study published in Nature. The research, which analyzed data from over 1 million participants...'"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[200px] resize-none pr-4"
              />
              
              {/* Stats overlay */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                {hasGibberish && (
                  <Badge variant="destructive" className="text-xs gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Invalid content
                  </Badge>
                )}
              </div>
            </div>

            {/* Text stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Type className="w-4 h-4" />
                <span>{wordCount} words</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                <span>{language}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={wordCount < 10 ? "text-destructive" : wordCount < 50 ? "text-warning" : "text-success"}>
                  {wordCount < 10 ? "Too short" : wordCount < 50 ? "Short" : "Good length"}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="relative">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://example.com/news-article"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the URL of the news article you want to analyze. Our AI will extract and analyze the content.
            </p>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || (inputType === "text" ? textInput.trim().length < 20 : !urlInput)}
          className="w-full mt-6"
          variant="hero"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Analyze Credibility
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsInputForm;
