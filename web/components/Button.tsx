import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, loading, ...props }) => (
  <button
    {...props}
    disabled={loading}
    className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
      hover:bg-blue-700 transition-colors disabled:opacity-50`}
  >
    {loading ? 'Enviando...' : children}
  </button>
);