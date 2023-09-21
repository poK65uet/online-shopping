import express from "express";
import { shoppingApi } from "./api";

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
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.static(__dirname + "/public"));

	shoppingApi(app, channel);
	app.use(handlerError);

	return app;
};

export { createApp };
