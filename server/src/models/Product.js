import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Organic Produce'],
        message: '{VALUE} is not a valid agricultural category'
      },
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Product price in ₹ is required'],
      min: [0, 'Price cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      enum: {
        values: ['kg', 'dozen', 'litre', 'piece', 'bunch', 'quintal'],
        message: '{VALUE} is not a supported measurement unit'
      },
      default: 'kg'
    },
    quantity: {
      type: Number,
      required: [true, 'Available inventory quantity is required'],
      min: [0, 'Available quantity cannot be negative'],
      default: 0
    },
    images: {
      type: [String],
      default: []
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID reference is required'],
      index: true
    },
    farmerName: {
      type: String,
      trim: true,
      default: ''
    },
    location: {
      farmName: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
      lat: { type: Number, default: 18.5204 },
      lng: { type: Number, default: 73.8567 }
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true
    },
    isOrganic: {
      type: Boolean,
      default: false
    },
    harvestDate: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, isAvailable: 1, price: 1 });
ProductSchema.index({ farmerId: 1, isAvailable: 1 });

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export default Product;
