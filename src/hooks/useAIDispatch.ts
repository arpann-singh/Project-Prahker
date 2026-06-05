import { useWorkspaceStore } from '../store/workspaceStore';
import { useAIResponseStore } from '../store/aiResponseStore';
import axios from 'axios';
import { saveSession, saveResponse, saveWorkspace, incrementUserTokens } from '../services/firebaseService';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAIDispatch = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const { setResponse, setGenerating, setJudgeResult, setMasterAnswer } = useAIResponseStore();

  const dispatchToAllAIs = async () => {
    if (!currentWorkspace || !currentWorkspace.currentPrompt) return;

    // Safeguard: Fetch profile & check token limit
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const profileData = snap.data();
          const tokensUsed = typeof profileData.tokensUsed === 'number' ? profileData.tokensUsed : 0;
          const tokenLimit = typeof profileData.tokenLimit === 'number' ? profileData.tokenLimit : 100000;
          
          if (tokensUsed >= tokenLimit) {
            alert(`Daily Free Quota Exhausted! You have consumed ${tokensUsed.toLocaleString()} of your ${tokenLimit.toLocaleString()} token allowance. Your quota will reset at midnight UTC. Please wait for the daily scheduler refresh.`);
            return;
          }
        }
      } catch (err) {
        console.error('Error verifying token availability:', err);
      }
    }

    setGenerating(true);
    const providers = currentWorkspace.selectedProviders;
    const prompt = currentWorkspace.currentPrompt;

    // Initialize loading states
    providers.forEach((p) => {
      setResponse(p, { provider: p, model: '...', content: '', isLoading: true });
    });

    try {
      let sessionTokens = Math.ceil(prompt.length / 4);

      const response = await axios.post('/api/ai/dispatch', {
        prompt,
        providers,
        temperature: currentWorkspace.temperature,
        maxTokens: currentWorkspace.maxTokens,
        systemInstruction: currentWorkspace.systemInstruction,
      });

      const results = response.data;
      results.forEach((res: any) => {
        if (res) {
          setResponse(res.provider, { ...res, isLoading: false });
          if (res.content) {
            sessionTokens += Math.ceil(res.content.length / 4);
          }
        }
      });

      const validResponses = results.filter((r: any) => r && !r.error);
      let sessionId: string | undefined;

      if (validResponses.length > 0) {
        // AI Judge with custom evaluation goal
        const judgeRes = await axios.post('/api/ai/judge', {
          prompt,
          responses: validResponses,
          evalGoal: currentWorkspace.evalGoal,
        });
        setJudgeResult(judgeRes.data);
        if (judgeRes.data) {
          sessionTokens += Math.ceil(JSON.stringify(judgeRes.data).length / 4);
        }

        // Master Synthesis with user-defined system parameters
        const bestResponse = validResponses.find((r: any) => r.provider === judgeRes.data.bestProvider)?.content || validResponses[0].content;
        const masterRes = await axios.post('/api/ai/synthesize', {
          prompt,
          bestResponse,
          otherHighlights: judgeRes.data.strongPoints.join(', '),
          systemInstruction: currentWorkspace.systemInstruction,
        });
        setMasterAnswer(masterRes.data.content);
        if (masterRes.data && masterRes.data.content) {
          sessionTokens += Math.ceil(masterRes.data.content.length / 4);
        }

        // 2. Persist to Firestore
        // Ensure the workspace exists first so that foreign key constraints pass
        await saveWorkspace({
          id: currentWorkspace.id,
          name: currentWorkspace.name,
        });

        sessionId = await saveSession({
          workspaceId: currentWorkspace.id,
          prompt,
          judgeResult: judgeRes.data,
          masterAnswer: masterRes.data.content
        });

        if (sessionId) {
          for (const res of validResponses) {
            await saveResponse(sessionId, res);
          }
        }

        // Atomically increment consumed tokens in Firestore
        if (auth.currentUser) {
          await incrementUserTokens(auth.currentUser.uid, sessionTokens);
        }
      }
    } catch (error) {
      console.error('Dispatch failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return { dispatchToAllAIs };
};
