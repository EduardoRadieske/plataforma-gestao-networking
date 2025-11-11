import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`bg-white shadow-md rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);
