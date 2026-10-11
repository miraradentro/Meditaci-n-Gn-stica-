import React from 'react';
import { Upload } from 'lucide-react';
import { PageId } from '../types/meditation';

interface TopNavBarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenUploadModal: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentPage,
  onNavigate,
  onOpenUploadModal,
}) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#E5DEC9] bg-[#FBF9F5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNav('portada')}
          className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-[#1C1917] hover:text-[#78350F] transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
        >
          Meditación Gnóstica
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="flex items-center gap-4 md:gap-7 text-sm font-medium text-[#57534E] overflow-x-auto">
          <button
            type="button"
            onClick={() => handleNav('portada')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentPage === 'portada'
                ? 'border-[#78350F] text-[#1C1917] font-semibold'
                : 'border-transparent hover:text-[#1C1917] hover:border-[#D6CEBE]'
            }`}
          >
            1. Portada Inicial
          </button>
          <button
            type="button"
            onClick={() => handleNav('indicaciones')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentPage === 'indicaciones'
                ? 'border-[#78350F] text-[#1C1917] font-semibold'
                : 'border-transparent hover:text-[#1C1917] hover:border-[#D6CEBE]'
            }`}
          >
            2. Indicaciones
          </button>
          <button
            type="button"
            onClick={() => handleNav('audios')}
            className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
              currentPage === 'audios'
                ? 'border-[#78350F] text-[#1C1917] font-semibold'
                : 'border-transparent hover:text-[#1C1917] hover:border-[#D6CEBE]'
            }`}
          >
            3. Audios Dirigidos
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#78350F] px-4 py-2 text-xs font-medium text-[#FBF9F5] hover:bg-[#9A3412] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir Audio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
