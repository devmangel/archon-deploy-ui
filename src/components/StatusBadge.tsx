interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'initializing':
        return { color: 'bg-blue-500', text: 'Initializing', pulse: true };
      case 'active':
      case 'running':
        return { color: 'bg-emerald-500', text: 'Active', pulse: true };
      case 'completed':
      case 'done':
        return { color: 'bg-emerald-600', text: 'Completed', pulse: false };
      case 'failed':
      case 'error':
        return { color: 'bg-red-500', text: 'Failed', pulse: false };
      case 'pending':
        return { color: 'bg-zinc-600', text: 'Pending', pulse: false };
      case 'in_progress':
        return { color: 'bg-amber-500', text: 'In Progress', pulse: true };
      case 'blocked':
        return { color: 'bg-orange-500', text: 'Blocked', pulse: false };
      case 'idle':
        return { color: 'bg-zinc-600', text: 'Idle', pulse: false };
      case 'busy':
        return { color: 'bg-purple-500', text: 'Busy', pulse: true };
      default:
        return { color: 'bg-zinc-600', text: status, pulse: false };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 ${sizeClasses[size]} ${config.color} bg-opacity-20 border border-current rounded-full font-mono font-semibold`}
      style={{ color: config.color.replace('bg-', '').replace('-', '') }}
    >
      <div
        className={`w-2 h-2 rounded-full ${config.color} ${
          config.pulse ? 'animate-pulse' : ''
        }`}
      />
      {config.text}
    </div>
  );
}
