import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900/30 disabled:opacity-40 disabled:cursor-not-allowed gap-2';
  
  const variants = {
    primary:
      'bg-gray-900 text-white shadow-sm hover:bg-gray-800 hover:shadow-md focus-visible:ring-gray-900/40',
    secondary:
      'bg-white text-gray-900 border border-gray-200 shadow-sm hover:border-gray-300 hover:bg-gray-50',
    success:
      'bg-emerald-600 text-white shadow-sm hover:bg-emerald-500 focus-visible:ring-emerald-500/40',
    danger:
      'bg-rose-600 text-white shadow-sm hover:bg-rose-500 focus-visible:ring-rose-500/40',
    warning:
      'bg-amber-500 text-white shadow-sm hover:bg-amber-400 focus-visible:ring-amber-500/40',
    ghost:
      'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-transparent'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
