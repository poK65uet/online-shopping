import express from "express";
import { productApi } from "./api";
import { TokenPayload, createChannel, handlerError } from "./utils";

declare global {
	namespace Express {
		interface Request {
			user?: TokenPayload;
		}
	}
}

const createApp = async () => {
	const channel = await createChannel();
	console.log(channel);
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(__dirname + "/public"));

	app.get("/test", (req, res) => {
		res.json({ message: "Product Service!" });
	});

	productApi(app, channel);
	app.use(handlerError);

	return app;
};

export { createApp };
