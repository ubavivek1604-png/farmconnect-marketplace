import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID reference is required']
    },
    productName: {
      type: String,
      required: [true, 'Snapshot product name is required'],
      trim: true
    },
    image: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Unit price at time of order is required'],
      min: [0, 'Item price cannot be negative']
    },
    unit: {
      type: String,
      default: 'kg',
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Order item quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer ID reference is required'],
      index: true
    },
    farmerName: {
      type: String,
      required: [true, 'Farmer name snapshot is required'],
      trim: true
    },
    farmCity: {
      type: String,
      trim: true,
      default: ''
    },
    itemTotal: {
      type: Number,
      required: true,
      min: [0, 'Item total cannot be negative']
    },
    fulfillmentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
        message: '{VALUE} is not a valid fulfillment status'
      },
      default: 'Pending'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, 'Unique order reference number is required'],
      unique: true,
      trim: true,
      index: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer ID reference is required'],
      index: true
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      lowercase: true
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer contact phone is required'],
      trim: true
    },
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Order must contain at least one item'
      }
    },
    deliveryAddress: {
      fullName: { type: String, required: [true, 'Recipient name is required'], trim: true },
      phone: { type: String, required: [true, 'Delivery phone number is required'], trim: true },
      street: { type: String, required: [true, 'Street address is required'], trim: true },
      city: { type: String, required: [true, 'Delivery city is required'], trim: true },
      state: { type: String, required: [true, 'Delivery state is required'], trim: true },
      postalCode: { type: String, required: [true, 'Postal PIN code is required'], trim: true },
      notes: { type: String, trim: true, default: '' }
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative']
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: [0, 'Delivery fee cannot be negative'],
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total order amount cannot be negative']
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['Cash on Delivery', 'UPI / NetBanking (Test Mode)'],
        message: '{VALUE} is not a supported payment method'
      },
      default: 'Cash on Delivery'
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Completed', 'Refunded'],
        message: '{VALUE} is not a valid payment status'
      },
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
        message: '{VALUE} is not a valid order status'
      },
      default: 'Pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

OrderSchema.index({ 'items.farmerId': 1, orderStatus: 1 });
OrderSchema.index({ customerId: 1, createdAt: -1 });

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;
