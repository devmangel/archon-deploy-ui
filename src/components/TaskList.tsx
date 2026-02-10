'use client';

import { Task, Agent } from '@prisma/client';
import StatusBadge from './StatusBadge';

interface TaskWithAgent extends Task {
  agent?: Agent | null;
}

interface TaskListProps {
  tasks: TaskWithAgent[];
  maxHeight?: string;
}

export default function TaskList({ tasks, maxHeight = 'max-h-96' }: TaskListProps) {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'text-red-500';
      case 2:
        return 'text-orange-500';
      case 3:
        return 'text-blue-500';
      case 4:
        return 'text-zinc-500';
      default:
        return 'text-zinc-400';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return 'URGENT';
      case 2:
        return 'HIGH';
      case 3:
        return 'NORMAL';
      case 4:
        return 'LOW';
      default:
        return 'UNKNOWN';
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-zinc-600 py-12">
        No tasks assigned yet
      </div>
    );
  }

  return (
    <div className={`${maxHeight} overflow-y-auto space-y-3`}>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-zinc-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <StatusBadge status={task.status} size="sm" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              {task.agent && (
                <span className="text-zinc-500">
                  👤 <span className="text-zinc-300">{task.agent.name}</span>
                </span>
              )}
              <span className={`font-mono ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>
            {task.externalUrl && (
              <a
                href={task.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                View →
              </a>
            )}
          </div>

          {task.startedAt && (
            <div className="mt-2 pt-2 border-t border-zinc-800 text-xs text-zinc-500">
              Started: {new Date(task.startedAt).toLocaleString()}
              {task.completedAt && (
                <span className="ml-3">
                  Completed: {new Date(task.completedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
