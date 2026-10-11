import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#F3EFE6] px-3.5 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#EBE5D8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="Instalar aplicación para uso sin conexión"
      >
        <Download className="w-3.5 h-3.5 text-[#78350F]" />
        <span>Instalar App</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowGuide(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#F3EFE6] px-3.5 py-2 text-xs font-medium text-[#1C1917] hover:bg-[#EBE5D8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        title="Cómo usar e instalar sin conexión"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#78350F]" />
        <span>{isIOS ? 'Instalar en iOS' : 'Modo Sin Conexión'}</span>
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#D6CEBE] bg-[#FBF9F5] p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-serif font-semibold text-[#1C1917]">
                Uso e Instalación Sin Conexión
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                className="p-1.5 rounded-lg text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
                aria-label="Cerrar ventana"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-[#44403C] leading-relaxed">
              <strong>Meditación Gnóstica</strong> cuenta con tecnología de almacenamiento local (Service Worker e IndexedDB) para que pueda realizar sus prácticas en cualquier lugar sin internet:
            </p>
            <ol className="mt-3 space-y-2 text-sm text-[#44403C] list-decimal list-inside">
              <li>
                En la <strong>Página 3 (Audios Dirigidos)</strong>, pulse <strong>«Guardar todos sin conexión»</strong> o guarde cada audio individualmente.
              </li>
              <li>
                También puede pulsar <strong>«Descargar (.wav)»</strong> en cualquier audio para conservar el archivo en la memoria de su teléfono o computadora.
              </li>
              <li>
                {isIOS
                  ? 'En Safari (iPhone/iPad), pulse el botón Compartir y seleccione «Agregar a la pantalla de inicio».'
                  : 'En su navegador (Chrome, Edge o Android), utilice el icono de instalar en la barra de direcciones para abrir la aplicación directamente desde su escritorio o inicio.'}
              </li>
            </ol>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGuide(false)}
                className="rounded-lg bg-[#78350F] px-4 py-2 text-xs font-medium text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
