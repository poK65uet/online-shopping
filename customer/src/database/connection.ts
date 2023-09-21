import mongoose from "mongoose";
import config from "../config";

const connectDB = async () => {
	try {
		await mongoose.connect(config.MONGO_URI as string);
		console.log("MongoDB connected");
	} catch (error) {
		console.log("Error ============");
		console.log(error);
		process.exit(1);
	}
};

export { connectDB };
