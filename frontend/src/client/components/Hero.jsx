import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function Hero({
  titulo = 'Conforto em cada passo',
  subtitulo = 'Encontre o chinelo ideal para você.',
}) {
  return (
    <section className="bg-[#746c5c]">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-[#e2dacc]/70 text-sm mb-4">
            Única Conceitos
          </p>

          <h1 className="text-[#e2dacc] text-4xl md:text-5xl font-semibold leading-tight">
            {titulo}
          </h1>

          <p className="text-[#e2dacc]/80 mt-5 text-base md:text-lg">
            {subtitulo}
          </p>

          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 mt-8 bg-[#171511] text-[#e2dacc] px-6 py-3 rounded-md text-sm hover:bg-[#74645c] transition-colors"
          >
            Ver produtos
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;