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

// AI Clients setup
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: { headers: { "User-Agent": "aistudio-build" } },
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || " " });

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || " ",
  defaultHeaders: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "AI Echo Lens",
  },
});

// Scoring Utility
const calculateScores = (content: string) => {
  const wordCount = content.split(/\s+/).length;
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
    quality: lengthScore,
    accuracy: finalStructureScore,
    creativity: finalSpecificityScore,
    composite: compositeScore,
  };
};

// API Endpoints
app.post("/api/ai/dispatch", async (req, res) => {
  const { prompt, providers, userId } = req.body;

  const callAI = async (provider: string) => {
    const startTime = Date.now();
    try {
      if (provider === "gemini") {
        const result = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });
        const content = result.text || "";
        return {
          provider,
          model: "gemini-3-flash-preview",
          content,
          latencyMs: Date.now() - startTime,
          scores: calculateScores(content),
        };
      } else if (provider === "groq") {
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.3-70b-versatile",
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
        const completion = await openRouter.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "deepseek/deepseek-r1:free",
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
        const response = await axios.post("http://localhost:11434/api/chat", {
          model: "llama3.2",
          messages: [{ role: "user", content: prompt }],
          stream: false,
        });
        const content = response.data.message.content || "";
        return {
          provider,
          model: "llama3.2",
          content,
          latencyMs: Date.now() - startTime,
          scores: calculateScores(content),
        };
      }
    } catch (error) {
      console.error(`Error calling ${provider}:`, error);
      return { provider, error: "Failed to generate response" };
    }
  };

  const results = await Promise.allSettled(providers.map((p: string) => callAI(p)));
  res.json(results.map((r) => (r.status === "fulfilled" ? r.value : null)));
});

// Judge Endpoint
app.post("/api/ai/judge", async (req, res) => {
  const { prompt, responses } = req.body;
  const formattedResponses = responses
    .map((r: any) => `Provider: ${r.provider}\nContent: ${r.content}`)
    .join("\n\n---\n\n");

  try {
    const promptText = `
      You are an objective AI response evaluator. Given multiple AI responses to the same prompt, identify the best one and explain why concisely.
      
      Prompt: ${prompt}
      
      Responses:
      ${formattedResponses}
      
      Respond in JSON format:
      {
        "bestProvider": "provider_name",
        "confidence": 0.95,
        "reasoning": "explanation",
        "strongPoints": ["point1", "point2"],
        "weaknesses": ["point1"]
      }
    `;

    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: promptText }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    res.json(JSON.parse(result.choices[0].message.content || "{}"));
  } catch (error) {
    res.status(500).json({ error: "Judge failed" });
  }
});

// Master Answer Endpoint
app.post("/api/ai/synthesize", async (req, res) => {
  const { prompt, bestResponse, otherHighlights } = req.body;

  try {
    const promptText = `
      You are a master synthesizer. Combine the best elements of multiple AI responses into one comprehensive, polished final answer.
      
      Original prompt: ${prompt}
      Best response: ${bestResponse}
      Other strong points: ${otherHighlights}
      
      Create the definitive answer.
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: promptText,
    });

    res.json({ content: result.text });
  } catch (error) {
    res.status(500).json({ error: "Synthesis failed" });
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
