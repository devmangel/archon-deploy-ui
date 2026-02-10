'use client';

import { Agent } from '@prisma/client';

interface AgentCardProps {
  agent: Agent & {
    _count?: {
      tasks: number;
    };
  };
  onClick?: () => void;
}

const agentIcons: Record<string, string> = {
  frontend: '🎨',
  backend: '⚙️',
  database: '🗄️',
  devops: '🚀',
  qa: '✅',
  docs: '📝',
  techlead: '👨‍💼',
};

const agentDescriptions: Record<string, string> = {
  frontend: 'React, UI/UX, responsive design',
  backend: 'APIs, business logic, databases',
  database: 'Schema design, migrations, optimization',
  devops: 'CI/CD, infrastructure, deployment',
  qa: 'Testing, E2E, quality assurance',
  docs: 'User guides, API docs, in-app help',
  techlead: 'Architecture, coordination, oversight',
};

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500';
      case 'busy':
        return 'bg-amber-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      case 'offline':
        return 'bg-zinc-700';
      default:
        return 'bg-zinc-600';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div
      onClick={onClick}
      className={`p-6 border border-zinc-800 rounded-lg bg-zinc-900/50 transition-all hover:border-zinc-700 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{agentIcons[agent.type] || '🤖'}</div>
          <div>
            <h3 className="text-lg font-semibold">{agent.name}</h3>
            <p className="text-sm text-zinc-400">
              {agentDescriptions[agent.type] || agent.type}
            </p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-zinc-500">Status:</span>
            <span className="ml-2 font-mono text-zinc-300">
              {getStatusText(agent.status)}
            </span>
          </div>
          <div>
            <span className="text-zinc-500">Tasks:</span>
            <span className="ml-2 font-mono text-emerald-400">
              {agent.tasksActive}/{agent.tasksCompleted}
            </span>
          </div>
        </div>
        {agent.lastActiveAt && (
          <div className="text-xs text-zinc-500">
            Last active: {new Date(agent.lastActiveAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
