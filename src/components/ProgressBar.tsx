interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'emerald' | 'blue' | 'amber' | 'red';
}

export default function ProgressBar({
  value,
  max,
  label,
  showPercentage = true,
  color = 'emerald',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));
  
  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2 text-sm">
          {label && <span className="text-zinc-400">{label}</span>}
          {showPercentage && (
            <span className="font-mono font-semibold">{percentage}%</span>
          )}
        </div>
      )}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
