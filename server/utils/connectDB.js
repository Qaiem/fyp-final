import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    // 1. Log to confirm the variable is actually being read
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI is undefined. Check your .env file!");
    }

    // 2. Set strictQuery to avoid warnings (optional)
    mongoose.set("strictQuery", false);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail after 5 seconds instead of 30
    });
    console.log("Database Connected");
  } catch (error) {
    console.log("DB Error: " + error);
  }
};

export default dbConnection;
