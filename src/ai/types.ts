import type { VideoProject } from "../types/schema";

/**
 * A piece of the user's real product media (screenshot / screen recording).
 * Referenced inside the scene graph as the string "asset:<id>", which the
 * injector replaces with the real `url` after generation.
 */
export interface AssetInput {
  /** Stable id the AI references as "asset:<id>". */
  id: string;
  type: "image" | "video";
  /** Absolute https URL, or a path under public/. */
  url: string;
  /** Short description so the AI knows where to place it. */
  description?: string;
}

export interface GenerationRequest {
  brief: string;
  style?: "apple" | "google" | "stripe" | "custom";
  duration?: number;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  referenceUrls?: string[];
  /** The user's real product media, injected into the scene graph by id. */
  assets?: AssetInput[];
  provider?: "openai" | "gemini";
}

export interface GenerationResult {
  project: VideoProject;
  wasRepaired: boolean;
  repairLog?: string[];
}
