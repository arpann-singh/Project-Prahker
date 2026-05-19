import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
  currentPrompt: string;
  optimizedPrompt?: string;
  selectedProviders: string[];
  context: string[];
}

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  setCurrentWorkspace: (workspace: Workspace) => void;
  updatePrompt: (prompt: string) => void;
  toggleProvider: (provider: string) => void;
  addContext: (text: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  currentWorkspace: {
    id: 'default',
    name: 'New Workspace',
    currentPrompt: '',
    selectedProviders: ['gemini', 'groq'],
    context: [],
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
}));
