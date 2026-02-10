'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboarding } from '@/lib/onboarding-context';
import WizardLayout from '@/components/onboarding/WizardLayout';
import FormInput from '@/components/onboarding/FormInput';
import LoadingButton from '@/components/onboarding/LoadingButton';

interface FormErrors {
  githubUrl?: string;
  accessToken?: string;
  branch?: string;
}

interface RepoAnalysis {
  languages: Record<string, number>;
  frameworks: string[];
  totalFiles: number;
  totalLines: number;
}

export default function RepoConnectPage() {
  const router = useRouter();
  const { state, updateRepoConnect } = useOnboarding();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [repoAnalysis, setRepoAnalysis] = useState<RepoAnalysis | null>(null);

  const [formData, setFormData] = useState(state.repoConnect);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const githubUrlRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (!formData.githubUrl.trim()) {
      newErrors.githubUrl = 'GitHub repository URL is required';
    } else if (!githubUrlRegex.test(formData.githubUrl.trim())) {
      newErrors.githubUrl = 'Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)';
    }

    if (!formData.accessToken.trim()) {
      newErrors.accessToken = 'GitHub Personal Access Token is required';
    } else if (formData.accessToken.length < 20) {
      newErrors.accessToken = 'Invalid token format';
    }

    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAnalyze = async () => {
    if (!validate()) {
      return;
    }

    setAnalyzing(true);
    setRepoAnalysis(null);

    try {
      const response = await fetch('/api/onboarding/analyze-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubUrl: formData.githubUrl,
          accessToken: formData.accessToken,
          branch: formData.branch,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to analyze repository');
      }

      const analysis = await response.json();
      setRepoAnalysis(analysis);
    } catch (error: any) {
      console.error('Error analyzing repository:', error);
      alert(error.message || 'Failed to analyze repository. Please check your credentials and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Update context
      updateRepoConnect(formData);

      // Call API to connect repository
      const response = await fetch('/api/onboarding/repo-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'existing-codebase',
          ...formData,
          analysis: repoAnalysis,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect repository');
      }

      const result = await response.json();
      
      // Redirect to mission control dashboard
      router.push(`/dashboard/${result.projectId}`);
    } catch (error) {
      console.error('Error connecting repository:', error);
      alert('Failed to connect repository. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/onboarding');
  };

  return (
    <WizardLayout
      title="Connect Repository"
      description="Link your existing GitHub repository and let Archon integrate with your codebase."
      currentStep={1}
      totalSteps={2}
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* GitHub URL */}
        <FormInput
          label="GitHub Repository URL"
          placeholder="https://github.com/username/repository"
          value={formData.githubUrl}
          onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
          error={errors.githubUrl}
          helperText="The full URL to your GitHub repository"
          required
        />

        {/* Access Token */}
        <div className="space-y-2">
          <FormInput
            label="GitHub Personal Access Token"
            type="password"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={formData.accessToken}
            onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
            error={errors.accessToken}
            helperText={
              <span>
                Need a token?{' '}
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 underline"
                >
                  Create one here
                </a>
                {' '}(requires 'repo' scope)
              </span>
            }
            required
          />
        </div>

        {/* Branch */}
        <FormInput
          label="Branch"
          placeholder="main"
          value={formData.branch}
          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
          error={errors.branch}
          helperText="The branch Archon should work with (usually 'main' or 'master')"
          required
        />

        {/* Analyze Toggle */}
        <div className="flex items-center gap-3 p-4 border border-zinc-800 rounded-lg bg-zinc-900/30">
          <input
            type="checkbox"
            id="analyzeExisting"
            checked={formData.analyzeExisting}
            onChange={(e) => setFormData({ ...formData, analyzeExisting: e.target.checked })}
            className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-emerald-500 
              focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-offset-zinc-950"
          />
          <label htmlFor="analyzeExisting" className="text-sm text-zinc-300 cursor-pointer">
            Analyze existing codebase before deployment
          </label>
        </div>

        {/* Analyze Button */}
        {formData.analyzeExisting && !repoAnalysis && (
          <div className="flex justify-center">
            <LoadingButton
              type="button"
              variant="secondary"
              onClick={handleAnalyze}
              loading={analyzing}
            >
              {analyzing ? 'Analyzing Repository...' : '🔍 Analyze Repository'}
            </LoadingButton>
          </div>
        )}

        {/* Analysis Results */}
        {repoAnalysis && (
          <div className="p-6 border border-emerald-500/30 bg-emerald-500/5 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>✓</span> Repository Analysis Complete
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/50 rounded border border-zinc-800">
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {repoAnalysis.totalFiles.toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400">Files</div>
              </div>
              
              <div className="p-4 bg-zinc-900/50 rounded border border-zinc-800">
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {repoAnalysis.totalLines.toLocaleString()}
                </div>
                <div className="text-sm text-zinc-400">Lines of Code</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Languages Detected</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(repoAnalysis.languages).map(([lang, percentage]) => (
                  <div
                    key={lang}
                    className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs font-mono"
                  >
                    {lang}: {percentage}%
                  </div>
                ))}
              </div>
            </div>

            {repoAnalysis.frameworks.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Frameworks Detected</h4>
                <div className="flex flex-wrap gap-2">
                  {repoAnalysis.frameworks.map((framework) => (
                    <div
                      key={framework}
                      className="px-3 py-1 bg-emerald-500/20 border border-emerald-500 text-emerald-400 rounded text-xs font-mono"
                    >
                      {framework}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
            disabled={formData.analyzeExisting && !repoAnalysis}
          >
            Connect & Deploy →
          </LoadingButton>
        </div>
      </form>

      {/* Info Boxes */}
      <div className="mt-12 space-y-4">
        <div className="p-6 border border-yellow-500/30 bg-yellow-500/5 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span>🔒</span> Security Note
          </h4>
          <p className="text-sm text-zinc-400">
            Your GitHub token is encrypted and stored securely. It's only used to access your repository
            and is never shared with third parties.
          </p>
        </div>

        <div className="p-6 border border-blue-500/30 bg-blue-500/5 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <span>💡</span> What happens next?
          </h4>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li>• Archon clones your repository</li>
            <li>• Tech Lead analyzes your architecture</li>
            <li>• Agents integrate with your existing code</li>
            <li>• You maintain full control via Mission Control</li>
          </ul>
        </div>
      </div>
    </WizardLayout>
  );
}
