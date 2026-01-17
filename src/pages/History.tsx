import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// Mock data for demonstration
const mockHistory = [
  {
    id: "1",
    text: "Scientists discover breakthrough in renewable energy that could power entire cities...",
    verdict: "REAL" as const,
    confidence: 87.5,
    score: 78,
    date: "2026-01-06T10:30:00",
  },
  {
    id: "2",
    text: "BREAKING: Government secretly planning to ban all social media platforms by next month...",
    verdict: "FAKE" as const,
    confidence: 92.3,
    score: 23,
    date: "2026-01-06T09:15:00",
  },
  {
    id: "3",
    text: "New study suggests that moderate exercise can improve cognitive function in elderly adults...",
    verdict: "REAL" as const,
    confidence: 85.1,
    score: 82,
    date: "2026-01-05T16:45:00",
  },
  {
    id: "4",
    text: "Viral video claims to show UFO landing in major city, experts remain skeptical...",
    verdict: "SUSPICIOUS" as const,
    confidence: 71.2,
    score: 52,
    date: "2026-01-05T14:20:00",
  },
  {
    id: "5",
    text: "Tech company announces revolutionary AI that can predict future events with 99% accuracy...",
    verdict: "FAKE" as const,
    confidence: 88.7,
    score: 31,
    date: "2026-01-05T11:00:00",
  },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerdict, setFilterVerdict] = useState<string | null>(null);

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterVerdict || item.verdict === filterVerdict;
    return matchesSearch && matchesFilter;
  });

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "REAL":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "FAKE":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-suspicious" />;
    }
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "REAL":
        return <Badge variant="success">Credible</Badge>;
      case "FAKE":
        return <Badge variant="destructive">Unreliable</Badge>;
      default:
        return <Badge variant="suspicious">Suspicious</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <HistoryIcon className="w-8 h-8 text-primary" />
              Analysis History
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your previous news analyses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export All
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-destructive">
              <Trash2 className="w-4 h-4" />
              Clear History
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card variant="glass" className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search analyses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Button
                  variant={filterVerdict === null ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterVerdict(null)}
                >
                  All
                </Button>
                <Button
                  variant={filterVerdict === "REAL" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterVerdict("REAL")}
                  className="gap-1"
                >
                  <CheckCircle className="w-3 h-3 text-success" />
                  Credible
                </Button>
                <Button
                  variant={filterVerdict === "SUSPICIOUS" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterVerdict("SUSPICIOUS")}
                  className="gap-1"
                >
                  <AlertTriangle className="w-3 h-3 text-suspicious" />
                  Suspicious
                </Button>
                <Button
                  variant={filterVerdict === "FAKE" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setFilterVerdict("FAKE")}
                  className="gap-1"
                >
                  <XCircle className="w-3 h-3 text-destructive" />
                  Unreliable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Analyses", value: mockHistory.length, icon: HistoryIcon },
            { label: "Credible", value: mockHistory.filter((h) => h.verdict === "REAL").length, icon: CheckCircle },
            { label: "Suspicious", value: mockHistory.filter((h) => h.verdict === "SUSPICIOUS").length, icon: AlertTriangle },
            { label: "Unreliable", value: mockHistory.filter((h) => h.verdict === "FAKE").length, icon: XCircle },
          ].map((stat, i) => (
            <Card key={i} variant="glass">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <Card
                key={item.id}
                variant="glass"
                className="hover:border-primary/30 transition-colors fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Verdict Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.verdict === "REAL"
                            ? "bg-success/20"
                            : item.verdict === "FAKE"
                            ? "bg-destructive/20"
                            : "bg-suspicious/20"
                        }`}
                      >
                        {getVerdictIcon(item.verdict)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground/90 line-clamp-2 mb-2">
                        {item.text}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(item.date)}
                        </span>
                        {getVerdictBadge(item.verdict)}
                        <span>
                          Confidence: <span className="text-foreground">{item.confidence.toFixed(1)}%</span>
                        </span>
                        <span>
                          Score: <span className="text-foreground">{item.score}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card variant="glass">
              <CardContent className="p-12 text-center">
                <HistoryIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No analyses found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  {searchQuery || filterVerdict
                    ? "Try adjusting your search or filters"
                    : "Start by analyzing some news content"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
