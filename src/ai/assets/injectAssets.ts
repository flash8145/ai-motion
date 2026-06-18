/**
 * Asset injection — bridges the user's real product media into the AI-generated
 * scene graph.
 *
 * The AI never sees real URLs. Instead it references media by id using the
 * string "asset:<id>" (or "asset:<index>"). After generation we:
 *   1. Recursively replace every "asset:<ref>" string with the real URL, and
 *      set a sibling "mediaType" when a "mediaSrc" resolves to a video.
 *   2. Auto-assign any leftover assets to media-hungry scenes that still lack a
 *      source (BrowserWindow, DashboardShowcase, ScreenshotShowcase,
 *      ScreenRecordingMockup) — so supplied assets are never silently dropped.
 */

import type { VideoProject, Scene } from "../../types/schema";
import type { AssetInput } from "../types";

const ASSET_REF = /^asset:(.+)$/;

/** Scene prop names that hold a media source, by scene type. */
const MEDIA_PROP: Record<string, string> = {
  BrowserWindow: "mediaSrc",
  DashboardShowcase: "screenshotUrl",
  ScreenshotShowcase: "screenshotUrl",
  ScreenRecordingMockup: "screenshotSrc",
};

export function injectAssets(
  project: VideoProject,
  assets: AssetInput[] = [],
): VideoProject {
  if (!assets.length) return project;

  const byId = new Map<string, AssetInput>();
  assets.forEach((a, i) => {
    byId.set(a.id, a);
    byId.set(String(i), a); // allow "asset:0" positional refs
  });

  const used = new Set<string>();

  const lookup = (ref: string): AssetInput | undefined => byId.get(ref);

  // Deep clone so we never mutate the caller's project.
  const cloned: VideoProject = JSON.parse(JSON.stringify(project));

  const transformValue = (value: unknown): unknown => {
    if (typeof value === "string") {
      const m = value.match(ASSET_REF);
      if (m) {
        const asset = lookup(m[1].trim());
        if (asset) {
          used.add(asset.id);
          return asset.url;
        }
      }
      return value;
    }
    if (Array.isArray(value)) return value.map(transformValue);
    if (value && typeof value === "object") return transformObject(value as Record<string, unknown>);
    return value;
  };

  const transformObject = (obj: Record<string, unknown>): Record<string, unknown> => {
    const out: Record<string, unknown> = {};
    let mediaTypeOverride: "image" | "video" | null = null;

    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string") {
        const m = v.match(ASSET_REF);
        if (m) {
          const asset = lookup(m[1].trim());
          if (asset) {
            used.add(asset.id);
            out[k] = asset.url;
            if (k === "mediaSrc") mediaTypeOverride = asset.type;
            continue;
          }
        }
      }
      out[k] = transformValue(v);
    }

    // Asset type wins over any AI-guessed mediaType.
    if (mediaTypeOverride) out.mediaType = mediaTypeOverride;
    return out;
  };

  cloned.scenes = (cloned.scenes ?? []).map(
    (scene) => transformObject(scene as unknown as Record<string, unknown>) as unknown as Scene,
  );

  autoAssign(cloned, assets, used);
  return cloned;
}

/** Fill media-hungry scenes that still have no source with leftover assets. */
function autoAssign(
  project: VideoProject,
  assets: AssetInput[],
  used: Set<string>,
): void {
  const leftovers = assets.filter((a) => !used.has(a.id));
  if (!leftovers.length) return;

  // Prefer images first for screenshot-style props, videos for recordings.
  const queue = [...leftovers];
  const take = (prefer?: "image" | "video"): AssetInput | undefined => {
    const idx = prefer ? queue.findIndex((a) => a.type === prefer) : 0;
    const at = idx >= 0 ? idx : 0;
    return queue.splice(queue.length ? at : 0, 1)[0];
  };

  for (const scene of project.scenes) {
    const propName = MEDIA_PROP[scene.type];
    if (!propName) continue;
    const props = (scene.props ?? {}) as Record<string, unknown>;
    if (props[propName]) continue; // already has a source
    if (!queue.length) break;

    const prefer = scene.type === "ScreenRecordingMockup" ? "video" : "image";
    const asset = take(prefer) ?? take();
    if (!asset) break;

    props[propName] = asset.url;
    if (scene.type === "BrowserWindow") props.mediaType = asset.type;
    scene.props = props;
    used.add(asset.id);
  }
}

/** Renders an asset manifest for the system/user prompt. */
export function buildAssetManifest(assets: AssetInput[] = []): string {
  if (!assets.length) return "";
  const lines = assets
    .map((a) => `- asset:${a.id}  (${a.type})${a.description ? ` — ${a.description}` : ""}`)
    .join("\n");
  return [
    "AVAILABLE ASSETS — the user's REAL product media.",
    'Reference an asset in any media prop using the string "asset:<id>"',
    '(e.g. BrowserWindow "mediaSrc": "asset:hero"; mediaType is auto-detected).',
    "Do NOT invent image/video URLs — only use these asset ids. If none fits, omit the media prop.",
    lines,
  ].join("\n");
}
