import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
  currentPrompt: string;
  optimizedPrompt?: string;
  selectedProviders: string[];
  context: string[];
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  evalGoal?: string;
}

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  updatePrompt: (prompt: string) => void;
  toggleProvider: (provider: string) => void;
  addContext: (text: string) => void;
  updateConfig: (config: Partial<Pick<Workspace, 'temperature' | 'maxTokens' | 'systemInstruction' | 'evalGoal'>>) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: {
    id: 'default',
    name: 'New Workspace',
    currentPrompt: '',
    selectedProviders: ['gemini', 'groq'],
    context: [],
    temperature: 0.7,
    maxTokens: 2048,
    systemInstruction: 'You are a highly precise, context-aware AI assistant.',
    evalGoal: 'Focus on technical depth, precise structure, and actionable code blocks.',
  },
  workspaces: [],
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  updatePrompt: (prompt) =>
    set((state) => ({
      currentWorkspace: state.currentWorkspace
        ? { ...state.currentWorkspace, currentPrompt: prompt }
        : null,
    })),
  toggleProvider: (provider) =>
    set((state) => {
      if (!state.currentWorkspace) return {};
      const providers = state.currentWorkspace.selectedProviders.includes(provider)
        ? state.currentWorkspace.selectedProviders.filter((p) => p !== provider)
        : [...state.currentWorkspace.selectedProviders, provider];
      return {
        currentWorkspace: { ...state.currentWorkspace, selectedProviders: providers },
      };
    }),
  addContext: (text) =>
    set((state) => ({
      currentWorkspace: state.currentWorkspace
        ? { ...state.currentWorkspace, context: [...state.currentWorkspace.context, text] }
        : null,
    })),
  updateConfig: (config) =>
    set((state) => ({
      currentWorkspace: state.currentWorkspace
        ? { ...state.currentWorkspace, ...config }
        : null,
    })),
}));
