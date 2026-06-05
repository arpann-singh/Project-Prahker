import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Groq } from "groq-sdk";
import OpenAI from "openai";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy client initializers for runtime configuration and key rotation resilience
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
};

const getGroq = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
};

const getOpenRouter = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "AI Echo Lens",
    },
  });
};

// Error formatting helper to provide elegant, actionable feedback
const formatError = (error: any): string => {
  if (!error) return "An unknown error occurred";
  const msg = error.message || String(error);
  
  try {
    if (msg.trim().startsWith("{")) {
      const parsed = JSON.parse(msg);
      if (parsed.error && parsed.error.message) {
        return parsed.error.message;
      }
    }
  } catch (e) {
    // Treat as raw string
  }

  if (msg.includes("leaked") || msg.includes("API key was reported as leaked")) {
    return "Your Gemini API key was reported as leaked by Google. Please go to Settings > Secrets and update your GEMINI_API_KEY with a fresh one.";
  }
  if (msg.includes("quota") || msg.includes("RESOURCE_EXHAUSTED") || msg.includes("exceeded your current quota")) {
    return "Neural resource quota/rate-limit exceeded. Try again in a few seconds, or switch models to bypass limits.";
  }
  return msg;
};

// Scoring Utility
const calculateScores = (content: string) => {
  if (!content) return { quality: 0, accuracy: 0, creativity: 0, composite: 0 };
  const wordCount = content.trim().split(/\s+/).length;
  const lengthScore = Math.min(10, (Math.log(wordCount + 1) / Math.log(500)) * 10);
  
  const structureScore = (
    (content.match(/#/g) || []).length * 2 +
    (content.match(/\* /g) || []).length * 1 +
    (content.match(/```/g) || []).length * 3
  );
  const finalStructureScore = Math.min(10, structureScore);

  const specificityScore = (
    (content.match(/[A-Z][a-z]+/g) || []).length * 0.1 +
    (content.match(/\d+/g) || []).length * 0.2
  );
  const finalSpecificityScore = Math.min(10, specificityScore);

  const compositeScore = (lengthScore * 0.2 + finalStructureScore * 0.3 + finalSpecificityScore * 0.5);

  return {
    quality: Number(lengthScore.toFixed(2)),
    accuracy: Number(finalStructureScore.toFixed(2)),
    creativity: Number(finalSpecificityScore.toFixed(2)),
    composite: Number(compositeScore.toFixed(2)),
  };
};

// API Endpoints
app.post("/api/ai/dispatch", async (req, res) => {
  const { prompt, providers, temperature, maxTokens, systemInstruction } = req.body;

  if (!prompt || !providers || !Array.isArray(providers)) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const callAI = async (provider: string) => {
    const startTime = Date.now();
    try {
      if (provider === "gemini") {
        const client = getGenAI();
        if (!client) throw new Error("Gemini API key missing. Please configure GEMINI_API_KEY.");
        const result = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || "You are a highly precise, context-aware AI assistant.",
            temperature: typeof temperature === "number" ? temperature : 0.7,
            maxOutputTokens: typeof maxTokens === "number" ? maxTokens : 2048,
          }
        });
        const content = result.text || "";
        return {
          provider,
          model: "gemini-3.5-flash",
          content,
          latencyMs: Date.now() - startTime,
          scores: calculateScores(content),
        };
      } else if (provider === "groq") {
        const client = getGroq();
        if (!client) throw new Error("Groq API key missing. Please configure GROQ_API_KEY.");
        const completion = await client.chat.completions.create({
          messages: [
            ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
            { role: "user" as const, content: prompt }
          ],
          model: "llama-3.3-70b-versatile",
          temperature: typeof temperature === "number" ? temperature : 0.7,
          max_tokens: typeof maxTokens === "number" ? maxTokens : 2048,
        });
        const content = completion.choices[0]?.message?.content || "";
        return {
          provider,
          model: "llama-3.3-70b-versatile",
          content,
          latencyMs: Date.now() - startTime,
          scores: calculateScores(content),
        };
      } else if (provider === "openrouter") {
        const client = getOpenRouter();
        if (!client) throw new Error("OpenRouter API key missing. Please configure OPENROUTER_API_KEY.");
        const completion = await client.chat.completions.create({
          messages: [
            ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
            { role: "user" as const, content: prompt }
          ],
          model: "deepseek/deepseek-r1:free",
          temperature: typeof temperature === "number" ? temperature : 0.7,
        });
        const content = completion.choices[0]?.message?.content || "";
        return {
          provider,
          model: "deepseek/deepseek-r1:free",
          content,
          latencyMs: Date.now() - startTime,
          scores: calculateScores(content),
        };
      } else if (provider === "ollama") {
        try {
          const response = await axios.post("http://localhost:11434/api/chat", {
            model: "llama3.2",
            messages: [
              ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
              { role: "user", content: prompt }
            ],
            options: {
              temperature: typeof temperature === "number" ? temperature : 0.7,
              num_predict: typeof maxTokens === "number" ? maxTokens : 2048,
            },
            stream: false,
          }, { timeout: 5000 });
          const content = response.data.message.content || "";
          return {
            provider,
            model: "llama3.2",
            content,
            latencyMs: Date.now() - startTime,
            scores: calculateScores(content),
          };
        } catch (e) {
          throw new Error("Ollama is not available locally.");
        }
      }
      throw new Error(`Unsupported provider: ${provider}`);
    } catch (error: any) {
      const errMsg = formatError(error);
      console.error(`Status 500 - callAI(${provider}):`, errMsg);
      return { provider, error: errMsg, scores: calculateScores("") };
    }
  };

  try {
    const results = await Promise.allSettled(providers.map((p: string) => callAI(p)));
    const responseData = results.map((r) => (r.status === "fulfilled" ? r.value : { provider: "unknown", error: "Unexpected error" }));
    res.json(responseData);
  } catch (err: any) {
    console.error("FATAL: /api/ai/dispatch failed:", err);
    res.status(500).json({ error: "Major orchestration failure" });
  }
});

// Judge Endpoint
app.post("/api/ai/judge", async (req, res) => {
  const { prompt, responses, evalGoal } = req.body;
  if (!responses || responses.length === 0) {
    return res.json({ bestProvider: "none", reasoning: "No responses to judge.", strongPoints: [], weaknesses: [] });
  }

  const formattedResponses = responses
    .map((r: any) => `Provider: ${r.provider}\nContent: ${r.content}`)
    .join("\n\n---\n\n");

  try {
    const promptText = `
      You are an objective AI response evaluator. Given multiple AI responses to the same prompt, identify the best one and explain why concisely. Respond strictly in JSON format.
      
      Evaluation Goal Focus: ${evalGoal || "Focus on technical depth, precise structure, and actionable items."}
      
      Prompt: ${prompt}
      
      Responses:
      ${formattedResponses}
      
      JSON keys: bestProvider, confidence (0-1), reasoning, strongPoints[], weaknesses[]
    `;

    // Try to use Groq if available, otherwise fallback to Gemini
    let content = "";
    const clientGroq = getGroq();
    const clientGenAI = getGenAI();

    if (clientGroq) {
      const result = await clientGroq.chat.completions.create({
        messages: [{ role: "user", content: promptText }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });
      content = result.choices[0].message.content || "{}";
    } else if (clientGenAI) {
      const result = await clientGenAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: { responseMimeType: "application/json" }
      });
      content = result.text || "{}";
    } else {
      throw new Error("No judge model available (missing keys)");
    }

    res.json(JSON.parse(content));
  } catch (error: any) {
    console.error("Judge Error:", error.message);
    // Graceful fallback: pick the first one
    res.json({
      bestProvider: responses[0]?.provider || "unknown",
      reasoning: "Judge failed, defaulting to first response. Error: " + formatError(error),
      strongPoints: [],
      weaknesses: []
    });
  }
});

// Master Answer Endpoint
app.post("/api/ai/synthesize", async (req, res) => {
  const { prompt, bestResponse, otherHighlights, systemInstruction } = req.body;

  try {
    const clientGenAI = getGenAI();
    if (!clientGenAI) throw new Error("Gemini key required for synthesis");
    const promptText = `
      You are a master synthesizer. Combine the best elements of multiple AI responses into one comprehensive, polished final answer.
      
      Target Persona/Style: ${systemInstruction || "You are a highly precise, context-aware AI assistant."}
      
      Original prompt: ${prompt}
      Best response: ${bestResponse}
      Other strong points: ${otherHighlights}
      
      Create the definitive answer.
    `;

    const result = await clientGenAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
    });

    res.json({ content: result.text || bestResponse });
  } catch (error: any) {
    console.error("Synthesis Error:", error.message);
    res.json({ content: bestResponse, error: "Synthesis failed, using best raw response. Error: " + formatError(error) });
  }
});

// AI Pattern & History Analyzer API
app.post("/api/ai/analyze-logs", async (req, res) => {
  const { logs } = req.body;
  if (!logs || !Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ error: "No history logs provided for analysis." });
  }

  const clientGenAI = getGenAI();
  if (!clientGenAI) {
    return res.status(500).json({ error: "Gemini API key is required." });
  }

  const logsSummary = logs.slice(0, 15).map((log, index) => {
    return `Session ${index + 1}:
Prompt: ${log.prompt}
Best Provider picked by Judge: ${log.judgeResult?.bestProvider || "n/a"}
Judge Reasoning: ${log.judgeResult?.reasoning || "n/a"}
Master Answer preview: ${log.masterAnswer ? log.masterAnswer.substring(0, 150) + "..." : "n/a"}`;
  }).join("\n\n---\n\n");

  const promptText = `
    You are a professional Prompt Engineer and AI Performance Architect.
    Analyze the following list of recent user interactions with our AI Orchestration suite:
    
    ${logsSummary}
    
    Discover key usage patterns, primary topic themes, and recommend concrete optimization suggestions for their prompts. Provide constructive insights regarding which LLM providers (Gemini, Llama) were selected as best.
    
    You MUST respond strictly in a valid JSON object matching this structure:
    {
      "summary": "High-level diagnostic summary explaining who the user is as a prompter and overall prompt quality trends.",
      "topTopics": ["Theme 1", "Theme 2", "Theme 3"],
      "providerInsights": "Actionable explanation of LLM choice trends, such as which provider works best for what cases based on the logs.",
      "suggestedPrompts": [
        {
          "original": "A representative prompt the user ran from the logs",
          "improved": "An optimized, system-prompt enriched version of that prompt using clear structural instructions",
          "reason": "Why this improved version delivers superior, more reliable or structured outcomes."
        }
      ]
    }
  `;

  try {
    const result = await clientGenAI.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: { responseMimeType: "application/json" }
    });
    const content = result.text || "{}";
    res.json(JSON.parse(content));
  } catch (error: any) {
    console.error("Pattern Analysis Error:", error.message);
    res.status(500).json({ error: "Could not complete pattern analysis. Error: " + error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
