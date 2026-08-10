function Button({
  children,
  type = 'button',
  onClick,
  disabled = false,
  variant = 'primary',
  fullWidth = true,
  className = '',
}) {
  const variantes = {
    primary: 'bg-[#171511] text-[#e2dacc] hover:bg-[#746c5c]',
    secondary: 'bg-[#746c5c] text-[#e2dacc] hover:bg-[#74645c]',
    outline: 'border border-[#8e8980]/50 text-[#171511] hover:border-[#746c5c]',
    danger: 'bg-red-700 text-white hover:bg-red-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? 'w-full' : 'w-auto'}
        px-4
        py-3
        rounded-md
        text-sm
        font-medium
        transition-colors
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variantes[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export default Button;