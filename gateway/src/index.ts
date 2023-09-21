import { createApp } from "./app";
import config from "./config";

const startServer = async () => {
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
