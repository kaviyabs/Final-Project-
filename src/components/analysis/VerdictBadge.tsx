import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface VerdictBadgeProps {
  verdict: "REAL" | "FAKE" | "SUSPICIOUS";
  size?: "sm" | "md" | "lg";
}

const VerdictBadge = ({ verdict, size = "md" }: VerdictBadgeProps) => {
  const config = {
    REAL: {
      variant: "success" as const,
      icon: CheckCircle,
      label: "Credible",
      glow: "glow-success",
    },
    SUSPICIOUS: {
      variant: "suspicious" as const,
      icon: AlertTriangle,
      label: "Suspicious",
      glow: "",
    },
    FAKE: {
      variant: "destructive" as const,
      icon: XCircle,
      label: "Unreliable",
      glow: "glow-danger",
    },
  };

  const { variant, icon: Icon, label, glow } = config[verdict];

  const sizes = {
    sm: "text-sm px-3 py-1",
    md: "text-lg px-5 py-2",
    lg: "text-2xl px-8 py-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <Badge 
      variant={variant} 
      className={`${sizes[size]} ${glow} flex items-center gap-2 font-bold`}
    >
      <Icon className={iconSizes[size]} />
      {label}
    </Badge>
  );
};

export default VerdictBadge;
