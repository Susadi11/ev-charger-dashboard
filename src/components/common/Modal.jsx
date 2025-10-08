import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm px-4 py-8">
      <div className="absolute inset-0" onClick={onClose} />
      <div
        className={`relative w-full ${sizes[size]} overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-gray-200/70 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
