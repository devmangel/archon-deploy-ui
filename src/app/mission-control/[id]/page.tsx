'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import AgentCard from '@/components/AgentCard';
import StatusBadge from '@/components/StatusBadge';
import LogViewer from '@/components/LogViewer';
import TaskList from '@/components/TaskList';
import MetricCard from '@/components/MetricCard';
import DeploymentProgress from '@/components/DeploymentProgress';
import useWebSocket from '@/hooks/useWebSocket';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MissionControl({ params }: PageProps) {
  const { id } = use(params);
  const [deployment, setDeployment] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'agents' | 'tasks' | 'logs'>(
    'overview'
  );

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket({
    url: `ws://localhost:3000/api/ws/${id}`,
    onMessage: (data) => {
      console.log('[Mission Control] Received update:', data);
      // Update deployment data based on WebSocket message
      if (data.type === 'deployment_update') {
        setDeployment((prev: any) => ({ ...prev, ...data.payload }));
      } else if (data.type === 'agent_update') {
        setDeployment((prev: any) => ({
          ...prev,
          project: {
            ...prev.project,
            agents: prev.project.agents.map((a: any) =>
              a.id === data.payload.id ? { ...a, ...data.payload } : a
            ),
          },
        }));
      } else if (data.type === 'log') {
        setDeployment((prev: any) => ({
          ...prev,
          logs: [data.payload, ...(prev.logs || [])].slice(0, 50),
        }));
      }
    },
    onConnect: () => {
      console.log('[Mission Control] WebSocket connected');
    },
    onDisconnect: () => {
      console.log('[Mission Control] WebSocket disconnected');
    },
  });

  useEffect(() => {
    fetchDeployment();
    // Poll for updates every 10 seconds as fallback
    const interval = setInterval(fetchDeployment, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchDeployment = async () => {
    try {
      const response = await fetch(`/api/deploy?id=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch deployment');
      }
      const data = await response.json();
      setDeployment(data.deployment);
      setMetrics(data.metrics);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading mission control...</p>
        </div>
      </div>
    );
  }

  if (error || !deployment) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Deployment Not Found</h2>
          <p className="text-zinc-400 mb-6">{error || 'Unable to load deployment'}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-emerald-500 text-zinc-950 rounded-lg font-semibold hover:bg-emerald-400 transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const project = deployment.project;
  const agents = project?.agents || [];
  const tasks = deployment.tasks || [];
  const logs = deployment.logs || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-emerald-400">
                ARCHON
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div>
                <h1 className="text-xl font-bold">{project?.name || 'Unnamed Project'}</h1>
                <p className="text-sm text-zinc-400">Mission Control Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'
                  }`}
                />
                <span className="text-zinc-400">
                  {isConnected ? 'Live' : 'Connecting...'}
                </span>
              </div>
              <StatusBadge status={deployment.status} />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-900/30 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 min-w-max">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'agents', label: 'Agents', icon: '🤖' },
              { id: 'tasks', label: 'Tasks', icon: '📋' },
              { id: 'logs', label: 'Logs', icon: '📝' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`px-4 md:px-6 py-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                  selectedView === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {selectedView === 'overview' && (
          <OverviewView
            deployment={deployment}
            metrics={metrics}
            agents={agents}
            tasks={tasks}
            logs={logs}
          />
        )}
        {selectedView === 'agents' && <AgentsView agents={agents} />}
        {selectedView === 'tasks' && <TasksView tasks={tasks} />}
        {selectedView === 'logs' && <LogsView logs={logs} />}
      </div>
    </div>
  );
}

function OverviewView({ deployment, metrics, agents, tasks, logs }: any) {
  const activeAgents = agents.filter((a: any) => a.status === 'active').length;
  const activeTasks = tasks.filter((t: any) => t.status === 'in_progress').length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const failedTasks = tasks.filter((t: any) => t.status === 'failed').length;

  return (
    <div className="space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard icon="⏱️" label="System Uptime" value={metrics?.uptime || 'N/A'} />
        <MetricCard
          icon="✅"
          label="Tasks Completed"
          value={completedTasks}
          trend={{ value: '+12%', positive: true }}
        />
        <MetricCard
          icon="🔧"
          label="Active Agents"
          value={`${activeAgents}/${agents.length}`}
        />
        <MetricCard icon="⚡" label="Active Tasks" value={activeTasks} />
      </div>

      {/* Deployment Progress */}
      {tasks.length > 0 && (
        <DeploymentProgress
          totalTasks={tasks.length}
          completedTasks={completedTasks}
          activeTasks={activeTasks}
          failedTasks={failedTasks}
        />
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🤖</span> Agent Status
          </h2>
          <div className="space-y-3">
            {agents.slice(0, 4).map((agent: any) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
          {agents.length > 4 && (
            <button className="mt-4 w-full py-3 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
              View All Agents ({agents.length})
            </button>
          )}
        </div>

        {/* Recent Tasks */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>📋</span> Recent Tasks
          </h2>
          <TaskList tasks={tasks.slice(0, 5)} maxHeight="max-h-[600px]" />
          {tasks.length > 5 && (
            <button className="mt-4 w-full py-3 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
              View All Tasks ({tasks.length})
            </button>
          )}
        </div>
      </div>

      {/* Activity Logs */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>📝</span> Activity Stream
        </h2>
        <LogViewer logs={logs} height="h-64" />
      </div>
    </div>
  );
}

function AgentsView({ agents }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Agent Team</h2>
        <p className="text-zinc-400">
          Monitor and manage your autonomous development team
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent: any) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

function TasksView({ tasks }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">All Tasks</h2>
        <p className="text-zinc-400">Complete task breakdown and status</p>
      </div>
      <TaskList tasks={tasks} maxHeight="max-h-[800px]" />
    </div>
  );
}

function LogsView({ logs }: any) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2">Activity Logs</h2>
        <p className="text-zinc-400">
          Real-time activity stream from all agents and systems
        </p>
      </div>
      <LogViewer logs={logs} height="h-[600px]" autoScroll={false} />
    </div>
  );
}
