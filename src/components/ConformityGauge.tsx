interface ConformityGaugeProps {
  score: number;
  size?: number;
}

export default function ConformityGauge({ score, size = 128 }: ConformityGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={`${getColor()} transition-all duration-1000 ease-out`}
          style={{
            filter: score >= 80 
              ? "drop-shadow(0 0 8px hsl(142 71% 65% / 0.5))"
              : score >= 50
              ? "drop-shadow(0 0 8px hsl(38 92% 58% / 0.5))"
              : "drop-shadow(0 0 8px hsl(0 72% 68% / 0.5))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-bold">{score}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
}
