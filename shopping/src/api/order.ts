import { Application, NextFunction, Request, Response } from "express";
import { authenticate } from "./middlewares/auth";
import { OrderService } from "../services";
import { Channel } from "amqplib";
import { publishToQueue, subscribeToQueue } from "../utils";
import config from "../config";

const orderService = new OrderService();

export default (app: Application, channel: Channel) => {
	subscribeToQueue(channel, config.SHOPPING_QUEUE, orderService);

	app.get(
		"/cart",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const data = await orderService.getCart(id);
				res.status(200).send(data);
			} catch (error) {
				next(error);
			}
		}
	);

	app.post(
		"/",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const { txnId } = req.body;
				const data = await orderService.createOrder(id, txnId);
				const { data: payload } = await orderService.getOrderMessagePayload(
					id,
					"ADD_ORDER",
					data.data
				);
				// publishCustomerEvent("ADD_ORDER", payload);
				publishToQueue(channel, config.CUSTOMER_QUEUE, payload);
				res.status(201).send(payload);
			} catch (error) {
				next(error);
			}
		}
	);

	app.get(
		"/",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id: customerId } = req.user!;
				const data = await orderService.getOrder(customerId);
				res.status(200).send(data);
			} catch (error) {
				next(error);
			}
		}
	);

	app.post(
		"/events",
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { event } = req.query;
				const payload = req.body;
				const data = await orderService.subscribeToEvent(event, payload);
				return res.status(200).json(data);
			} catch (error) {
				next(error);
			}
		}
	);
};
