/**
 * CLI Render Script
 *
 * Usage:
 *   npx tsx scripts/render.ts <scene-graph.json> [--output <path>]
 *
 * Reads a scene graph JSON file, validates it, and renders
 * the video composition to an MP4 file.
 */

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { readFileSync, existsSync } from "fs";
import { resolve, basename } from "path";
import { cpus } from "os";
import { validateSchema } from "../src/validation/validateSchema";
import { validateSceneGraph } from "../src/validation/validateSceneGraph";
import type { VideoProject } from "../src/types/schema";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    console.log("Usage: npx tsx scripts/render.ts <scene-graph.json> [options]");
    console.log("");
    console.log("Options:");
    console.log("  --output <path>        Custom output path for the rendered MP4");
    console.log("  --concurrency <num>    Number of concurrent rendering threads (default: safe cap of 2)");
    console.log("  --verbose              Enable detailed browser and render logging");
    process.exit(args.includes("--help") || args.includes("-h") ? 0 : 1);
  }

  const jsonPath = resolve(args[0]);
  const outputIndex = args.indexOf("--output");
  const outputPath =
    outputIndex !== -1 && args[outputIndex + 1]
      ? resolve(args[outputIndex + 1])
      : resolve("out", `${basename(jsonPath, ".json")}.mp4`);

  const concurrencyIndex = args.indexOf("--concurrency");
  let concurrency =
    concurrencyIndex !== -1 && args[concurrencyIndex + 1]
      ? parseInt(args[concurrencyIndex + 1], 10)
      : undefined;

  if (concurrency === undefined) {
    const cores = cpus().length || 1;
    concurrency = Math.min(2, cores);
    console.log(
      `⚠️  No --concurrency flag provided. Defaulting to safe concurrency = ${concurrency} (max 2)`
    );
    console.log(
      `   to prevent laptop crashes/shutdowns. Override with --concurrency <num> if desired.\n`
    );
  } else {
    console.log(`⚡ Concurrency set manually to ${concurrency}\n`);
  }

  const verbose = args.includes("--verbose");

  // ── Load and validate ──────────────────────────────────────
  if (!existsSync(jsonPath)) {
    console.error(`File not found: ${jsonPath}`);
    process.exit(1);
  }

  console.log(`📄 Loading: ${jsonPath}`);
  const raw = JSON.parse(readFileSync(jsonPath, "utf-8"));

  // Schema validation
  const schemaResult = validateSchema(raw);
  if (!schemaResult.valid) {
    console.error("❌ Schema validation failed:");
    schemaResult.errors.forEach((e) => console.error(`  • ${e}`));
    process.exit(1);
  }
  console.log("✅ Schema validation passed");

  // Semantic validation
  const project = raw as VideoProject;
  const graphResult = validateSceneGraph(project);

  if (graphResult.warnings.length > 0) {
    console.warn("⚠️  Warnings:");
    graphResult.warnings.forEach((w) => console.warn(`  • ${w}`));
  }

  if (!graphResult.valid) {
    console.error("❌ Scene graph validation failed:");
    graphResult.errors.forEach((e) => console.error(`  • ${e}`));
    process.exit(1);
  }
  console.log("✅ Scene graph validation passed");

  // ── Bundle ─────────────────────────────────────────────────
  console.log("📦 Bundling...");
  const bundled = await bundle({
    entryPoint: resolve("src/index.ts"),
    webpackOverride: (config) => config,
  });

  // ── Select composition ─────────────────────────────────────
  const composition = await selectComposition({
    serveUrl: bundled,
    id: "VideoProject",
    inputProps: { project },
  });

  // ── Render ─────────────────────────────────────────────────
  console.log(`🎬 Rendering to: ${outputPath}`);
  console.log(
    `   ${project.metadata.width}×${project.metadata.height} @ ${project.metadata.fps}fps, ` +
      `${project.metadata.totalDurationSec}s`
  );

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: "h264",
    outputLocation: outputPath,
    inputProps: { project },
    concurrency,
    verbose,
    onProgress: ({ progress }) => {
      const pct = Math.round(progress * 100);
      process.stdout.write(`\r   Progress: ${pct}%`);
    },
  });

  console.log(`\n✅ Done! Output: ${outputPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
