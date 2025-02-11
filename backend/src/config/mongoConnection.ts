import mongoose from 'mongoose'

export const connectDB = async (uri: string): Promise<void> => {
try {
	  await mongoose.connect(uri);
	  console.log("Mongo connected successfully!");
	} catch (error) {
	  console.error("Error connecting to MongoDB:", error);
	  process.exit(1);
	}
  };
  