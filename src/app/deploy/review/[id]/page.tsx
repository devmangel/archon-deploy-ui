'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DeployReview({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [deployment, setDeployment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [launching, setLaunching] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    fetchDeployment();
  }, [id]);

  const fetchDeployment = async () => {
    try {
      const response = await fetch(`/api/deploy?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch deployment');
      const data = await response.json();
      setDeployment(data.deployment);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch deployment:', error);
      setLoading(false);
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);
    
    // Countdown animation
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Update deployment status to active
    try {
      await fetch(`/api/deployments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      });

      // Redirect to mission control
      router.push(`/mission-control/${id}`);
    } catch (error) {
      console.error('Launch failed:', error);
      setLaunching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading deployment details...</p>
        </div>
      </div>
    );
  }

  if (!deployment) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-zinc-100">Deployment Not Found</h2>
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
  const integrations = project?.integrations || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-emerald-400">
            ARCHON
          </Link>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-zinc-500">FINAL REVIEW</span>
            <StatusBadge status={deployment.status} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {launching ? (
          <LaunchAnimation countdown={countdown} />
        ) : (
          <>
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🚀</div>
              <h1 className="text-4xl font-bold mb-3">Ready for Launch</h1>
              <p className="text-xl text-zinc-400">
                Review your configuration before deploying the team
              </p>
            </div>

            {/* Configuration Review */}
            <div className="space-y-6 mb-12">
              {/* Project Details */}
              <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/30">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>📦</span> Project
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Name</span>
                    <span className="font-mono text-lg">{project.name}</span>
                  </div>
                  {project.description && (
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-400">Description</span>
                      <span className="text-right max-w-md">{project.description}</span>
                    </div>
                  )}
                  {project.techStack && (
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Tech Stack</span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {JSON.parse(project.techStack).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded-full text-sm font-mono"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Mode</span>
                    <span className="font-mono uppercase text-emerald-400">{project.mode}</span>
                  </div>
                </div>
              </div>

              {/* Agents */}
              <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/30">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>🤖</span> Agent Team
                  <span className="text-lg text-zinc-500">({agents.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {agents.map((agent: any) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <div className="font-semibold">{agent.name}</div>
                        <div className="text-xs text-zinc-400">{agent.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrations */}
              {integrations.length > 0 && (
                <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/30">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span>🔌</span> Integrations
                    <span className="text-lg text-zinc-500">({integrations.length})</span>
                  </h2>
                  <div className="space-y-3">
                    {integrations.map((integration: any) => (
                      <div
                        key={integration.id}
                        className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <div>
                            <div className="font-semibold">{integration.name}</div>
                            <div className="text-xs text-zinc-400">{integration.type}</div>
                          </div>
                        </div>
                        <StatusBadge status={integration.status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Deployment Info */}
              <div className="p-6 border border-zinc-800 rounded-lg bg-zinc-900/30">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>⚙️</span> Deployment
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Environment</span>
                    <span className="font-mono uppercase">{deployment.environment}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Status</span>
                    <StatusBadge status={deployment.status} size="sm" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Created</span>
                    <span className="text-sm">
                      {new Date(deployment.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-Launch Checklist */}
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/50 rounded-lg mb-8">
              <h3 className="font-bold text-emerald-400 mb-3">✓ Pre-Flight Checklist</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Project configuration validated</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{agents.length} agents initialized and ready</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>{integrations.length} integrations connected</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Deployment environment configured</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Mission Control dashboard ready</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Link
                href={`/deploy/new`}
                className="px-6 py-3 border border-zinc-700 rounded-lg font-semibold hover:border-zinc-500 transition-colors"
              >
                ← Back to Configuration
              </Link>
              <button
                onClick={handleLaunch}
                className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 rounded-lg font-bold text-lg hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-lg shadow-emerald-500/50 hover:shadow-emerald-400/50"
              >
                🚀 Launch Deployment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LaunchAnimation({ countdown }: { countdown: number }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-9xl font-bold mb-8 animate-pulse">{countdown}</div>
      <div className="text-3xl font-bold mb-4">Launching Deployment...</div>
      <div className="flex gap-2 mb-8">
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <p className="text-zinc-400">Initializing agents and establishing connections...</p>
    </div>
  );
}
