import React from 'react';
import { FulfillmentStatus } from '../types/index.ts';

export const OrderStatusBadge: React.FC<{ status: FulfillmentStatus }> = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Delivered':
        return {
          dot: 'bg-emerald-500',
          text: 'text-emerald-700 font-semibold',
          label: '🏡 Delivered Fresh',
          icon: '✨'
        };
      case 'Shipped':
        return {
          dot: 'bg-blue-500 animate-pulse',
          text: 'text-blue-700 font-medium',
          label: '🚜 Tractor in Transit',
          icon: '🌾'
        };
      case 'Packed':
        return {
          dot: 'bg-indigo-500',
          text: 'text-indigo-700 font-medium',
          label: '📦 Farm-Packed in Village',
          icon: '🧺'
        };
      case 'Confirmed':
        return {
          dot: 'bg-amber-500',
          text: 'text-amber-700 font-medium',
          label: '👨‍🌾 Confirmed by Farmer',
          icon: '🌱'
        };
      case 'Cancelled':
        return {
          dot: 'bg-rose-500',
          text: 'text-rose-700 font-medium',
          label: 'Cancelled',
          icon: '✕'
        };
      case 'Pending':
      default:
        return {
          dot: 'bg-stone-400',
          text: 'text-stone-600 font-medium',
          label: '⏳ Harvest Pending',
          icon: '🌾'
        };
    }
  };

  const config = getStatusStyle();

  return (
    <div className="inline-flex items-center gap-1.5 text-xs">
      <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
      <span className={config.text}>{config.label}</span>
    </div>
  );
};
