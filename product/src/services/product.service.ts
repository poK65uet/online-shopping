import { CreateProductPayload, ProductRepository } from "../database";
import { formateData } from "../utils";

class ProductService {
	private readonly repository: ProductRepository;

	constructor() {
		this.repository = new ProductRepository();
	}

	public async getProducts() {
		try {
			const products = await this.repository.getProducts();
			const categories = products.map((product) => product.type);
			const uniqueCategories = [...new Set(categories)];
			const result = uniqueCategories.map((category) => {
				return {
					category,
					products: products.filter((product) => product.type === category)
				};
			});
			return formateData(result);
		} catch (error) {
			throw error;
		}
	}

	public async getProductById(id: string) {
		try {
			const product = await this.repository.getProductById(id);
			return formateData(product);
		} catch (error) {
			throw error;
		}
	}

	public async getProductsByCategory(category: string) {
		try {
			const products = await this.repository.getProductsByCategory(category);
			return formateData(products);
		} catch (error) {
			throw error;
		}
	}

	public async getSelectedProducts(ids: string[]) {
		try {
			const products = await this.repository.getSelectedProducts(ids);
			return formateData(products);
		} catch (error) {
			throw error;
		}
	}

	public async addProduct(payload: CreateProductPayload) {
		try {
			const newProduct = await this.repository.addProduct(payload);
			return formateData(newProduct);
		} catch (error) {
			throw error;
		}
	}

	public async getProductPayload(
		userId: string,
		product: any,
		quantity?: number
	) {
		try {
			const payload = {
				userId,
				product,
				quantity
			};
			return formateData(payload);
		} catch (error) {
			throw error;
		}
	}

	public async getProductMessagePayload(
		userId: string,
		event: string,
		product: any,
		quantity?: number
	) {
		try {
			const payload = {
				event,
				payload: {
					userId,
					product,
					quantity
				}
			};
			return formateData(payload);
		} catch (error) {
			throw error;
		}
	}
}

export { ProductService };
