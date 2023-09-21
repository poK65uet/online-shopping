import amqplib from "amqplib";
import config from "../config";

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
		channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
	} catch (error) {
		throw error;
	}
};

const subscribeToQueue = async (channel: any, queueName: string) => {
	try {
		await channel.assertQueue(queueName);
		channel.consume(queueName, (msg: any) => {
			if (msg !== null) {
				console.log(`Message received: ${msg.content.toString()}`);
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
