import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
	name: string;
	desc: string;
	banner: string;
	type: string;
	unit: number;
	price: number;
	available: boolean;
	supplier: string;
}

const ProductSchema = new Schema<IProduct>(
	{
		name: {
			type: String,
			required: true
		},
		desc: String,
		banner: String,
		type: String,
		unit: Number,
		price: Number,
		available: {
			type: Boolean,
			default: true
		},
		supplier: String
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

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export { Product, IProduct };
