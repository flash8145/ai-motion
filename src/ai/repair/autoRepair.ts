import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import type { VideoProject } from "../../types/schema";

export async function autoRepair(
  broken: unknown,
  errors: string[],
  provider: "openai" | "gemini" = "openai"
): Promise<{ project: VideoProject; log: string[] }> {
  let rawText = "";

  if (provider === "gemini") {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || ""
    });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: "user",
          parts: [{
            text: `
Fix this scene graph JSON. It has these validation errors:

ERRORS:
${errors.map(e => `- ${e}`).join("\n")}

BROKEN JSON:
${JSON.stringify(broken, null, 2)}

Return ONLY the fixed JSON, nothing else.
            `.trim()
          }]
        }
      ],
      config: {
        systemInstruction: "You are an automated code repair assistant. Your task is to fix a broken motion graphics JSON scene graph to match its schema exactly. Return ONLY valid JSON, with absolutely no markdown wrapping, explanation, or extra characters.",
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    rawText = response.text || "{}";
  } else {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
    const model = process.env.OPENAI_MODEL || "gpt-4o";

    const response = await client.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an automated code repair assistant. Your task is to fix a broken motion graphics JSON scene graph to match its schema exactly. Return ONLY valid JSON, with absolutely no markdown wrapping, explanation, or extra characters."
        },
        {
          role: "user",
          content: `
Fix this scene graph JSON. It has these validation errors:

ERRORS:
${errors.map(e => `- ${e}`).join("\n")}

BROKEN JSON:
${JSON.stringify(broken, null, 2)}

Return ONLY the fixed JSON, nothing else.
        `
        }
      ]
    });

    rawText = response.choices[0].message?.content || "{}";
  }
  
  // Strip markdown code block wrappers if present
  const jsonText = rawText
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  let fixed: VideoProject;
  try {
    fixed = JSON.parse(jsonText);
  } catch {
    fixed = broken as VideoProject;
  }
  
  return {
    project: fixed,
    log: errors
  };
}
