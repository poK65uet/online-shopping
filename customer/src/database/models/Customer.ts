import mongoose, { Document, Schema } from "mongoose";
import { IAddress } from ".";

interface IProduct {
	_id: string;
	name: string;
	banner: string;
	price: number;
}

interface IProductDetail extends IProduct {
	description: string;
	available: boolean;
}

interface ICartProduct {
	product: IProduct;
	unit: number;
}

interface IOrder {
	_id: string;
	amount: number;
	date: Date;
}

interface ICustomer extends Document {
	email: string;
	password: string;
	salt: string;
	phone: string;
	address: IAddress[];
	wishlist: IProductDetail[];
	cart: ICartProduct[];
	orders: IOrder[];
}

const CustomerSchema = new Schema<ICustomer>(
	{
		email: {
			type: String,
			required: true,
			unique: true
		},
		password: {
			type: String,
			required: true
		},
		salt: {
			type: String,
			required: true
		},
		phone: String,
		address: [
			{
				type: Schema.Types.ObjectId,
				ref: "Address"
			}
		],
		wishlist: [
			{
				_id: String,
				name: String,
				description: String,
				banner: String,
				price: Number,
				available: Boolean
			}
		],
		cart: [
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
		],
		orders: [
			{
				_id: String,
				amount: Number,
				date: {
					type: Date,
					default: Date.now()
				}
			}
		]
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret, options) {
				delete ret.password;
				delete ret.salt;
				delete ret.__v;
				delete ret.createdAt;
				delete ret.updatedAt;
				return ret;
			}
		}
	}
);

const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);

export { Customer, ICustomer, ICartProduct };
