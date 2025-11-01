import { Star } from "lucide-react";

interface QualityBadgeProps {
  label: string;
  score: number;
  max?: number;
}

export default function QualityBadge({ label, score, max = 5 }: QualityBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground min-w-[80px]">{label}</span>
      <div className="flex gap-0.5">
        {[...Array(max)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < score ? "fill-warning text-warning" : "fill-muted/30 text-muted/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
