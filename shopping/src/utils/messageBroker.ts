import amqplib from "amqplib";
import config from "../config";
import { OrderService } from "../services";

const createChannel = async () => {
	try {
		const connection = await amqplib.connect(config.RABBITMQ_URL);
		const channel = await connection.createChannel();
		return channel;
	} catch (error) {
		throw error;
	}
};

const publishToQueue = async (channel: any, queueName: string, data: any) => {
	try {
		await channel.assertQueue(queueName);
		await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
	} catch (error) {
		throw error;
	}
};

const subscribeToQueue = async (
	channel: any,
	queueName: string,
	service: OrderService
) => {
	try {
		await channel.assertQueue(queueName);
		channel.consume(queueName, async (msg: any) => {
			if (msg !== null) {
				const data = JSON.parse(msg.content.toString());
				// console.log(`Message received: ${msg.content.toString()}`);
				await service.subscribeToEvent(data.event, data.payload);
				channel.ack(msg);
			} else {
				console.log("Message is null");
			}
		});
	} catch (error) {
		throw error;
	}
};

export { createChannel, publishToQueue, subscribeToQueue };
