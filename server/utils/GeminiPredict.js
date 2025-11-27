// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const predictDeadline = async (screenshots, projectDetails) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const imageParts = screenshots.map((screenshot) => ({
//       inlineData: { data: screenshot, mimeType: "image/png" },
//     }));

//     const prompt = `
//       Analyze these screenshots and project details to estimate the project deadline.
//       Project details: ${JSON.stringify(projectDetails)}
//       Consider productivity and activity in screenshots.
//       Return the predicted deadline in days or date format.
//     `;

//     const result = await model.generateContent([prompt, ...imageParts]);
//     return result.response.text();
//   } catch (error) {
//     console.error("Gemini Prediction Error:", error);
//     throw error;
//   }
// };
