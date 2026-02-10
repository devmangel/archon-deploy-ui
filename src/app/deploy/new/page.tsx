'use client';

import { useState } from 'react';
import Link from 'next/link';

type Step = 'project' | 'agents' | 'integrations' | 'review';

export default function NewDeployment() {
  const [step, setStep] = useState<Step>('project');
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    techStack: [] as string[],
    agents: {
      frontend: true,
      backend: true,
      database: true,
      devops: true,
      qa: true,
      docs: true,
      techlead: true,
    },
    integrations: {
      github: { enabled: false, repo: '', token: '' },
      linear: { enabled: false, workspace: '', apiKey: '' },
      slack: { enabled: false, webhook: '' },
    },
  });

  const steps: Step[] = ['project', 'agents', 'integrations', 'review'];
  const currentStepIndex = steps.indexOf(step);

  const nextStep = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleDeploy = async () => {
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'new', config: formData }),
      });
      const result = await response.json();
      console.log('Deployment initiated:', result);
      // TODO: Redirect to mission control dashboard
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-emerald-400">
            ARCHON
          </Link>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-zinc-500">NEW DEPLOYMENT</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            {steps.map((s, idx) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-sm ${
                    idx <= currentStepIndex
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`text-sm uppercase ${
                    idx <= currentStepIndex ? 'text-zinc-100' : 'text-zinc-600'
                  }`}
                >
                  {s}
                </span>
                {idx < steps.length - 1 && (
                  <div className="w-12 h-px bg-zinc-800 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        {step === 'project' && (
          <ProjectStep formData={formData} setFormData={setFormData} />
        )}
        {step === 'agents' && (
          <AgentsStep formData={formData} setFormData={setFormData} />
        )}
        {step === 'integrations' && (
          <IntegrationsStep formData={formData} setFormData={setFormData} />
        )}
        {step === 'review' && <ReviewStep formData={formData} />}

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-8 border-t border-zinc-800">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="px-6 py-3 border border-zinc-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:border-zinc-500 transition-colors"
          >
            Back
          </button>
          {currentStepIndex < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-emerald-500 text-zinc-950 rounded-lg font-semibold hover:bg-emerald-400 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleDeploy}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-zinc-950 rounded-lg font-bold hover:from-emerald-400 hover:to-cyan-400 transition-all"
            >
              Deploy Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectStep({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const techOptions = ['React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Python', 'Go', 'Rust'];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Project Details</h2>
      <p className="text-zinc-400 mb-8">Define the foundation of your new project.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Project Name</label>
          <input
            type="text"
            value={formData.projectName}
            onChange={(e) =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            placeholder="my-awesome-app"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="What are you building?"
            rows={4}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Tech Stack</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {techOptions.map((tech) => (
              <button
                key={tech}
                onClick={() => {
                  const newStack = formData.techStack.includes(tech)
                    ? formData.techStack.filter((t: string) => t !== tech)
                    : [...formData.techStack, tech];
                  setFormData({ ...formData, techStack: newStack });
                }}
                className={`px-4 py-2 border rounded-lg font-mono text-sm transition-all ${
                  formData.techStack.includes(tech)
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentsStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  const agents = [
    { key: 'frontend', name: 'Frontend Engineer', description: 'React, UI/UX, responsive design' },
    { key: 'backend', name: 'Backend Engineer', description: 'APIs, business logic, databases' },
    { key: 'database', name: 'Database Specialist', description: 'Schema design, migrations, optimization' },
    { key: 'devops', name: 'DevOps Engineer', description: 'CI/CD, infrastructure, deployment' },
    { key: 'qa', name: 'QA Engineer', description: 'Testing, E2E, quality assurance' },
    { key: 'docs', name: 'Documentation Writer', description: 'User guides, API docs, in-app help' },
    { key: 'techlead', name: 'Tech Lead', description: 'Architecture, coordination, oversight' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Agent Configuration</h2>
      <p className="text-zinc-400 mb-8">
        Select which agents to deploy. All are recommended for full coverage.
      </p>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.key}
            className={`p-6 border rounded-lg transition-all cursor-pointer ${
              formData.agents[agent.key]
                ? 'border-emerald-500 bg-emerald-500/5'
                : 'border-zinc-800 hover:border-zinc-700'
            }`}
            onClick={() =>
              setFormData({
                ...formData,
                agents: {
                  ...formData.agents,
                  [agent.key]: !formData.agents[agent.key],
                },
              })
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{agent.name}</h3>
                <p className="text-sm text-zinc-400">{agent.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  formData.agents[agent.key]
                    ? 'border-emerald-500 bg-emerald-500'
                    : 'border-zinc-700'
                }`}
              >
                {formData.agents[agent.key] && (
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
        ))}
      </div>
    </div>
  );
}

function IntegrationsStep({ formData, setFormData }: { formData: any; setFormData: any }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Integrations</h2>
      <p className="text-zinc-400 mb-8">
        Connect your tools. You can configure these later.
      </p>

      <div className="space-y-6">
        {/* GitHub */}
        <IntegrationCard
          title="GitHub"
          description="Repository hosting, PR automation"
          enabled={formData.integrations.github.enabled}
          onToggle={() =>
            setFormData({
              ...formData,
              integrations: {
                ...formData.integrations,
                github: {
                  ...formData.integrations.github,
                  enabled: !formData.integrations.github.enabled,
                },
              },
            })
          }
        >
          {formData.integrations.github.enabled && (
            <div className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Repository (e.g., username/repo)"
                value={formData.integrations.github.repo}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    integrations: {
                      ...formData.integrations,
                      github: { ...formData.integrations.github, repo: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="password"
                placeholder="Personal Access Token"
                value={formData.integrations.github.token}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    integrations: {
                      ...formData.integrations,
                      github: { ...formData.integrations.github, token: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </IntegrationCard>

        {/* Linear */}
        <IntegrationCard
          title="Linear"
          description="Issue tracking, project management"
          enabled={formData.integrations.linear.enabled}
          onToggle={() =>
            setFormData({
              ...formData,
              integrations: {
                ...formData.integrations,
                linear: {
                  ...formData.integrations.linear,
                  enabled: !formData.integrations.linear.enabled,
                },
              },
            })
          }
        >
          {formData.integrations.linear.enabled && (
            <div className="space-y-4 mt-4">
              <input
                type="text"
                placeholder="Workspace"
                value={formData.integrations.linear.workspace}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    integrations: {
                      ...formData.integrations,
                      linear: { ...formData.integrations.linear, workspace: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="password"
                placeholder="API Key"
                value={formData.integrations.linear.apiKey}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    integrations: {
                      ...formData.integrations,
                      linear: { ...formData.integrations.linear, apiKey: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </IntegrationCard>

        {/* Slack */}
        <IntegrationCard
          title="Slack"
          description="Team notifications, status updates"
          enabled={formData.integrations.slack.enabled}
          onToggle={() =>
            setFormData({
              ...formData,
              integrations: {
                ...formData.integrations,
                slack: {
                  ...formData.integrations.slack,
                  enabled: !formData.integrations.slack.enabled,
                },
              },
            })
          }
        >
          {formData.integrations.slack.enabled && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Webhook URL"
                value={formData.integrations.slack.webhook}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    integrations: {
                      ...formData.integrations,
                      slack: { ...formData.integrations.slack, webhook: e.target.value },
                    },
                  })
                }
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </IntegrationCard>
      </div>
    </div>
  );
}

function IntegrationCard({
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`p-6 border rounded-lg transition-all ${
        enabled ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <button
          onClick={onToggle}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            enabled
              ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          {enabled ? 'Enabled' : 'Enable'}
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewStep({ formData }: { formData: any }) {
  const activeAgents = Object.entries(formData.agents)
    .filter(([_, enabled]) => enabled)
    .length;
  const activeIntegrations = Object.entries(formData.integrations)
    .filter(([_, config]: any) => config.enabled)
    .length;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Review & Deploy</h2>
      <p className="text-zinc-400 mb-8">
        Confirm your configuration before deployment.
      </p>

      <div className="space-y-6">
        <div className="p-6 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Project</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">Name</span>
              <span className="font-mono">{formData.projectName || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Tech Stack</span>
              <span className="font-mono">
                {formData.techStack.length > 0
                  ? formData.techStack.join(', ')
                  : 'None selected'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Agents</h3>
          <div className="text-sm">
            <span className="text-zinc-400">Active: </span>
            <span className="font-mono text-emerald-400">{activeAgents} / 7</span>
          </div>
        </div>

        <div className="p-6 border border-zinc-800 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Integrations</h3>
          <div className="text-sm">
            <span className="text-zinc-400">Connected: </span>
            <span className="font-mono text-emerald-400">{activeIntegrations}</span>
          </div>
        </div>

        <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
          <p className="text-sm text-emerald-400">
            ✓ Configuration validated. Ready for deployment.
          </p>
        </div>
      </div>
    </div>
  );
}
