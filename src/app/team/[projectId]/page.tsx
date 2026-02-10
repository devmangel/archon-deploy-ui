'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AgentCard from '@/components/AgentCard';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function TeamAssembly({ params }: PageProps) {
  const { projectId } = use(params);
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      const data = await response.json();
      setProject(data);
      setAgents(data.agents || []);
      
      // Pre-select all existing agents
      const existingAgentIds = new Set(data.agents?.map((a: any) => a.id) || []);
      setSelectedAgents(existingAgentIds);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch project:', error);
      setLoading(false);
    }
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(agentId)) {
        next.delete(agentId);
      } else {
        next.add(agentId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      // Update agent selections
      await fetch(`/api/projects/${projectId}/agents`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentIds: Array.from(selectedAgents),
        }),
      });

      // Navigate back or to deployment
      router.push(`/deploy/review/${project.deployments?.[0]?.id || projectId}`);
    } catch (error) {
      console.error('Failed to update agents:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading team configuration...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
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

  const availableAgentTypes = [
    { type: 'frontend', name: 'Frontend Engineer', description: 'React, UI/UX, responsive design' },
    { type: 'backend', name: 'Backend Engineer', description: 'APIs, business logic, databases' },
    { type: 'database', name: 'Database Specialist', description: 'Schema design, migrations, optimization' },
    { type: 'devops', name: 'DevOps Engineer', description: 'CI/CD, infrastructure, deployment' },
    { type: 'qa', name: 'QA Engineer', description: 'Testing, E2E, quality assurance' },
    { type: 'docs', name: 'Documentation Writer', description: 'User guides, API docs, in-app help' },
    { type: 'techlead', name: 'Tech Lead', description: 'Architecture, coordination, oversight' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-emerald-400">
            ARCHON
          </Link>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-zinc-500">TEAM ASSEMBLY</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">Assemble Your Team</h1>
          <p className="text-xl text-zinc-400">
            Select the agents you want for <span className="text-emerald-400">{project.name}</span>
          </p>
        </div>

        {/* Current Team */}
        {agents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Current Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="relative">
                  <AgentCard agent={agent} />
                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className={`absolute top-4 right-4 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedAgents.has(agent.id)
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-zinc-700 bg-zinc-900'
                    }`}
                  >
                    {selectedAgents.has(agent.id) && (
                      <svg
                        className="w-4 h-4 text-zinc-950"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Agents (if needed to add more) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Available Agent Types</h2>
          <p className="text-zinc-400 mb-6">
            All recommended agent types for comprehensive project coverage
          </p>
          <div className="space-y-4">
            {availableAgentTypes.map((agentType) => {
              const existingAgent = agents.find((a) => a.type === agentType.type);
              const isSelected = existingAgent ? selectedAgents.has(existingAgent.id) : false;
              
              return (
                <div
                  key={agentType.type}
                  className={`p-6 border rounded-lg transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/5'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{agentType.name}</h3>
                      <p className="text-sm text-zinc-400">{agentType.description}</p>
                      {existingAgent && (
                        <p className="text-xs text-emerald-400 mt-2">
                          ✓ Already added to your team
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-zinc-700'
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-4 h-4 text-zinc-950"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Summary */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Team Summary</h3>
              <p className="text-sm text-zinc-400">
                {selectedAgents.size} agent{selectedAgents.size !== 1 ? 's' : ''} selected
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-400">{selectedAgents.size}</div>
              <div className="text-xs text-zinc-500">Active Members</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Link
            href={`/mission-control/${project.deployments?.[0]?.id || projectId}`}
            className="px-6 py-3 border border-zinc-700 rounded-lg font-semibold hover:border-zinc-500 transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={selectedAgents.size === 0}
            className="px-8 py-3 bg-emerald-500 text-zinc-950 rounded-lg font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
