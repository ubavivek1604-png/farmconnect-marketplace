import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { api } from '../services/api.ts';
import { Order } from '../types/index.ts';
import { OrderStatusBadge } from '../components/OrderStatusBadge.tsx';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  Store,
  MapPin
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(
    (location.state as { order?: Order })?.order || null
  );

  useEffect(() => {
    async function loadOrder() {
      if (!order && orderNumber) {
        try {
          const res = await api.orders.getById(orderNumber);
          if (res.success && res.data) {
            setOrder(res.data);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    loadOrder();
  }, [order, orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      {/* Success banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Order Successfully Placed!
        </h1>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Your order has been transmitted directly to the farm. The grower will harvest and pack your items fresh.
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <p className="text-xs text-stone-400">Order Reference</p>
            <p className="text-lg font-bold text-stone-900">{order?.orderNumber || orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-stone-400">Current Status</p>
            <div className="mt-1">
              <OrderStatusBadge status={order?.orderStatus || 'Pending'} />
            </div>
          </div>
          <div>
            <p className="text-xs text-stone-400">Payment</p>
            <p className="text-xs font-semibold text-stone-800 mt-1">
              {order?.paymentMethod || 'Cash on Delivery'}
            </p>
          </div>
        </div>

        {/* 5-Step Order Progress Timeline */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-stone-700">Fulfillment Progress Timeline</p>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
            {['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, idx) => {
              const currentStatus = order?.orderStatus || 'Pending';
              const steps = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
              const isPast = steps.indexOf(currentStatus) >= idx;
              const isCurrent = currentStatus === step;

              return (
                <div key={step} className="space-y-1.5 relative">
                  {isCurrent && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-sm animate-bounce" title="Current village fulfillment position">
                      🚜
                    </div>
                  )}
                  <div
                    className={`h-2 rounded-full ${
                      isPast
                        ? 'bg-emerald-600'
                        : 'bg-stone-200'
                    }`}
                  />
                  <span className={`block font-medium ${isCurrent ? 'text-emerald-800 font-bold' : isPast ? 'text-stone-700' : 'text-stone-400'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Items list */}
        {order?.items && order.items.length > 0 && (
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-stone-700">Ordered Produce ({order.items.length} items)</p>
            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-stone-900 truncate">{item.productName}</p>
                    <p className="text-[11px] text-stone-500">
                      👨‍🌾 {item.farmerName} · {item.quantity} {item.unit} × ₹{item.price}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-stone-900">₹{item.itemTotal}</p>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {item.fulfillmentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline font-bold text-stone-900 text-sm">
              <span>Total Paid / Payable:</span>
              <span className="text-emerald-800 text-lg">₹{order.totalAmount}</span>
            </div>
          </div>
        )}

        {/* Delivery Address */}
        {order?.deliveryAddress && (
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-1">
            <p className="font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct Delivery Address:</span>
            </p>
            <p className="text-stone-700">
              {order.deliveryAddress.fullName} ({order.deliveryAddress.phone})
            </p>
            <p className="text-stone-500">
              {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.postalCode}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            to="/customer/dashboard"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs text-center shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Track in Customer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/marketplace"
            className="py-3 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs text-center transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
