import React, { useId } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, id, ...props }) => {

  const reactId = useId();
  const inputId = id || `${label.toLowerCase().replace(/\s+/g, '-')}-${reactId}`

  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium text-gray-700 mb-1" htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        {...props}
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
} 