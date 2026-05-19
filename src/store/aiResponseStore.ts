import { create } from 'zustand';

interface AIResponse {
  provider: string;
  model: string;
  content: string;
  latencyMs?: number;
  scores?: {
    quality: number;
    accuracy: number;
    creativity: number;
    composite: number;
  };
  isLoading: boolean;
  error?: string;
}

interface AIState {
  responses: Record<string, AIResponse>;
  isGenerating: boolean;
  judgeResult: any | null;
  masterAnswer: string | null;
  setResponse: (provider: string, response: Partial<AIResponse>) => void;
  setGenerating: (status: boolean) => void;
  setJudgeResult: (result: any) => void;
  setMasterAnswer: (answer: string) => void;
  resetWorkspace: () => void;
}

export const useAIResponseStore = create<AIState>((set) => ({
  responses: {},
  isGenerating: false,
  judgeResult: null,
  masterAnswer: null,
  setResponse: (provider, response) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [provider]: { ...state.responses[provider], ...response },
      },
    })),
  setGenerating: (status) => set({ isGenerating: status }),
  setJudgeResult: (result) => set({ judgeResult: result }),
  setMasterAnswer: (answer) => set({ masterAnswer: answer }),
  resetWorkspace: () => set({ responses: {}, judgeResult: null, masterAnswer: null, isGenerating: false }),
}));
