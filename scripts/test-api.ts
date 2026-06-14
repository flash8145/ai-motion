import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { loadEnvFile } from "process";

try {
  loadEnvFile();
} catch (e) {}

console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY prefix:", process.env.GEMINI_API_KEY?.substring(0, 5));

async function testOpenAICompatibility() {
  console.log("\nTesting OpenAI Compatibility Layer...");
  try {
    const client = new OpenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    });
    
    // Test with different models
    const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.5-flash"];
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await client.chat.completions.create({
          model: model,
          messages: [{ role: "user", content: "Hi" }]
        });
        console.log(`Success with ${model}:`, response.choices[0].message.content);
        break;
      } catch (err: any) {
        console.error(`Failed with ${model}:`, err.message || err);
      }
    }
  } catch (err: any) {
    console.error("OpenAI Compatibility initialization/test failed:", err);
  }
}

async function testGoogleGenAI() {
  console.log("\nTesting @google/genai SDK...");
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hi"
    });
    console.log("Success with @google/genai:", response.text);
  } catch (err: any) {
    console.error("Failed with @google/genai:", err.message || err);
  }
}

async function run() {
  await testOpenAICompatibility();
  await testGoogleGenAI();
}

run();
