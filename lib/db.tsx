import mongoose from "mongoose";

// Connection
const DatabaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};
export default DatabaseConnection;
