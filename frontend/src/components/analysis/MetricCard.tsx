import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  details: string | string[];
  delay?: number;
}

const MetricCard = ({ title, score, icon: Icon, details, delay = 0 }: MetricCardProps) => {
  const getScoreColor = () => {
    if (score >= 70) return "bg-success";
    if (score >= 45) return "bg-suspicious";
    return "bg-destructive";
  };

  const getTextColor = () => {
    if (score >= 70) return "text-success";
    if (score >= 45) return "text-suspicious";
    return "text-destructive";
  };

  return (
    <Card 
      variant="glass" 
      className="fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-secondary/80">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-sm">{title}</span>
          </div>
          <span className={`font-bold text-lg ${getTextColor()}`}>
            {score}%
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="meter-track mb-3">
          <div 
            className={`meter-fill ${getScoreColor()}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Details */}
        <div className="text-xs text-muted-foreground">
          {Array.isArray(details) ? (
            details.length > 0 ? (
              <ul className="space-y-1">
                {details.slice(0, 2).map((item, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-success">No issues detected</span>
            )
          ) : (
            <p>{details}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
