import { NextFunction, Request, Response, Application } from "express";
import { ProductService } from "../services";
import { CreateProductPayload } from "../database";
import { authenticate } from "./middlewares/auth";
import {
	publishCustomerEvent,
	publishShoppingEvent,
	publishToQueue
} from "../utils";
import { Channel } from "amqplib";
import config from "../config";

const productService = new ProductService();

export default (app: Application, channel: Channel) => {
	app.get("/", async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await productService.getProducts();
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	});

	app.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const data = await productService.getProductById(id);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	});

	app.post("/ids", async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { ids } = req.body;
			const data = await productService.getSelectedProducts(ids);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	});

	app.post("/", async (req: Request, res: Response, next: NextFunction) => {
		try {
			const payload = req.body as CreateProductPayload;
			const data = await productService.addProduct(payload);
			res.status(200).json(data);
		} catch (error) {
			next(error);
		}
	});

	app.get(
		"/category/:type",
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { type } = req.params;
				const data = await productService.getProductsByCategory(type);
				res.status(200).json(data);
			} catch (error) {
				next(error);
			}
		}
	);

	app.put(
		"/:id/wishlist",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const { id: productId } = req.params;
				const { data: product } = await productService.getProductById(
					productId
				);
				const { data: payload } = await productService.getProductMessagePayload(
					id,
					"ADD_TO_WISHLIST",
					product
				);
				// await publishCustomerEvent("ADD_TO_WISHLIST", payload);
				await publishToQueue(channel, config.CUSTOMER_QUEUE, payload);
				res.status(200).json(payload);
			} catch (error) {
				next(error);
			}
		}
	);

	app.delete(
		"/:id/wishlist",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const { id: productId } = req.params;
				const { data: product } = await productService.getProductById(
					productId
				);
				const { data: payload } = await productService.getProductMessagePayload(
					id,
					"REMOVE_FROM_WISHLIST",
					product
				);
				// await publishCustomerEvent("REMOVE_FROM_WISHLIST", payload);
				await publishToQueue(channel, config.CUSTOMER_QUEUE, payload);
				res.status(200).json(payload);
			} catch (error) {
				next(error);
			}
		}
	);

	app.put(
		"/:id/cart",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const { id: productId } = req.params;
				const { quantity } = req.body;
				const { data: product } = await productService.getProductById(
					productId
				);
				const { data: payload } = await productService.getProductMessagePayload(
					id,
					"ADD_TO_CART",
					product,
					quantity
				);
				// await publishCustomerEvent("ADD_TO_CART", payload);
				// await publishShoppingEvent("ADD_TO_CART", payload);
				await publishToQueue(channel, config.CUSTOMER_QUEUE, payload);
				await publishToQueue(channel, config.SHOPPING_QUEUE, payload);
				res.status(200).json(payload);
			} catch (error) {
				next(error);
			}
		}
	);

	app.delete(
		"/:id/cart",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const { id: productId } = req.params;
				const { data: product } = await productService.getProductById(
					productId
				);
				const { data: payload } = await productService.getProductMessagePayload(
					id,
					"REMOVE_FROM_CART",
					product
				);
				// await publishCustomerEvent("REMOVE_FROM_CART", payload);
				// await publishShoppingEvent("REMOVE_FROM_CART", payload);
				await publishToQueue(channel, config.CUSTOMER_QUEUE, payload);
				await publishToQueue(channel, config.SHOPPING_QUEUE, payload);
				res.status(200).json(payload);
			} catch (error) {
				next(error);
			}
		}
	);
};
