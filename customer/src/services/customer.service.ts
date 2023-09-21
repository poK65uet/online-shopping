import { CustomerRepository } from "../database";

import {
	APIError,
	STATUS_CODES,
	formateData,
	generatePassword,
	generateSalt,
	generateSignature,
	validatePassword
} from "../utils";

class CustomerService {
	private readonly repository: CustomerRepository;

	constructor() {
		this.repository = new CustomerRepository();
	}

	async signUp({ email, password, phone }: any) {
		try {
			const existingCustomer = await this.repository.findCustomerByEmail(email);
			if (!existingCustomer) {
				const salt = await generateSalt();
				const hash = await generatePassword(password, salt);
				const customer = await this.repository.createCustomer({
					email,
					password: hash,
					phone,
					salt
				});
				const token = generateSignature({ id: customer.id, email });
				return formateData({ id: customer.id, token });
			}
			return formateData({ message: "Email already exists" });
		} catch (error) {
			throw error;
		}
	}

	async signIn({ email, password }: any) {
		try {
			const existingCustomer = await this.repository.findCustomerByEmail(email);
			if (existingCustomer) {
				const { salt, password: hash } = existingCustomer;
				const isValidPassword = await validatePassword(password, salt, hash);

				if (isValidPassword) {
					const token = generateSignature({ id: existingCustomer.id, email });
					return formateData({ id: existingCustomer.id, token });
				}
			}
			return formateData(null);
		} catch (error) {
			throw new APIError("Data Not found", STATUS_CODES.NOT_FOUND);
		}
	}

	async getProfile(id: string) {
		try {
			const existingCustomer = await this.repository.findCustomerById(id);
			return formateData(existingCustomer);
		} catch (error) {
			throw error;
		}
	}

	async addAddress(id: string, address: any) {
		try {
			const addressResult = await this.repository.createAddress(id, address);
			return formateData(addressResult);
		} catch (error) {
			throw error;
		}
	}

	async getWishlist(id: string) {
		try {
			const result = await this.repository.getWishlist(id);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async addToWishlist(id: string, product: any) {
		try {
			const result = await this.repository.addToWishlist(id, product);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async removeFromWishlist(id: string, productId: string) {
		try {
			const result = await this.repository.removeFromWishlist(id, productId);
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

	async getOrders(id: string) {
		try {
			const result = await this.repository.getOrders(id);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async createOrder(id: string, order: any) {
		try {
			const result = await this.repository.addOrder(id, order);
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	async subscribeToEvent(event: any, payload: any) {
		try {
			let result;
			const { userId, product, quantity, order } = payload;
			switch (event) {
				case "ADD_TO_WISHLIST":
					result = await this.addToWishlist(userId, product);
					break;
				case "REMOVE_FROM_WISHLIST":
					result = await this.removeFromWishlist(userId, product);
					break;
				case "ADD_TO_CART":
					result = await this.addToCart(userId, product, quantity);
					break;
				case "REMOVE_FROM_CART":
					result = await this.removeFromCart(userId, product);
					break;
				case "ADD_ORDER":
					result = await this.createOrder(userId, order);
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

export { CustomerService };
