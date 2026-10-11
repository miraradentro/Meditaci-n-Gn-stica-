import React from 'react';
import { ArrowUp, Home, BookOpen, Headphones } from 'lucide-react';
import { PageId } from '../types/meditation';
import { PWAInstallButton } from './PWAInstallButton';

interface PageFooterProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const PageFooter: React.FC<PageFooterProps> = ({ currentPage, onNavigate }) => {
  const goPage = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-[#E5DEC9] bg-[#F3EFE6]/70">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#E5DEC9]">
          <div>
            <p className="font-serif text-2xl font-semibold text-[#1C1917]">
              Meditación Gnóstica
            </p>
            <p className="mt-1 text-sm text-[#57534E] max-w-md">
              Santuario de audios dirigidos para el recogimiento interior, la relajación de los tres cerebros y la comunión con el Ser.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => goPage('portada')}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#78350F] hover:text-[#78350F] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Home className="w-3.5 h-3.5 text-[#78350F]" />
              <span>Volver a la Portada Inicial</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#78350F] hover:text-[#FBF9F5] hover:border-[#78350F] transition-colors cursor-pointer whitespace-nowrap"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Subir al inicio de la página</span>
            </button>

            <PWAInstallButton />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#57534E]">
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => goPage('portada')}
              className={`inline-flex items-center gap-1.5 hover:text-[#1C1917] transition-colors cursor-pointer ${
                currentPage === 'portada' ? 'font-semibold text-[#78350F]' : ''
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Página 1: Portada Inicial</span>
            </button>
            <button
              type="button"
              onClick={() => goPage('indicaciones')}
              className={`inline-flex items-center gap-1.5 hover:text-[#1C1917] transition-colors cursor-pointer ${
                currentPage === 'indicaciones' ? 'font-semibold text-[#78350F]' : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Página 2: Indicaciones Precisas</span>
            </button>
            <button
              type="button"
              onClick={() => goPage('audios')}
              className={`inline-flex items-center gap-1.5 hover:text-[#1C1917] transition-colors cursor-pointer ${
                currentPage === 'audios' ? 'font-semibold text-[#78350F]' : ''
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>Página 3: Audios Dirigidos</span>
            </button>
          </div>

          <p className="text-[#78716C]">
            Inspirado en las enseñanzas de Jesús el Cristo · V.M. Samael Aun Weor · V.M. Lakhsmi Daimon
          </p>
        </div>
      </div>
    </footer>
  );
};
