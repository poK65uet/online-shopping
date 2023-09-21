import mongoose, { Document, Schema } from "mongoose";

interface Item {
	product: {
		_id: string;
		name: string;
		banner: string;
		price: number;
	};
	unit: number;
}

interface IOrder extends Document {
	customerId: string;
	amount: Number;
	items: Item[];
	status: string;
	txnId: string;
}

const OrderSchema = new Schema<IOrder>(
	{
		customerId: {
			type: String,
			required: true
		},
		amount: {
			type: Number,
			required: true
		},
		status: {
			type: String,
			enum: ["pending", "completed"],
			default: "pending"
		},
		txnId: {
			type: String
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

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export { Order, IOrder };
