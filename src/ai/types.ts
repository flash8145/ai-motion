import type { VideoProject } from "../types/schema";

export interface GenerationRequest {
  brief: string;
  style?: "apple" | "google" | "stripe" | "custom";
  duration?: number;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  referenceUrls?: string[];
}

export interface GenerationResult {
  project: VideoProject;
  wasRepaired: boolean;
  repairLog?: string[];
}
