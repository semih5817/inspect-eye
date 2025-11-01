interface Anomaly {
  id: number;
  location: { x: number; y: number };
  contourPoints?: string;
  description: string;
}

interface HeatmapOverlayProps {
  anomalies: Anomaly[];
  width: number;
  height: number;
}

export default function HeatmapOverlay({ anomalies, width, height }: HeatmapOverlayProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {anomalies.map((anomaly) => (
        <g key={anomaly.id}>
          {/* Pulsing circle */}
          <circle
            cx={anomaly.location.x}
            cy={anomaly.location.y}
            r="30"
            fill="hsl(354 85% 55% / 0.2)"
            className="animate-pulse"
          />
          <circle
            cx={anomaly.location.x}
            cy={anomaly.location.y}
            r="20"
            fill="hsl(354 85% 55% / 0.3)"
          />
          
          {/* Contour if available */}
          {anomaly.contourPoints && (
            <polygon
              points={anomaly.contourPoints}
              fill="none"
              stroke="hsl(354 85% 55%)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          )}
          
          {/* Center dot */}
          <circle
            cx={anomaly.location.x}
            cy={anomaly.location.y}
            r="4"
            fill="hsl(354 85% 55%)"
          />
        </g>
      ))}
    </svg>
  );
}
