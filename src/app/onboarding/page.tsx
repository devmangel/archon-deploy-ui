'use client';

import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/onboarding-context';
import WizardLayout from '@/components/onboarding/WizardLayout';

export default function OnboardingModePage() {
  const router = useRouter();
  const { setMode } = useOnboarding();

  const handleModeSelection = (mode: 'start-from-zero' | 'existing-codebase') => {
    setMode(mode);
    if (mode === 'start-from-zero') {
      router.push('/onboarding/mission-briefing');
    } else {
      router.push('/onboarding/repo-connect');
    }
  };

  return (
    <WizardLayout
      title="Choose Your Path"
      description="How would you like to begin your Archon deployment?"
      showSteps={false}
    >
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Start from Zero Option */}
        <ModeCard
          icon="🚀"
          title="Start from Zero"
          description="Define your project vision and let Archon's AI team build it from scratch."
          features={[
            'AI-generated architecture',
            'Full codebase scaffolding',
            'Best practices built-in',
            'Zero to production in hours',
          ]}
          onClick={() => handleModeSelection('start-from-zero')}
          highlight
        />

        {/* Existing Codebase Option */}
        <ModeCard
          icon="🔗"
          title="Existing Codebase"
          description="Connect your GitHub repository and enhance it with Archon's autonomous development team."
          features={[
            'Analyze existing code',
            'Seamless integration',
            'Maintain your architecture',
            'Accelerate development',
          ]}
          onClick={() => handleModeSelection('existing-codebase')}
        />
      </div>

      {/* Feature Comparison */}
      <div className="mt-16 p-8 border border-zinc-800 rounded-lg bg-zinc-900/30">
        <h3 className="text-xl font-bold mb-6 text-center">Both Modes Include</h3>
        <div className="grid sm:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🤖</div>
            <h4 className="font-semibold mb-1">7 AI Agents</h4>
            <p className="text-sm text-zinc-400">Specialized autonomous team</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-semibold mb-1">Full Integration</h4>
            <p className="text-sm text-zinc-400">GitHub, Linear, Slack</p>
          </div>
          <div>
            <div className="text-3xl mb-2">📊</div>
            <h4 className="font-semibold mb-1">Mission Control</h4>
            <p className="text-sm text-zinc-400">Real-time monitoring</p>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
}

interface ModeCardProps {
  icon: string;
  title: string;
  description: string;
  features: string[];
  onClick: () => void;
  highlight?: boolean;
}

function ModeCard({ icon, title, description, features, onClick, highlight }: ModeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative p-8 border-2 rounded-xl transition-all text-left
        hover:scale-[1.02] active:scale-[0.98]
        ${
          highlight
            ? 'border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10'
            : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'
        }`}
    >
      {/* Highlight Badge */}
      {highlight && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-zinc-950 text-xs font-bold rounded-full">
          RECOMMENDED
        </div>
      )}

      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Title & Description */}
      <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-400 mb-6 leading-relaxed">{description}</p>

      {/* Features List */}
      <ul className="space-y-2 mb-6">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <span className="text-emerald-500 mt-0.5">✓</span>
            <span className="text-zinc-300">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className={`inline-flex items-center gap-2 font-semibold text-sm ${
        highlight ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-300'
      }`}>
        <span>Get Started</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </div>
    </button>
  );
}
