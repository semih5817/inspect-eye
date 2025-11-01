import { AlertCircle, AlertTriangle, XCircle } from "lucide-react";

interface Issue {
  id: number;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  location: { x: number; y: number };
}

interface IssueCardProps {
  issue: Issue;
  thumbnail?: string;
}

export default function IssueCard({ issue, thumbnail }: IssueCardProps) {
  const severityConfig = {
    low: {
      bg: "bg-warning/10",
      text: "text-warning",
      icon: AlertCircle,
      label: "Légère",
    },
    medium: {
      bg: "bg-primary/10",
      text: "text-primary",
      icon: AlertTriangle,
      label: "Moyenne",
    },
    high: {
      bg: "bg-destructive/10",
      text: "text-destructive",
      icon: XCircle,
      label: "Importante",
    },
  };

  const config = severityConfig[issue.severity];
  const Icon = config.icon;

  return (
    <div className="p-3 glass rounded-lg border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-start gap-3">
        {thumbnail && (
          <div className="relative flex-shrink-0">
            <img
              src={thumbnail}
              alt={issue.description}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm mb-1">{issue.description}</p>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.text} flex items-center gap-1`}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
