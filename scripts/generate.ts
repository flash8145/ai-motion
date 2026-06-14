import { generateSceneGraph } from "../src/ai/SceneGraphGenerator";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve } from "path";
import { loadEnvFile } from "process";

try {
  loadEnvFile();
} catch (e) {
  // Ignore if .env is not present or unsupported
}


async function main() {
  const brief = process.argv[2];
  const providerArg = process.argv[3];
  
  if (!brief) {
    console.error("Usage: npx tsx scripts/generate.ts 'Your video brief' [openai|gemini]");
    process.exit(1);
  }

  let provider: "openai" | "gemini";
  if (providerArg === "openai" || providerArg === "gemini") {
    provider = providerArg;
  } else {
    provider = process.env.GEMINI_API_KEY ? "gemini" : "openai";
  }
  
  console.log(`🎬 Generating scene graph using ${provider === "gemini" ? "Gemini" : "ChatGPT/OpenAI"} API...`);
  
  try {
    const result = await generateSceneGraph({
      brief,
      style: "apple",
      duration: 15,
      aspectRatio: "16:9",
      provider
    });
    
    if (result.wasRepaired) {
      console.log("⚠️  Scene graph was auto-repaired due to validation issues:");
      result.repairLog?.forEach(e => console.log(`  - ${e}`));
    } else {
      console.log("✨ Scene graph generated with zero validation errors.");
    }
    
    const outputDir = resolve("scene-graphs");
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = resolve(
      outputDir, 
      `generated-${Date.now()}.json`
    );
    
    writeFileSync(outputPath, JSON.stringify(result.project, null, 2));
    console.log(`✅ Scene graph written to: ${outputPath}`);
    console.log(`\nTo render this composition, run:`);
    console.log(`  npx tsx scripts/render.ts ${outputPath}`);
  } catch (error) {
    console.error("❌ Generation failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
