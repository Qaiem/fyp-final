import { GoogleGenerativeAI } from "@google/generative-ai";
import Task from "../models/taskModel.js";
import dotenv from "dotenv";

dotenv.config();

// Ensure API Key exists
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const predictDeadline = async (req, res) => {
  try {
    const { taskId } = req.params;
    console.log(`🤖 Analyzing task: ${taskId}`);

    // 1. Fetch Task Metadata & Screenshots from DB
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 2. Process Screenshots (Convert Buffer to Base64)
    let imageParts = [];
    if (task.screenshots && task.screenshots.length > 0) {
      imageParts = task.screenshots.map((s) => {
        try {
          // If s.data is a Buffer (standard for Mongo Binary), convert to base64
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
      }).filter(Boolean); // Remove failed conversions
    }

    console.log(`📸 Found ${imageParts.length} screenshots for analysis.`);

    // 3. Initialize Gemini Model (Use Flash for speed/availability)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Construct Prompt
    const prompt = `
      You are a Project Management AI.
      
      Task Details:
      - Title: "${task.title}"
      - Description: "${task.description || "No description provided."}"
      - Current Stage: "${task.stage}"
      - Priority: "${task.priority}"
      
      Instructions:
      Analyze the attached screenshots (if any) which show the user's recent screen activity on this task.
      Based on the task details and visual progress:
      1. Estimate a realistic completion deadline (e.g., "2 days", "Today by 5 PM").
      2. Write a brief progress report (max 2 sentences) describing what seems to be happening.
      
      Output exactly this JSON format:
      {
        "deadline": "string",
        "report": "string"
      }
    `;

    // 5. Call Gemini API
    // Note: If no images, we just send the text prompt.
    const contentParts = [prompt, ...imageParts];
    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();

    // 6. Parse JSON Response
    // Clean up markdown code blocks if Gemini adds them (e.g. ```json ... ```)
    const cleanText = text.replace(/```json|```/g, "").trim();
    
    let prediction;
    try {
      prediction = JSON.parse(cleanText);
    } catch (e) {
      // Fallback if Gemini returns raw text instead of JSON
      console.error("Failed to parse JSON, using raw text", text);
      prediction = {
        deadline: "See report",
        report: text.substring(0, 100) + "..."
      };
    }

    console.log("✅ Prediction success:", prediction);
    res.status(200).json(prediction);

  } catch (error) {
    console.error("🔥 Gemini Prediction Error:", error);
    
    // Check for specific Google API errors
    if (error.message?.includes("User location is not supported")) {
        return res.status(403).json({ message: "Gemini API is not available in your server's region." });
    }

    res.status(500).json({ 
        message: "AI Analysis failed.", 
        error: error.message 
    });
  }
};