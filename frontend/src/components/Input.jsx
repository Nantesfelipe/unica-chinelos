import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    type = 'text',
    placeholder,
    value,
    onChange,
    name,
    required = false,
    disabled = false,
    className = '',
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-[#171511] mb-2"
        >
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full
          px-4
          py-3
          rounded-md
          border
          bg-white
          text-[#171511]
          placeholder-[#8e8980]
          outline-none
          transition-colors
          ${
            error
              ? 'border-red-600 focus:border-red-600'
              : 'border-[#8e8980]/40 focus:border-[#746c5c]'
          }
          disabled:bg-[#e2dacc]
          disabled:cursor-not-allowed
          ${className}
        `}
      />

      {error && (
        <p className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;