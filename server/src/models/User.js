import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address'
      ],
      index: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'farmer', 'admin'],
        message: '{VALUE} is not a valid user role'
      },
      default: 'customer',
      index: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    farmLocation: {
      farmName: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
      lat: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90'],
        default: 18.5204
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180'],
        default: 73.8567
      },
      experienceYears: {
        type: Number,
        min: [0, 'Experience years cannot be negative'],
        default: 5
      },
      organicCertified: {
        type: Boolean,
        default: true
      }
    },
    profileImage: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.index({ 'farmLocation.city': 1 });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
