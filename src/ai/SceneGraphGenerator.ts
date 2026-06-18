import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./prompts/system";
import { FEW_SHOT_EXAMPLES } from "./prompts/fewShot";
import { validateSchema } from "../validation/validateSchema";
import { validateSceneGraph } from "../validation/validateSceneGraph";
import { autoRepair } from "./repair/autoRepair";
import { injectAssets, buildAssetManifest } from "./assets/injectAssets";
import type { VideoProject } from "../types/schema";
import type { GenerationRequest, GenerationResult } from "./types";

export async function generateSceneGraph(
  request: GenerationRequest
): Promise<GenerationResult> {
  const provider = request.provider || (process.env.GEMINI_API_KEY ? "gemini" : "openai");
  const userPrompt = buildUserPrompt(request);

  let rawText = "";

  if (provider === "gemini") {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || ""
    });
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...FEW_SHOT_EXAMPLES.map(ex => ({
          role: ex.role === "assistant" ? "model" : "user",
          parts: [{ text: ex.content }]
        })),
        { role: "user", parts: [{ text: userPrompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });

    rawText = response.text || "";
  } else {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || ""
    });
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

    rawText = response.choices[0].message?.content || "";
  }

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
  let wasRepaired = false;
  const repairLog: string[] = [];

  if (!schemaResult.valid) {
    wasRepaired = true;
    repairLog.push(...schemaResult.errors);
    
    // Try auto-repair
    const repaired = await autoRepair(parsed, schemaResult.errors, provider);
    parsed = repaired.project;

    // Validate repaired output
    const secondSchemaResult = validateSchema(parsed);
    if (!secondSchemaResult.valid) {
      repairLog.push("Second schema validation failed, cleaning invalid optional properties...");
      repairLog.push(...secondSchemaResult.errors);
      parsed = cleanInvalidOptionalProperties(parsed, secondSchemaResult.errors);
    }
  }

  // Semantic validation
  const semanticResult = validateSceneGraph(parsed as VideoProject);
  if (!semanticResult.valid) {
    wasRepaired = true;
    repairLog.push(...semanticResult.errors);
    
    const repaired = await autoRepair(parsed, semanticResult.errors, provider);
    parsed = repaired.project;

    // Validate repaired output
    const secondSemanticResult = validateSceneGraph(parsed as VideoProject);
    if (!secondSemanticResult.valid) {
      repairLog.push("Second semantic validation failed, cleaning invalid optional properties...");
      repairLog.push(...secondSemanticResult.errors);
      parsed = cleanInvalidOptionalProperties(parsed, secondSemanticResult.errors);
    }
  }

  // Inject the user's real product media by id ("asset:<id>" → real URL),
  // and auto-assign any leftover assets to media-hungry scenes.
  const project = injectAssets(parsed as VideoProject, request.assets);

  return {
    project,
    wasRepaired,
    repairLog: wasRepaired ? repairLog : undefined
  };
}

function cleanInvalidOptionalProperties(project: unknown, errors: string[]): unknown {
  // Deep clone project to avoid mutating the original object
  const cleaned = JSON.parse(JSON.stringify(project)) as {
    scenes?: Array<Record<string, unknown>>;
  };
  
  for (const error of errors) {
    // AJV errors look like: "/scenes/0/keyframes: must be array" or similar
    const match = error.match(/^\/scenes\/(\d+)\/([a-zA-Z0-9_]+)/);
    if (match) {
      const sceneIndex = parseInt(match[1], 10);
      const propertyName = match[2];
      
      // Only delete optional top-level properties of the scene
      const optionalProperties = ["keyframes", "camera", "staggerGroup", "textLayer", "transitionIn", "overlays"];
      if (
        optionalProperties.includes(propertyName) &&
        cleaned.scenes &&
        cleaned.scenes[sceneIndex] &&
        cleaned.scenes[sceneIndex][propertyName] !== undefined
      ) {
        delete cleaned.scenes[sceneIndex][propertyName];
      }
    }
  }
  
  return cleaned;
}

function buildUserPrompt(request: GenerationRequest): string {
  const manifest = buildAssetManifest(request.assets);
  return `
Create a premium motion graphics video for:

BRIEF: ${request.brief}

STYLE: ${request.style ?? "apple"}
DURATION: ${request.duration ?? 20} seconds
ASPECT RATIO: ${request.aspectRatio ?? "16:9"}
${manifest ? `\n${manifest}\n` : ""}
Requirements:
- Use ${request.style === "apple" ? "Apple" : "Google"} motion design language
- 60fps
- Premium glassmorphism where appropriate
- Tight choreography with proper stagger groups
- Each scene must have explicit keyframe easing (e.g., [0.16, 1, 0.3, 1] cubic-bezier curve in keyframes)

Output the complete VideoProject JSON now.
  `.trim();
}
