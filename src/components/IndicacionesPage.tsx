import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckSquare,
  Square,
  Headphones,
  Home,
} from 'lucide-react';
import { PageId } from '../types/meditation';
import { PRECISE_INDICATIONS, SACRED_FIGURES } from '../data/meditationData';
import { ResilientImage } from './ResilientImage';

interface IndicacionesPageProps {
  onNavigate: (page: PageId) => void;
}

const PREPARATION_CHECKLIST = [
  'Me encuentro en un lugar tranquilo donde no seré interrumpido durante los próximos minutos.',
  'He adoptado una postura cómoda (sentado con columna recta o recostado en estrella / decúbito dorsal).',
  'He realizado al menos tres inhalaciones y exhalaciones lentas para soltar las tensiones del día.',
  'He elevado mi pensamiento en oración íntima al Ser Interior y a los Venerables Maestros.',
];

export const IndicacionesPage: React.FC<IndicacionesPageProps> = ({ onNavigate }) => {
  const [checkedItems, setCheckedItems] = useState<number[]>([0, 1]);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleGoPage = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 space-y-16">
      {/* BARRA DE RETORNO A LA PORTADA INICIAL Y ACCESO A PÁGINA 3 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5DEC9]">
        <button
          type="button"
          onClick={() => handleGoPage('portada')}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#F3EFE6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#78350F] hover:text-[#78350F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#78350F]" />
          <span>Volver a la Portada Inicial</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleGoPage('audios')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#78350F] px-4 py-2.5 text-xs font-semibold text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer"
          >
            <Headphones className="w-4 h-4" />
            <span>Ir a Página 3: Audios Dirigidos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ENCABEZADO DE LA PÁGINA 2 */}
      <section className="max-w-3xl">
        <div className="flex items-center gap-2 text-xs text-[#78350F] font-medium">
          <span>Página 2 · Guía Preparatoria</span>
          <span aria-hidden="true">·</span>
          <span>Disciplina Esotérica de la Meditación</span>
        </div>

        <h1
          className="mt-3 font-serif text-4xl sm:text-5xl font-semibold text-[#1C1917] leading-tight"
          style={{ textWrap: 'balance' }}
        >
          Indicaciones Precisas Antes de Comenzar con los Audios
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#44403C] leading-relaxed">
          Para que la meditación gnóstica produzca frutos de paz interior, comprensión y despertar de la conciencia, es indispensable disponer adecuadamente el cuerpo físico, la respiración y el centro emocional antes de reproducir los audios dirigidos.
        </p>
      </section>

      {/* LAS 6 INDICACIONES PRECISAS PASO A PASO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PRECISE_INDICATIONS.map((item) => (
          <article
            key={item.number}
            className="flex flex-col justify-between rounded-2xl border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-8"
          >
            <div>
              <div className="flex items-baseline justify-between gap-4 border-b border-[#E5DEC9] pb-3">
                <span className="font-mono text-sm font-semibold text-[#78350F] tabular-nums">
                  INDICACIÓN {item.number}
                </span>
                <span className="text-xs text-[#78716C]">{item.subtitle}</span>
              </div>

              <h2 className="mt-4 font-serif text-2xl font-semibold text-[#1C1917]">
                {item.number}. {item.title}
              </h2>

              <p className="mt-3 text-sm sm:text-base text-[#44403C] leading-relaxed">
                {item.body}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F3EFE6]">
              <p className="text-xs font-medium text-[#78350F]">
                Clave práctica: <span className="text-[#292524] font-normal">{item.keyPractice}</span>
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* SÍNTESIS DE LOS VENERABLES MAESTROS PARA LA PRÁCTICA */}
      <section className="rounded-2xl border border-[#D6CEBE] bg-[#F3EFE6]/75 p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E5DEC9] pb-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
            La Triple Armonía antes de Escuchar los Audios
          </h2>
          <p className="mt-1 text-sm text-[#57534E]">
            Recordatorio visual de la orientación espiritual enseñada por Jesús el Cristo, el V.M. Samael Aun Weor y el V.M. Lakhsmi Daimon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SACRED_FIGURES.map((figure) => (
            <div
              key={figure.id}
              className="flex items-start gap-4 rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] p-4"
            >
              <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg border border-[#D6CEBE] bg-[#F3EFE6]">
                <ResilientImage
                  src={figure.imageUrl}
                  alt={figure.name}
                  className="h-full w-full object-cover object-top"
                  fallbackTitle={figure.name}
                />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  {figure.name}
                </h3>
                <p className="mt-1 text-xs text-[#44403C] leading-relaxed">
                  {figure.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LISTA INTERACTIVA DE DISPOSICIÓN INTERIOR ANTES DE PASAR A LOS AUDIOS */}
      <section className="rounded-2xl border border-[#D6CEBE] bg-[#FBF9F5] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E5DEC9]">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
              Verificación Personal antes de Iniciar la Sesión
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              Marque cada punto conforme prepare su ambiente y su estado interior antes de ir al reproductor:
            </p>
          </div>
          <span className="font-mono text-xs text-[#78350F] tabular-nums">
            {checkedItems.length} de {PREPARATION_CHECKLIST.length} completados
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {PREPARATION_CHECKLIST.map((item, idx) => {
            const isChecked = checkedItems.includes(idx);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleCheck(idx)}
                className={`w-full flex items-center gap-3.5 rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                  isChecked
                    ? 'border-[#78350F]/50 bg-[#F3EFE6] text-[#1C1917]'
                    : 'border-[#E5DEC9] bg-[#FBF9F5] text-[#44403C] hover:bg-[#F3EFE6]/50'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-[#78350F] shrink-0" />
                ) : (
                  <Square className="w-5 h-5 text-[#78716C] shrink-0" />
                )}
                <span className="text-sm font-medium">{item}</span>
              </button>
            );
          })}
        </div>

        {/* Enlaces de navegación al final de las indicaciones */}
        <div className="mt-8 pt-6 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleGoPage('portada')}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#F3EFE6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#78350F] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#78350F]" />
              <span>Volver a la Portada Inicial</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-4 h-4 text-[#78350F]" />
              <span>Subir al inicio de esta página</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleGoPage('audios')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#78350F] px-6 py-3 text-sm font-semibold text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer shadow-sm"
          >
            <Headphones className="w-4 h-4" />
            <span>Comenzar Ahora con los Audios Dirigidos (Página 3)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
