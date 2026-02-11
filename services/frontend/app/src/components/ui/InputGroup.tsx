import React from 'react';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputGroup = ({ label, error, className, ...props }: InputGroupProps) => {
  const errorClass = error 
    ? 'border-danger focus:border-danger focus:ring-danger/20' 
    : '';

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-300 mb-1 ml-1">
        {label}
      </label>
      <input 
        className={`input-nexus ${errorClass} ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
        {...props} 
      />
      {error && (
        <p className="text-xs text-danger mt-1 ml-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputGroup;