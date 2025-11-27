// import { predictDeadline as geminiPredict } from "../utils/GeminiPredict.js";
// import Task from "../models/taskModel.js"; // Assuming you have a Task model

// export const predictController = async (req, res) => {
//   try {
//     const { taskId } = req.body;
//     if (!taskId) return res.status(400).json({ success: false, message: "Task ID missing" });

//     // Fetch screenshots from DB
//     const task = await Task.findById(taskId).select("screenshots");
//     if (!task?.screenshots?.length)
//       return res.status(400).json({ success: false, message: "No screenshots found" });

//     // Convert Buffer to base64 (if stored as Buffer in DB)
//     const screenshotsBase64 = task.screenshots.map((s) => {
//       const buffer = s.data;
//       const uint8Array = new Uint8Array(buffer.data);
//       let binary = "";
//       for (let i = 0; i < uint8Array.length; i++) {
//         binary += String.fromCharCode(uint8Array[i]);
//       }
//       return `data:image/png;base64,${Buffer.from(binary, "binary").toString("base64")}`;
//     });

//     const prediction = await geminiPredict(screenshotsBase64, { taskId });

//     res.json({ success: true, prediction });
//   } catch (err) {
//     console.error("Prediction Error:", err);
//     res.status(500).json({ success: false, message: "Prediction failed" });
//   }
// };

// import { predictDeadline as geminiPredict } from "../utils/GeminiPredict.js";
// import Task from "../models/taskModel.js"; // Your Task model

// export const predictController = async (req, res) => {
//   try {
//     console.log("✅ Predict endpoint hit");
    
//     const { taskId } = req.body;
//     if (!taskId) {
//       console.log("❌ No taskId in request body");
//       return res.status(400).json({ success: false, message: "Task ID missing" });
//     }
//     console.log("Task ID:", taskId);

//     // Fetch screenshots from DB
//     const task = await Task.findById(taskId).select("screenshots");
//     if (!task) {
//       console.log("❌ Task not found");
//       return res.status(404).json({ success: false, message: "Task not found" });
//     }
//     console.log("Task fetched from DB:", task);

//     if (!task.screenshots?.length) {
//       console.log("❌ No screenshots in task");
//       return res.status(400).json({ success: false, message: "No screenshots found" });
//     }

//     // Convert buffers to base64
//     const screenshotsBase64 = task.screenshots.map((s, index) => {
//       try {
//         const buffer = s.data;
//         if (!buffer?.data) throw new Error("Invalid buffer data");
//         const uint8Array = new Uint8Array(buffer.data);
//         let binary = "";
//         for (let i = 0; i < uint8Array.length; i++) {
//           binary += String.fromCharCode(uint8Array[i]);
//         }
//         return `data:image/png;base64,${Buffer.from(binary, "binary").toString("base64")}`;
//       } catch (err) {
//         console.log(`❌ Error converting screenshot #${index}:`, err);
//         return null;
//       }
//     }).filter(Boolean);

//     console.log("Screenshots converted:", screenshotsBase64.length);

//     // Call Gemini
//     const prediction = await geminiPredict(screenshotsBase64, { taskId });
//     console.log("Gemini prediction:", prediction);

//     res.json({ success: true, prediction });
//   } catch (err) {
//     console.error("🔥 Prediction Error:", err);
//     res.status(500).json({ success: false, message: "Prediction failed", error: err.message });
//   }
// };
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const predictDeadline = async (req, res) => {
  const { taskId } = req.params;
  console.log("Predicting deadline for task ID:", taskId);
  const { title, description, stage, screenshots } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  const prompt = `
  Task title: ${title}
  Description: ${description}
  Current stage: ${stage}
  Analyze screenshots and suggest the likely completion time and report progress.
  `;

  const result = await model.generateContent([
    prompt,
    ...screenshots.map((img) => ({
      inlineData: { data: img.split(",")[1], mimeType: "image/png" },
    })),
  ]);

  res.json({
    report: result.response.text(),
    deadline: "Estimated in 3 days (example)",
  });
};
