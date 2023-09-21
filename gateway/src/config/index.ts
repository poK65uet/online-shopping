import dotenv from "dotenv";

if (process.env.NODE_ENV !== "prod") {
	const configFile = `./.env.${process.env.NODE_ENV}`;
	dotenv.config({ path: configFile });
} else {
	dotenv.config();
}

const config = {
	PORT: process.env.PORT!,
	CUSTOMER_SERVICE_URL: process.env.CUSTOMER_SERVICE_URL!,
	PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL!,
	SHOPPING_SERVICE_URL: process.env.SHOPPING_SERVICE_URL!
};

export default config;
