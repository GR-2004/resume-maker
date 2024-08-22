import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO}`);
  } catch (error) {
    console.log("MONGODB connection Error: ", error);
    process.exit(1);
  }
};
