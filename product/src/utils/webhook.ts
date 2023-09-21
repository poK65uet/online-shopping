import axios from "axios";
import config from "../config";

const publishCustomerEvent = async (event: string, payload: any) => {
	try {
		await axios.post(
			`${config.API_GATEWAY_URL}/customer/events?event=${event}`,
			payload
		);
	} catch (error) {
		throw error;
	}
};

const publishShoppingEvent = async (event: string, payload: any) => {
	try {
		await axios.post(
			`${config.API_GATEWAY_URL}/shopping/events?event=${event}`,
			payload
		);
	} catch (error) {
		throw error;
	}
};

export { publishCustomerEvent, publishShoppingEvent };
