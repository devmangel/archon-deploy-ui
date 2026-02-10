'use client';

import ProgressBar from './ProgressBar';

interface DeploymentProgressProps {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  failedTasks: number;
}

export default function DeploymentProgress({
  totalTasks,
  completedTasks,
  activeTasks,
  failedTasks,
}: DeploymentProgressProps) {
  const pendingTasks = totalTasks - completedTasks - activeTasks - failedTasks;
  
  return (
    <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/30">
      <h3 className="text-xl font-bold mb-6">Deployment Progress</h3>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <ProgressBar
          value={completedTasks}
          max={totalTasks}
          label="Overall Progress"
        />
      </div>

      {/* Task Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-400">{completedTasks}</div>
          <div className="text-sm text-zinc-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-400">{activeTasks}</div>
          <div className="text-sm text-zinc-500">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-zinc-500">{pendingTasks}</div>
          <div className="text-sm text-zinc-500">Pending</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-red-400">{failedTasks}</div>
          <div className="text-sm text-zinc-500">Failed</div>
        </div>
      </div>

      {/* Status Bars */}
      <div className="mt-6 space-y-3">
        {completedTasks > 0 && (
          <ProgressBar
            value={completedTasks}
            max={totalTasks}
            label="Completed"
            showPercentage={false}
            color="emerald"
          />
        )}
        {activeTasks > 0 && (
          <ProgressBar
            value={activeTasks}
            max={totalTasks}
            label="Active"
            showPercentage={false}
            color="amber"
          />
        )}
        {failedTasks > 0 && (
          <ProgressBar
            value={failedTasks}
            max={totalTasks}
            label="Failed"
            showPercentage={false}
            color="red"
          />
        )}
      </div>
    </div>
  );
}
