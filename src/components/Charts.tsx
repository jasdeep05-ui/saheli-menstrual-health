// Simple, accessible bar chart and sparkline components (no external deps)

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  maxValue?: number;
  height?: number;
  unit?: string;
}

export function BarChart({ data, maxValue, height = 120, unit }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map(d => d.value), 1);
  const hasData = data.some(d => d.value > 0);

  if (!hasData) {
    return (
      <p className="py-8 text-center text-sm text-plum-300">No data to display yet</p>
    );
  }

  return (
    <div className="flex items-end justify-between gap-2" style={{ height }} role="img" aria-label="Bar chart">
      {data.map((d, i) => {
        const barHeight = max > 0 ? (d.value / max) * (height - 24) : 0;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-plum-500">
              {d.value}{unit}
            </span>
            <div
              className="w-full max-w-[40px] rounded-t-lg transition-all duration-300"
              style={{
                height: Math.max(barHeight, 2),
                backgroundColor: d.color || '#FF8B73',
              }}
            />
            <span className="text-[10px] text-plum-400 truncate max-w-full" title={d.label}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({ data, color = '#E85538', height = 40, width = 100 }: SparklineProps) {
  if (data.length < 2) return null;

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible" role="img" aria-label="Trend line">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = i * step;
        const y = height - ((v - min) / range) * height;
        return <circle key={i} cx={x} cy={y} r="2" fill={color} />;
      })}
    </svg>
  );
}

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  label?: string;
  color?: string;
}

export function ProgressRing({ value, max, size = 80, label, color = '#FF8B73' }: ProgressRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? Math.min(value / max, 1) : 0;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F5E8DC"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-semibold text-plum-700">{value}</span>
        {label && <span className="text-[10px] text-plum-400">{label}</span>}
      </div>
    </div>
  );
}
