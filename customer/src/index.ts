import { createApp } from "./app";
import config from "./config";
import { connectDB } from "./database";

const startServer = async () => {
	await connectDB();
	const app = await createApp();

	app
		.listen(config.PORT, () => {
			console.clear();
			console.log(`Server running on port ${config.PORT}`);
		})
		.on("error", (err) => {
			console.log(err);
			process.exit(1);
		});
};

startServer();
