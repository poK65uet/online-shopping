import mongoose from "mongoose";

interface IAddress {
	street: string;
	postalCode: string;
	city: string;
	country: string;
}

const AddressSchema = new mongoose.Schema<IAddress>(
	{
		street: String,
		postalCode: String,
		city: String,
		country: {
			type: String,
			required: true
		}
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

const Address = mongoose.model<IAddress>("Address", AddressSchema);

export { Address, IAddress };
