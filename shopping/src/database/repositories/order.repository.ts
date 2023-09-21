import { Cart, Order } from "../models";

class OrderRepository {
	async getCart(customerId: string) {
		try {
			const cart = await Cart.findOne({ customerId });
			return cart;
		} catch (error) {
			throw error;
		}
	}
	async getOrders(customerId: string) {
		try {
			const orders = await Order.find({ customerId });
			return orders;
		} catch (error) {
			throw error;
		}
	}

	async manageCart(
		customerId: string,
		product: any,
		quantity: number,
		isRemove: boolean
	) {
		try {
			const { _id: productId, name, banner, price } = product;
			const cartItem = {
				product: {
					_id: productId,
					name,
					banner,
					price
				},
				unit: quantity
			};
			const existingCustomer = await Cart.findOne({ customerId });
			if (existingCustomer) {
				const existingProductIdx = existingCustomer.items.findIndex(
					(cartItem: any) => cartItem.product._id === productId
				);
				if (existingProductIdx > -1) {
					if (isRemove) {
						existingCustomer.items.splice(existingProductIdx, 1);
						return await existingCustomer.save();
					} else {
						existingCustomer.items[existingProductIdx].unit = quantity;
						return await existingCustomer.save();
					}
				} else {
					if (isRemove) return existingCustomer;
					else {
						existingCustomer.items.push(cartItem);
						return await existingCustomer.save();
					}
				}
			} else {
				if (isRemove) return existingCustomer;
				else {
					const newCart = await Cart.create({
						customerId,
						items: [cartItem]
					});
					return newCart;
				}
			}
		} catch (error) {
			throw error;
		}
	}

	async createOrder(customerId: string, txnId: string) {
		try {
			const cart = await this.getCart(customerId);

			if (cart && cart.items.length > 0) {
				const items = cart.items;
				const amount = items.reduce(
					(total: number, item: any) => total + item.product.price * item.unit,
					0
				);
				const newOrder = await Order.create({
					customerId,
					amount,
					items,
					txnId
				});
				cart.items = [];
				await cart.save();
				return newOrder;
			}
		} catch (error) {
			throw error;
		}
	}
}

export { OrderRepository };
