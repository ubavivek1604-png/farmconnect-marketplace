import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: 'customer' | 'farmer' | 'admin';
  phone: string;
  address?: string;
  farmLocation?: {
    farmName?: string;
    description?: string;
    city?: string;
    state?: string;
    address?: string;
    lat: number;
    lng: number;
    experienceYears?: number;
    organicCertified?: boolean;
  };
  profileImage?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'farmer', 'admin'], default: 'customer' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    farmLocation: {
      farmName: { type: String },
      description: { type: String },
      city: { type: String },
      state: { type: String },
      address: { type: String },
      lat: { type: Number, default: 18.5204 },
      lng: { type: Number, default: 73.8567 },
      experienceYears: { type: Number, default: 5 },
      organicCertified: { type: Boolean, default: true }
    },
    profileImage: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
