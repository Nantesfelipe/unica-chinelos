function Loading({ text = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="w-8 h-8 border-4 border-[#8e8980]/30 border-t-[#746c5c] rounded-full animate-spin" />

      {text && (
        <p className="text-sm text-[#8e8980]">
          {text}
        </p>
      )}
    </div>
  );
}

export default Loading;