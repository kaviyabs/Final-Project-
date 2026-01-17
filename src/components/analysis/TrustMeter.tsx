import { useEffect, useState } from "react";

interface TrustMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const TrustMeter = ({ score, size = "md", showLabel = true }: TrustMeterProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = () => {
    if (score >= 70) return "text-success";
    if (score >= 45) return "text-suspicious";
    return "text-destructive";
  };

  const getGradient = () => {
    if (score >= 70) return "from-success to-emerald-400";
    if (score >= 45) return "from-suspicious to-amber-400";
    return "from-destructive to-red-400";
  };

  const getLabel = () => {
    if (score >= 70) return "Credible";
    if (score >= 45) return "Verify";
    return "Unreliable";
  };

  const sizes = {
    sm: { circle: 80, stroke: 6, text: "text-lg", labelText: "text-xs" },
    md: { circle: 120, stroke: 8, text: "text-2xl", labelText: "text-sm" },
    lg: { circle: 160, stroke: 10, text: "text-4xl", labelText: "text-base" },
  };

  const { circle, stroke, text, labelText } = sizes[size];
  const radius = (circle - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: circle, height: circle }}>
        {/* Background circle */}
        <svg className="transform -rotate-90" width={circle} height={circle}>
          <circle
            cx={circle / 2}
            cy={circle / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={circle / 2}
            cy={circle / 2}
            r={radius}
            fill="none"
            stroke="url(#meterGradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`${getGradient().split(" ")[0].replace("from-", "stop-")}`} />
              <stop offset="100%" className={`${getGradient().split(" ")[1].replace("to-", "stop-")}`} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${text} ${getColor()}`}>
            {Math.round(animatedScore)}
          </span>
          {showLabel && (
            <span className={`${labelText} text-muted-foreground`}>{getLabel()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustMeter;
