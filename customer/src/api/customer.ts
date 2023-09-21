import { Application, NextFunction, Request, Response } from "express";
import { CustomerService } from "../services";
import { authenticate } from "./middlewares/auth";
import { Channel } from "amqplib";
import { subscribeToQueue } from "../utils";
import config from "../config";

const customerService = new CustomerService();

export default (app: Application, channel: Channel) => {
	subscribeToQueue(channel, config.CUSTOMER_QUEUE, customerService);

	app.post(
		"/signup",
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { email, password, phone } = req.body;
				const data = await customerService.signUp({ email, password, phone });
				return res.status(201).json(data);
			} catch (error) {
				next(error);
			}
		}
	);

	app.post(
		"/login",
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { email, password } = req.body;
				const data = await customerService.signIn({ email, password });
				return res.status(200).json(data);
			} catch (error) {
				next(error);
			}
		}
	);

	app.get(
		"/profile",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const data = await customerService.getProfile(id);
				return res.status(200).json(data);
			} catch (error) {
				next(error);
			}
		}
	);

	app.post(
		"/address",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const { street, postalCode, city, country } = req.body;
				const data = await customerService.addAddress(id, {
					street,
					postalCode,
					city,
					country
				});
				return res.status(201).json(data);
			} catch (error) {
				next(error);
			}
		}
	);

	app.get(
		"/wishlist",
		authenticate,
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const { id } = req.user!;
				const data = await customerService.getWishlist(id);
				return res.status(200).json(data);
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
				const data = await customerService.subscribeToEvent(event, payload);
				return res.status(200).json(data);
			} catch (error) {
				next(error);
			}
		}
	);
};
