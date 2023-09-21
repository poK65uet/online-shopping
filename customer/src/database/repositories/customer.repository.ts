import { APIError, STATUS_CODES } from "../../utils";
import { Address, Customer } from "../models";

export interface WishlistProductPayload {
	_id: string;
	name: string;
	description: string;
	banner: string;
	price: number;
	available: boolean;
}

export interface CartProductPayload {
	_id: string;
	name: string;
	banner: string;
	price: number;
}

export interface CartItem {
	product: CartProductPayload;
	unit: number;
}

export interface OrderPayload {
	_id: string;
	amount: number;
	date: Date;
}

class CustomerRepository {
	async createCustomer({ email, password, phone, salt }: any) {
		try {
			const newCustomer = await Customer.create({
				email,
				password,
				phone,
				salt
			});
			return newCustomer;
		} catch (error) {
			throw error;
		}
	}

	async findCustomerByEmail(email: string) {
		try {
			const existingCustomer = await Customer.findOne({ email });
			return existingCustomer;
		} catch (error) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_SERVER_ERROR,
				"Unable to Find Customer"
			);
		}
	}

	async findCustomerById(id: string) {
		try {
			const existingCustomer = await Customer.findById(id).populate("address");
			return existingCustomer;
		} catch (error) {}
	}

	async createAddress(id: string, { street, postalCode, city, country }: any) {
		try {
			const existingCustomer = await Customer.findById(id);
			if (existingCustomer) {
				const newAddress = await Address.create({
					street,
					postalCode,
					city,
					country
				});
				existingCustomer.address.push(newAddress);
				return await existingCustomer.save();
			}
		} catch (error) {}
	}

	async getWishlist(id: string) {
		try {
			const existingCustomer = await Customer.findById(id);
			return existingCustomer ? existingCustomer.wishlist : null;
		} catch (error) {}
	}

	async addToWishlist(id: string, productPayload: WishlistProductPayload) {
		const {
			_id: productId,
			name,
			description,
			banner,
			price,
			available
		} = productPayload;
		const product = {
			_id: productId,
			name,
			description,
			banner,
			price,
			available
		};

		try {
			const existingCustomer = await Customer.findById(id);
			if (existingCustomer) {
				const existingProduct = existingCustomer.wishlist.some(
					(productItem: WishlistProductPayload) => {
						return productItem._id === productId;
					}
				);
				if (existingProduct) return existingCustomer;
				else {
					existingCustomer.wishlist.push(product);
					return await existingCustomer.save();
				}
			}
		} catch (error) {
			throw new APIError("Unable to add to wishlist!");
		}
	}

	async removeFromWishlist(id: string, product: any) {
		try {
			const existingCustomer = await Customer.findById(id);
			if (existingCustomer) {
				existingCustomer.wishlist = existingCustomer.wishlist.filter(
					(productItem: any) => {
						return productItem._id !== product._id;
					}
				);
				return await existingCustomer.save();
			}
		} catch (error) {
			throw new APIError("Unable to remove from wishlist!");
		}
	}

	async manageCart(
		id: string,
		productPayload: CartProductPayload,
		quantity: number,
		isRemove: boolean
	) {
		try {
			const { _id: productId, name, banner, price } = productPayload;
			const cartItem: CartItem = {
				product: {
					_id: productId,
					name,
					banner,
					price
				},
				unit: quantity
			};

			const existingCustomer = await Customer.findById(id);
			if (existingCustomer) {
				const existingProductIdx = existingCustomer.cart.findIndex(
					(cartItem: CartItem) => cartItem.product._id === productId
				);

				if (existingProductIdx > -1) {
					if (isRemove) {
						existingCustomer.cart.splice(existingProductIdx, 1);
						return await existingCustomer.save();
					} else {
						existingCustomer.cart[existingProductIdx].unit = quantity;
						return await existingCustomer.save();
					}
				} else {
					if (isRemove) return existingCustomer;
					else {
						existingCustomer.cart.push(cartItem);
						return await existingCustomer.save();
					}
				}
			}
		} catch (error) {
			throw new APIError("Unable to modify cart!");
		}
	}

	async getOrders(id: string) {
		try {
			const existingCustomer = await Customer.findById(id);
			return existingCustomer ? existingCustomer.orders : null;
		} catch (error) {
			throw new APIError("Unable to get orders!");
		}
	}

	async addOrder(id: string, orderPayload: OrderPayload) {
		try {
			const { _id: orderId, amount, date } = orderPayload;
			const order = {
				_id: orderId,
				amount,
				date
			};
			const existingCustomer = await Customer.findById(id);
			if (existingCustomer) {
				existingCustomer.orders.push(order);
				existingCustomer.cart = [];
				return await existingCustomer.save();
			}
		} catch (error) {
			throw new APIError("Unable to add order!");
		}
	}
}

export { CustomerRepository };
