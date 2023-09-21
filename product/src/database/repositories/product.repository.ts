import { Product } from "../models";

interface CreateProductPayload {
	name: string;
	desc: string;
	banner: string;
	type: string;
	unit: number;
	price: number;
	available: boolean;
	supplier: string;
}

class ProductRepository {
	async getProducts() {
		try {
			const products = await Product.find();
			return products;
		} catch (error) {
			throw error;
		}
	}

	async getProductById(id: string) {
		try {
			const product = await Product.findById(id);
			return product;
		} catch (error) {
			throw error;
		}
	}

	async getProductsByCategory(category: string) {
		try {
			const products = await Product.find({ type: category });
			return products;
		} catch (error) {
			throw error;
		}
	}

	async getSelectedProducts(ids: string[]) {
		try {
			const products = await Product.find({ id: { $in: ids } });
			return products;
		} catch (error) {
			throw error;
		}
	}

	async addProduct(payload: CreateProductPayload) {
		try {
			const newProduct = await Product.create(payload);
			return newProduct;
		} catch (error) {
			throw error;
		}
	}
}

export { ProductRepository, CreateProductPayload };
