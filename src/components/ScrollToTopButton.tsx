import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [scrolledDown, setScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledDown(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      type="button"
      aria-label="Subir la página hasta el inicio"
      title="Subir hasta el inicio de la página"
      className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-xl border border-[#D6CEBE] bg-[#FBF9F5]/95 backdrop-blur-xs px-4 py-2.5 text-xs font-semibold text-[#1C1917] shadow-md hover:bg-[#78350F] hover:text-[#FBF9F5] hover:border-[#78350F] transition-all duration-150 cursor-pointer ${
        scrolledDown ? 'opacity-100 translate-y-0' : 'opacity-90 translate-y-0'
      }`}
    >
      <ArrowUp className="w-4 h-4 shrink-0" />
      <span className="whitespace-nowrap">Subir al inicio</span>
    </button>
  );
};
