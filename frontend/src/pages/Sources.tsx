import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Globe, Search, Shield, AlertTriangle, ExternalLink } from "lucide-react";

const Sources = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await fetch("http://localhost:8000/sources");
        if (response.ok) {
          const data = await response.json();
          setSources(data);
        }
      } catch (error) {
        console.error("Failed to fetch sources", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSources();
  }, []);

  const filteredSources = sources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
              <Globe className="w-8 h-8 text-primary" />
              News Source Credibility
            </h1>
            <p className="text-muted-foreground">
              Explore our database of news organizations and their verified credibility scores.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search news sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Sources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse bg-secondary/20 h-32" />
              ))
            ) : filteredSources.length > 0 ? (
              filteredSources.map((source) => (
                <Card key={source.id} variant="glass" className="hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">{source.name}</CardTitle>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(source.credibility_score)}`}>
                          {source.credibility_score}%
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {source.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={source.credibility_score >= 70 ? "success" : source.credibility_score >= 40 ? "warning" : "destructive"}>
                        {source.credibility_score >= 70 ? "Reliable" : source.credibility_score >= 40 ? "Caution" : "Unreliable"}
                      </Badge>
                      <button className="text-xs text-primary hover:underline flex items-center gap-1">
                        View Details <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No sources found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sources;
