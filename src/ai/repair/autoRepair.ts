import OpenAI from "openai";
import type { VideoProject } from "../../types/schema";

export async function autoRepair(
  broken: unknown,
  errors: string[]
): Promise<{ project: VideoProject; log: string[] }> {
  const client = new OpenAI();
  
  const response = await client.chat.completions.create({
    model: "gpt-4o",
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
  
  const rawText = response.choices[0].message?.content || "{}";
  
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
