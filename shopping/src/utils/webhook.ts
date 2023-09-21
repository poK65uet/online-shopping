import axios from "axios";
import config from "../config";

const publishCustomerEvent = async (event: string, payload: any) => {
	try {
		const { data } = await axios.post(
			`${config.API_GATEWAY_URL}/customer/events?event=${event}`,
			payload
		);
		return data;
	} catch (error) {
		throw error;
	}
};

export { publishCustomerEvent };
