import { GoogleGenerativeAI } from "@google/generative-ai";
import Task from "../models/taskModel.js";
import dotenv from "dotenv";

dotenv.config();

console.log("---------------------------------------------------");
console.log("🔑 DEBUG CHECK:");
if (process.env.GEMINI_API_KEY) {
  console.log("✅ Key found: ", process.env.GEMINI_API_KEY.slice(0, 5) + "...");
} else {
  console.log("❌ CRITICAL: No API Key found in process.env!");
}
console.log("---------------------------------------------------");

// Initialize globally
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const predictDeadline = async (req, res) => {
  try {
    const { taskId } = req.params;
    console.log(`🤖 Analyzing task: ${taskId}`);

    // 0. Security Check: Validate API Key
    if (!process.env.GEMINI_API_KEY) {
      console.error(
        "❌ CRITICAL: GEMINI_API_KEY is missing from environment variables."
      );
      return res
        .status(500)
        .json({ message: "Server AI configuration error." });
    }

    // 1. Fetch Task Metadata & Screenshots from DB
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2. Process Screenshots (Convert Buffer to Base64)
    // ✅ FIX 1: Added 'const' declaration here
    const imageParts = task.screenshots.map((s) => {
      // Debug log
      console.log(
        `Processing image: ${s.contentType}, Size: ${
          s.data ? s.data.length : 0
        }`
      );

      const base64Data = Buffer.from(s.data).toString("base64");
      return {
        inlineData: {
          data: base64Data,
          // Fallback to png if contentType is undefined in DB
          mimeType: s.contentType || "image/png",
        },
      };
    });

    console.log(`📸 Found ${imageParts.length} screenshots.`);

    // 3. Initialize Gemini Model
    // ✅ FIX 2: Used 'getGenerativeModel' instead of 'getModel'
    // ✅ FIX 3: Updated model to standard 'gemini-1.5-flash'
    // 3. Initialize Gemini Model
    const model = genAI.getGenerativeModel({
      // ❌ OLD: model: "gemini-1.5-flash-001",
      // ✅ NEW: Use the current recommended model for multimodal tasks
      model: "gemini-2.5-flash",
    });

    // 4. Construct Prompt
    const promptText = `
      You are a Project Management AI.
      
      Task Details:
      - Title: "${task.title}"
      - Description: "${task.description || "No description provided."}"
      - Current Stage: "${task.stage}"
      - Priority: "${task.priority}"
      
      Instructions:
      Analyze the attached screenshots (if any) which show the user's recent screen activity.
      Based on the task details and visual progress:
      1. Estimate a realistic completion deadline (e.g., "2 days", "Today by 5 PM").
      2. Write a brief progress report (max 2 sentences).
      
      Output exactly this JSON format:
      {
        "deadline": "string",
        "report": "string"
      }
    `;

    // 5. Call Gemini API
    const contentParts = [{ text: promptText }, ...imageParts];

    console.log("🚀 Sending request to Gemini...");

    // Simple array format is preferred by the SDK
    const result = await model.generateContent(contentParts);

    const response = await result.response;
    const text = response.text();

    console.log("🤖 Gemini Raw Response:", text);

    // 6. Parse JSON Response
    const cleanText = text.replace(/```json|```/g, "").trim();

    let prediction;
    try {
      prediction = JSON.parse(cleanText);
    } catch (e) {
      console.error("Failed to parse JSON, using fallback.");
      prediction = {
        deadline: "Review manually",
        report: cleanText.substring(0, 150),
      };
    }

    console.log("✅ Prediction success:", prediction);
    res.status(200).json(prediction);
  } catch (error) {
    console.error("🔥 Gemini Prediction Error:", error);
    res.status(500).json({
      message: "AI Analysis failed.",
      error: error.message,
    });
  }
};
