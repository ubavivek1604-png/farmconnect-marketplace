import mongoose, { Document, Schema } from 'mongoose';

export type ProductCategory = 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Dairy' | 'Organic Produce';
export type ProductUnit = 'kg' | 'dozen' | 'litre' | 'piece' | 'bunch' | 'quintal';

export interface IProduct extends Document {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  quantity: number;
  images: string[];
  farmerId: mongoose.Types.ObjectId | string;
  farmerName?: string;
  location: {
    farmName?: string;
    city?: string;
    state?: string;
    address?: string;
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  isOrganic: boolean;
  harvestDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic Produce']
    },
    price: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'dozen', 'litre', 'piece', 'bunch', 'quintal'],
      default: 'kg'
    },
    quantity: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, default: '' },
    location: {
      farmName: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      address: { type: String, default: '' },
      lat: { type: Number, default: 18.5204 },
      lng: { type: Number, default: 73.8567 }
    },
    isAvailable: { type: Boolean, default: true },
    isOrganic: { type: Boolean, default: false },
    harvestDate: { type: String }
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', category: 1 });

export const ProductModel = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
