import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./prompts/system";
import { FEW_SHOT_EXAMPLES } from "./prompts/fewShot";
import { validateSchema } from "../validation/validateSchema";
import { validateSceneGraph } from "../validation/validateSceneGraph";
import { autoRepair } from "./repair/autoRepair";
import type { VideoProject } from "../types/schema";
import type { GenerationRequest, GenerationResult } from "./types";

export async function generateSceneGraph(
  request: GenerationRequest
): Promise<GenerationResult> {
  const client = new OpenAI();
  const userPrompt = buildUserPrompt(request);
  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const response = await client.chat.completions.create({
    model: model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      // Few-shot examples
      ...FEW_SHOT_EXAMPLES.map(ex => ({
        role: ex.role,
        content: ex.content
      })),
      // Actual request
      { role: "user", content: userPrompt }
    ],
    temperature: 0.1,
    response_format: { type: "json_object" }
  });

  const rawText = response.choices[0].message?.content || "";

  // Strip markdown if AI added it despite instructions
  const jsonText = rawText
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`AI returned invalid JSON: ${jsonText.slice(0, 200)}`);
  }

  // Schema validation
  const schemaResult = validateSchema(parsed);
  if (!schemaResult.valid) {
    // Try auto-repair
    const repaired = await autoRepair(parsed, schemaResult.errors);
    return {
      project: repaired.project,
      wasRepaired: true,
      repairLog: repaired.log
    };
  }

  // Semantic validation
  const semanticResult = validateSceneGraph(parsed as VideoProject);
  if (!semanticResult.valid) {
    const repaired = await autoRepair(parsed, semanticResult.errors);
    return {
      project: repaired.project,
      wasRepaired: true,
      repairLog: repaired.log
    };
  }

  return {
    project: parsed as VideoProject,
    wasRepaired: false
  };
}

function buildUserPrompt(request: GenerationRequest): string {
  return `
Create a premium motion graphics video for:

BRIEF: ${request.brief}

STYLE: ${request.style ?? "apple"}
DURATION: ${request.duration ?? 20} seconds
ASPECT RATIO: ${request.aspectRatio ?? "16:9"}

Requirements:
- Use ${request.style === "apple" ? "Apple" : "Google"} motion design language
- 60fps
- Premium glassmorphism where appropriate
- Tight choreography with proper stagger groups
- Each scene must have explicit keyframe easing (e.g., [0.16, 1, 0.3, 1] cubic-bezier curve in keyframes)

Output the complete VideoProject JSON now.
  `.trim();
}
