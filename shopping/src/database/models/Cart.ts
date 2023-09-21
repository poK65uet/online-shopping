import mongoose, { Document, Schema } from "mongoose";

interface IProduct {
	_id: string;
	name: string;
	banner: string;
	price: number;
}

interface ICart extends Document {
	customerId: string;
	items: {
		product: IProduct;
		unit: number;
	}[];
}

const CartSchema = new Schema<ICart>(
	{
		customerId: {
			type: String,
			required: true
		},
		items: [
			{
				product: {
					_id: String,
					name: String,
					banner: String,
					price: Number
				},
				unit: {
					type: Number,
					required: true
				}
			}
		]
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret, options) {
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
				return ret;
			}
		}
	}
);

const Cart = mongoose.model<ICart>("Cart", CartSchema);

export { Cart, ICart };
