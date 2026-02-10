import Link from 'next/link';
import { ReactNode } from 'react';

interface WizardLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  currentStep?: number;
  totalSteps?: number;
  showSteps?: boolean;
}

export default function WizardLayout({
  children,
  title,
  description,
  currentStep,
  totalSteps,
  showSteps = true,
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
            ARCHON
          </Link>
          <div className="flex items-center gap-4 text-sm font-mono">
            <span className="text-zinc-500">ONBOARDING</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      {showSteps && currentStep && totalSteps && (
        <div className="border-b border-zinc-800 bg-zinc-900/30">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-mono text-xs transition-all ${
                      idx + 1 < currentStep
                        ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500'
                        : idx + 1 === currentStep
                        ? 'bg-emerald-500 text-zinc-950 border-2 border-emerald-400'
                        : 'bg-zinc-800 text-zinc-500 border-2 border-zinc-700'
                    }`}
                  >
                    {idx + 1 < currentStep ? '✓' : idx + 1}
                  </div>
                  {idx < totalSteps - 1 && (
                    <div
                      className={`w-12 sm:w-16 h-0.5 mx-1 transition-all ${
                        idx + 1 < currentStep ? 'bg-emerald-500' : 'bg-zinc-800'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title & Description */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-zinc-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>

        {/* Main Content */}
        {children}
      </div>

      {/* Grid Background Effect */}
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
    </div>
  );
}
