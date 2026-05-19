import { useWorkspaceStore } from '../store/workspaceStore';
import { useAIResponseStore } from '../store/aiResponseStore';
import axios from 'axios';

export const useAIDispatch = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const { setResponse, setGenerating, setJudgeResult, setMasterAnswer } = useAIResponseStore();

  const dispatchToAllAIs = async () => {
    if (!currentWorkspace || !currentWorkspace.currentPrompt) return;

    setGenerating(true);
    const providers = currentWorkspace.selectedProviders;

    // Initialize loading states
    providers.forEach((p) => {
      setResponse(p, { provider: p, model: '...', content: '', isLoading: true });
    });

    try {
      const response = await axios.post('/api/ai/dispatch', {
        prompt: currentWorkspace.currentPrompt,
        providers,
      });

      const results = response.data;
      results.forEach((res: any) => {
        if (res) {
          setResponse(res.provider, { ...res, isLoading: false });
        }
      });

      // After all AIs respond, call the Judge
      const validResponses = results.filter((r: any) => r && !r.error);
      if (validResponses.length > 0) {
        const judgeRes = await axios.post('/api/ai/judge', {
          prompt: currentWorkspace.currentPrompt,
          responses: validResponses,
        });
        setJudgeResult(judgeRes.data);

        // Then generate Master Answer
        const bestResponse = validResponses.find((r: any) => r.provider === judgeRes.data.bestProvider)?.content || validResponses[0].content;
        const masterRes = await axios.post('/api/ai/synthesize', {
          prompt: currentWorkspace.currentPrompt,
          bestResponse,
          otherHighlights: judgeRes.data.strongPoints.join(', '),
        });
        setMasterAnswer(masterRes.data.content);
      }
    } catch (error) {
      console.error('Dispatch failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return { dispatchToAllAIs };
};
