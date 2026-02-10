'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type OnboardingMode = 'start-from-zero' | 'existing-codebase' | null;

export interface MissionBriefingData {
  projectName: string;
  projectDescription: string;
  techStack: string[];
  features: string;
  timeline: string;
  teamSize: string;
  additionalContext: string;
}

export interface RepoConnectData {
  githubUrl: string;
  accessToken: string;
  branch: string;
  analyzeExisting: boolean;
}

export interface OnboardingState {
  mode: OnboardingMode;
  missionBriefing: MissionBriefingData;
  repoConnect: RepoConnectData;
}

interface OnboardingContextType {
  state: OnboardingState;
  setMode: (mode: OnboardingMode) => void;
  updateMissionBriefing: (data: Partial<MissionBriefingData>) => void;
  updateRepoConnect: (data: Partial<RepoConnectData>) => void;
  resetOnboarding: () => void;
}

const initialMissionBriefing: MissionBriefingData = {
  projectName: '',
  projectDescription: '',
  techStack: [],
  features: '',
  timeline: '',
  teamSize: '',
  additionalContext: '',
};

const initialRepoConnect: RepoConnectData = {
  githubUrl: '',
  accessToken: '',
  branch: 'main',
  analyzeExisting: true,
};

const initialState: OnboardingState = {
  mode: null,
  missionBriefing: initialMissionBriefing,
  repoConnect: initialRepoConnect,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>(initialState);

  const setMode = (mode: OnboardingMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const updateMissionBriefing = (data: Partial<MissionBriefingData>) => {
    setState(prev => ({
      ...prev,
      missionBriefing: { ...prev.missionBriefing, ...data },
    }));
  };

  const updateRepoConnect = (data: Partial<RepoConnectData>) => {
    setState(prev => ({
      ...prev,
      repoConnect: { ...prev.repoConnect, ...data },
    }));
  };

  const resetOnboarding = () => {
    setState(initialState);
  };

  return (
    <OnboardingContext.Provider
      value={{
        state,
        setMode,
        updateMissionBriefing,
        updateRepoConnect,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
