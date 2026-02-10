interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: string;
}

export default function MetricCard({
  icon,
  label,
  value,
  trend,
  color = 'emerald',
}: MetricCardProps) {
  return (
    <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/30">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {trend && (
          <div
            className={`text-xs font-mono ${
              trend.positive ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {trend.positive ? '↗' : '↘'} {trend.value}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-zinc-400">{label}</div>
    </div>
  );
}
