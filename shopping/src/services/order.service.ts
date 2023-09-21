import { OrderRepository } from "../database";
import { formateData } from "../utils";

class OrderService {
	private readonly repository: OrderRepository;

	constructor() {
		this.repository = new OrderRepository();
	}

	async getCart(customerId: string) {
		try {
			const result = await this.repository.getCart(customerId);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async getOrder(customerId: string) {
		try {
			const result = await this.repository.getOrders(customerId);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async createOrder(customerId: string, txnId: string) {
		try {
			const result = await this.repository.createOrder(customerId, txnId);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async addToCart(id: string, product: any, quantity: number) {
		try {
			const result = await this.repository.manageCart(
				id,
				product,
				quantity,
				false
			);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async removeFromCart(id: string, product: any) {
		try {
			const result = await this.repository.manageCart(id, product, 0, true);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	public async getOrderPayload(userId: string, order: any) {
		try {
			const payload = {
				userId,
				order
			};
			return formateData(payload);
		} catch (error) {
			throw error;
		}
	}

	async getOrderMessagePayload(userId: string, event: string, order: any) {
		try {
			const payload = {
				event,
				payload: {
					userId,
					order
				}
			};
			return formateData(payload);
		} catch (error) {
			throw error;
		}
	}

	async subscribeToEvent(event: any, payload: any) {
		try {
			let result;
			const { userId, product, quantity } = payload;
			switch (event) {
				case "ADD_TO_CART":
					result = await this.addToCart(userId, product, quantity);
					break;
				case "REMOVE_FROM_CART":
					result = await this.removeFromCart(userId, product);
					break;
				default:
					console.log("Event not found");
			}
			return result;
		} catch (error) {
			throw error;
		}
	}
}

export { OrderService };
