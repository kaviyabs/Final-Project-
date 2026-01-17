import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Settings,
  Users,
  FileText,
  TrendingUp,
  Download,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data
const mockStats = {
  totalAnalyses: 52847,
  activeUsers: 1234,
  avgCredibilityScore: 62.4,
  fakeNewsDetected: 18293,
};

const recentAnalyses = [
  { id: 1, text: "Scientists announce breakthrough...", verdict: "REAL", time: "2 min ago" },
  { id: 2, text: "BREAKING: Government secretly...", verdict: "FAKE", time: "5 min ago" },
  { id: 3, text: "New study reveals that...", verdict: "SUSPICIOUS", time: "12 min ago" },
  { id: 4, text: "Experts warn about upcoming...", verdict: "REAL", time: "18 min ago" },
  { id: 5, text: "Viral claim suggests that...", verdict: "FAKE", time: "25 min ago" },
];

const Admin = () => {
  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case "REAL":
        return <Badge variant="success" className="text-xs">Credible</Badge>;
      case "FAKE":
        return <Badge variant="destructive" className="text-xs">Unreliable</Badge>;
      default:
        return <Badge variant="suspicious" className="text-xs">Suspicious</Badge>;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor and manage the fake news detection system
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="glass" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button variant="hero" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              This Week
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              title: "Total Analyses",
              value: mockStats.totalAnalyses.toLocaleString(),
              change: "+12.5%",
              trend: "up",
              icon: FileText,
            },
            {
              title: "Active Users",
              value: mockStats.activeUsers.toLocaleString(),
              change: "+8.2%",
              trend: "up",
              icon: Users,
            },
            {
              title: "Avg. Credibility Score",
              value: `${mockStats.avgCredibilityScore}%`,
              change: "-2.1%",
              trend: "down",
              icon: TrendingUp,
            },
            {
              title: "Fake News Detected",
              value: mockStats.fakeNewsDetected.toLocaleString(),
              change: "+15.8%",
              trend: "up",
              icon: AlertTriangle,
            },
          ].map((stat, i) => (
            <Card key={i} variant="glass" className="fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                  )}
                  <span className={stat.trend === "up" ? "text-success" : "text-destructive"}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart Placeholder */}
          <Card variant="glass" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analysis Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-secondary/20 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Chart visualization</p>
                  <p className="text-sm">(Requires backend integration)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verdict Distribution */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                Verdict Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Credible", count: 21834, percentage: 41, color: "bg-success" },
                  { label: "Suspicious", count: 12720, percentage: 24, color: "bg-suspicious" },
                  { label: "Unreliable", count: 18293, percentage: 35, color: "bg-destructive" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="meter-track">
                      <div
                        className={`meter-fill ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Analyses
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search analyses..." className="pl-10 h-9" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        analysis.verdict === "REAL"
                          ? "bg-success/20"
                          : analysis.verdict === "FAKE"
                          ? "bg-destructive/20"
                          : "bg-suspicious/20"
                      }`}
                    >
                      {analysis.verdict === "REAL" ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : analysis.verdict === "FAKE" ? (
                        <XCircle className="w-4 h-4 text-destructive" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-suspicious" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1 max-w-md">
                        {analysis.text}
                      </p>
                      <p className="text-xs text-muted-foreground">{analysis.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getVerdictBadge(analysis.verdict)}
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <Button variant="glass" size="sm">
                Load More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
