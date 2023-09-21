import dotenv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
	const configFile = `./.env.${process.env.NODE_ENV}`;
	dotenv.config({ path: configFile });
} else {
	dotenv.config();
}

const config = {
	PORT: process.env.PORT || 3000,
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET || "secret",
	API_GATEWAY_URL: process.env.API_GATEWAY_URL,
	RABBITMQ_URL: process.env.RABBITMQ_URL!,
	CUSTOMER_QUEUE: process.env.CUSTOMER_QUEUE!,
	SHOPPING_QUEUE: process.env.SHOPPING_QUEUE!,
	PRODUCT_QUEUE: process.env.PRODUCT_QUEUE!
};

export default config;
