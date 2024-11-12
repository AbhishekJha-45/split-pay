import dotenv from "dotenv";
import connectDB from "./database/index.js";
import app from "./app.js";

dotenv.config();

async function startServer() {
  try {
    await connectDB();
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running on port ${process.env.PORT || 8000}`);
    });
  } catch (err) {
    console.log("MongoDB connection failed !!! ", err);
  }
}

startServer();
