import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading fresh produce...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-10 h-10 mb-3">
        <div className="w-10 h-10 rounded-full border-2 border-emerald-100 border-t-emerald-600 animate-spin"></div>
      </div>
      <p className="text-xs text-stone-500 font-medium">{message}</p>
    </div>
  );
};
