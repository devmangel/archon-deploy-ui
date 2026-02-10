import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          {/* Status Bar */}
          <div className="flex items-center gap-3 mb-8 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400">SYSTEM ONLINE</span>
            </div>
            <span className="text-zinc-700">|</span>
            <span className="text-zinc-500">ARCHON v1.0.0</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            Deploy Your AI
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Development Team
            </span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mb-12">
            Autonomous 7-agent team. Production-ready in minutes.
            <br />
            Start from scratch or integrate with existing codebases.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/onboarding"
              className="group relative px-8 py-4 bg-emerald-500 text-zinc-950 font-semibold rounded-lg hover:bg-emerald-400 transition-all overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              href="/onboarding"
              className="px-8 py-4 border-2 border-zinc-700 font-semibold rounded-lg hover:border-emerald-500 hover:text-emerald-400 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="7 Specialized Agents"
            description="Frontend, Backend, Database, DevOps, QA, Documentation, Tech Lead"
            icon="🤖"
          />
          <FeatureCard
            title="Full Integration"
            description="GitHub, Linear, Slack — seamless workflow automation"
            icon="🔗"
          />
          <FeatureCard
            title="Mission Control"
            description="Real-time dashboard. Monitor, adjust, and deploy with confidence"
            icon="📡"
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem label="Deploy Time" value="< 5min" />
            <StatItem label="Agents Active" value="7" />
            <StatItem label="Integrations" value="3+" />
            <StatItem label="Uptime" value="99.9%" />
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="group p-6 border border-zinc-800 rounded-lg hover:border-emerald-500/50 transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-emerald-400 font-mono">{value}</div>
      <div className="text-sm text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
