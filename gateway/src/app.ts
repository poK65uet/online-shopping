import express from "express";
import proxy from "express-http-proxy";
import config from "./config";
import { handlerError } from "./utils";

const createApp = async () => {
	const app = express();

	app.use(express.json());
	
	app.use("/api/customer", proxy(config.CUSTOMER_SERVICE_URL));
	app.use("/api/product", proxy(config.PRODUCT_SERVICE_URL));
	app.use("/api/shopping", proxy(config.SHOPPING_SERVICE_URL));

	app.use(handlerError);

	return app;
};

export { createApp };
