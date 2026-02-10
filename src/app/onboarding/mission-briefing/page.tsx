'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/onboarding-context';
import WizardLayout from '@/components/onboarding/WizardLayout';
import FormInput from '@/components/onboarding/FormInput';
import FormTextarea from '@/components/onboarding/FormTextarea';
import MultiSelect from '@/components/onboarding/MultiSelect';
import LoadingButton from '@/components/onboarding/LoadingButton';

const TECH_STACK_OPTIONS = [
  'React',
  'Next.js',
  'Vue',
  'Angular',
  'Node.js',
  'Python',
  'Go',
  'Rust',
  'TypeScript',
  'GraphQL',
  'REST API',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Kubernetes',
];

const TIMELINE_OPTIONS = [
  '1-2 weeks',
  '2-4 weeks',
  '1-2 months',
  '3-6 months',
  '6+ months',
];

const TEAM_SIZE_OPTIONS = ['Solo', '2-5 people', '6-10 people', '10+ people'];

interface FormErrors {
  projectName?: string;
  projectDescription?: string;
  techStack?: string;
  features?: string;
}

export default function MissionBriefingPage() {
  const router = useRouter();
  const { state, updateMissionBriefing } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState(state.missionBriefing);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (formData.projectName.length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters';
    }

    if (!formData.projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    } else if (formData.projectDescription.length < 20) {
      newErrors.projectDescription = 'Please provide more details (at least 20 characters)';
    }

    if (formData.techStack.length === 0) {
      newErrors.techStack = 'Please select at least one technology';
    }

    if (!formData.features.trim()) {
      newErrors.features = 'Please describe the main features';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Update context
      updateMissionBriefing(formData);

      // Call API to create project
      const response = await fetch('/api/onboarding/mission-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'start-from-zero',
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit mission briefing');
      }

      const result = await response.json();
      
      // Redirect to mission control dashboard
      router.push(`/dashboard/${result.projectId}`);
    } catch (error) {
      console.error('Error submitting mission briefing:', error);
      alert('Failed to submit mission briefing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding');
  };

  return (
    <WizardLayout
      title="Mission Briefing"
      description="Tell us about your vision. The more detail you provide, the better Archon can architect your solution."
      currentStep={1}
      totalSteps={2}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Name */}
        <FormInput
          label="Project Name"
          placeholder="my-awesome-project"
          value={formData.projectName}
          onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
          error={errors.projectName}
          required
        />

        {/* Project Description */}
        <FormTextarea
          label="Project Description"
          placeholder="Describe what you want to build. What problem does it solve? Who is it for?"
          rows={5}
          value={formData.projectDescription}
          onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
          error={errors.projectDescription}
          helperText="Be specific! Include the purpose, target audience, and key goals."
          required
        />

        {/* Tech Stack */}
        <MultiSelect
          label="Tech Stack"
          options={TECH_STACK_OPTIONS}
          selected={formData.techStack}
          onChange={(selected) => setFormData({ ...formData, techStack: selected })}
          error={errors.techStack}
          helperText="Select all technologies you want to use or would like Archon to recommend"
        />

        {/* Features */}
        <FormTextarea
          label="Core Features"
          placeholder="List the main features and functionality you need. One per line or as a paragraph."
          rows={6}
          value={formData.features}
          onChange={(e) => setFormData({ ...formData, features: e.target.value })}
          error={errors.features}
          helperText="What should users be able to do? What's the MVP?"
          required
        />

        {/* Timeline */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-200">
            Target Timeline
          </label>
          <div className="flex flex-wrap gap-3">
            {TIMELINE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData({ ...formData, timeline: option })}
                className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                  formData.timeline === option
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500">How quickly do you need this built?</p>
        </div>

        {/* Team Size */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-zinc-200">
            Team Size
          </label>
          <div className="flex flex-wrap gap-3">
            {TEAM_SIZE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormData({ ...formData, teamSize: option })}
                className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                  formData.teamSize === option
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500">Who will be working on this?</p>
        </div>

        {/* Additional Context */}
        <FormTextarea
          label="Additional Context (Optional)"
          placeholder="Any other requirements, constraints, or context that would help Archon understand your needs?"
          rows={4}
          value={formData.additionalContext}
          onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
          helperText="Design preferences, integrations, compliance requirements, etc."
        />

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-8 border-t border-zinc-800">
          <LoadingButton
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={loading}
          >
            ← Back
          </LoadingButton>

          <LoadingButton
            type="submit"
            variant="primary"
            loading={loading}
          >
            Deploy Archon Team →
          </LoadingButton>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-12 p-6 border border-blue-500/30 bg-blue-500/5 rounded-lg">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <span>💡</span> What happens next?
        </h4>
        <ul className="text-sm text-zinc-400 space-y-1">
          <li>• Archon analyzes your requirements</li>
          <li>• Tech Lead designs the architecture</li>
          <li>• 7 specialized agents begin building</li>
          <li>• You monitor progress in real-time</li>
        </ul>
      </div>
    </WizardLayout>
  );
}
