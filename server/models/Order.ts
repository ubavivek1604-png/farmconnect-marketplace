import mongoose, { Document, Schema } from 'mongoose';

export type FulfillmentStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId | string;
  productName: string;
  image?: string;
  price: number;
  unit: string;
  quantity: number;
  farmerId: mongoose.Types.ObjectId | string;
  farmerName: string;
  farmCity?: string;
  itemTotal: number;
  fulfillmentStatus: FulfillmentStatus;
  updatedAt?: Date;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId: mongoose.Types.ObjectId | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    notes?: string;
  };
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'Cash on Delivery' | 'UPI / NetBanking (Test Mode)';
  paymentStatus: 'Pending' | 'Completed' | 'Refunded';
  orderStatus: FulfillmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'kg' },
    quantity: { type: Number, required: true, min: 1 },
    farmerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    farmerName: { type: String, required: true },
    farmCity: { type: String, default: '' },
    itemTotal: { type: Number, required: true, min: 0 },
    fulfillmentStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    updatedAt: { type: Date, default: Date.now }
  },
  { _id: true }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [OrderItemSchema],
    deliveryAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      notes: { type: String, default: '' }
    },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['Cash on Delivery', 'UPI / NetBanking (Test Mode)'],
      default: 'Cash on Delivery'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Refunded'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
