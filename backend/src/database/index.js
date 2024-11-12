import mongoose from "mongoose";
const DB_NAME = process.env.DB_NAME;

const connectDB = async () => {
  try {
    if (!DB_NAME) throw error("db name not found!!!");
    mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);

    const connectionInstance = mongoose.connection;

    connectionInstance.on("connected", () => {
      console.log(
        `\nDatabase connected!! DB_HOST -> ${connectionInstance.host}`
      );
    });

    connectionInstance.on("error", (error) => {
      console.error("MongoDb connection FAILED", error);
      throw error;
    });
  } catch (error) {
    console.error("Error connecting to database", error);
    throw error;
  }
};

export default connectDB;
