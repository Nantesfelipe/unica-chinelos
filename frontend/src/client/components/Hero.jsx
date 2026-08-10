function Hero({ titulo = 'Coleção verão até 30% off', subtitulo }) {
  return (
    <div className="bg-[#746c5c] px-6 py-14 text-center">
      <h2 className="text-[#e2dacc] text-xl md:text-2xl font-semibold">{titulo}</h2>
      {subtitulo && <p className="text-[#e2dacc]/80 text-sm mt-2">{subtitulo}</p>}
    </div>
  );
}

export default Hero;