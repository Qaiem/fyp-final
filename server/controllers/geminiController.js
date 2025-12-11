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

// Initialize globally, but we will check validity inside the request
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
    let imageParts = [];
    if (task.screenshots && task.screenshots.length > 0) {
      imageParts = task.screenshots
        .map((s) => {
          try {
            const base64Data = Buffer.from(s.data).toString("base64");
            return {
              inlineData: {
                data: base64Data,
                mimeType: s.contentType || "image/png",
              },
            };
          } catch (err) {
            console.error("Error converting screenshot:", err);
            return null;
          }
        })
        .filter(Boolean);
    }

    console.log(`📸 Found ${imageParts.length} screenshots.`);

    // 3. Initialize Gemini Model
    // ✅ CORRECT: This model supports images AND is now enabled on your account.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
    // ⚡ FIX: Wrap the text prompt in an object. Do not pass raw strings in the array.
    const contentParts = [{ text: promptText }, ...imageParts];

    console.log("🚀 Sending request to Gemini...");
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: contentParts,
        },
      ],
    });

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
        report: cleanText.substring(0, 150), // Fallback to raw text
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
