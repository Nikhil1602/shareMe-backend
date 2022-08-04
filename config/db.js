import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connnectDB = () => {
  mongoose.connect(process.env.MONGO_CONNECTION_URL);
  const connection = mongoose.connection;
  try {
    connection.once("open", () => {
      console.log("Database connected !!");
    });
  } catch (err) {
    console.log("Connection failed !!");
  }
};

export default connnectDB;
