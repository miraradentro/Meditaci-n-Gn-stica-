import React from 'react';
import {
  BookOpen,
  Headphones,
  Play,
  Upload,
  Wifi,
  WifiOff,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { MeditationTrack, PageId } from '../types/meditation';
import { HERO_SANCTUARY_IMAGE, SACRED_FIGURES } from '../data/meditationData';
import { ResilientImage } from './ResilientImage';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface PortadaPageProps {
  tracks: MeditationTrack[];
  offlineSavedIds: string[];
  visitInfo: {
    isReturningUser: boolean;
    visitCount: number;
    previousVisitFormatted: string;
  };
  onNavigate: (page: PageId) => void;
  onPlayTrackFromCover: (trackId: string) => void;
  onOpenUploadModal: () => void;
  onSaveAllOffline: () => void;
  isSavingAllOffline: boolean;
}

export const PortadaPage: React.FC<PortadaPageProps> = ({
  tracks,
  offlineSavedIds,
  visitInfo,
  onNavigate,
  onPlayTrackFromCover,
  onOpenUploadModal,
  onSaveAllOffline,
  isSavingAllOffline,
}) => {
  const isOnline = useOnlineStatus();

  const updatedTracks = tracks.filter((t) => t.isNewUpdate).slice(0, 4);
  const displayUpdates = updatedTracks.length > 0 ? updatedTracks : tracks.slice(0, 3);

  const handleGoPage = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} min`;
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 space-y-20">
      {/* SECCIÓN 1: HERO DE BIENVENIDA Y ACCESO A PÁGINA 2 Y PÁGINA 3 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#78350F] font-medium tracking-wide">
              <span>Página 1 · Portada de Bienvenida</span>
              <span aria-hidden="true">·</span>
              <span>Santuario de Silencio Interior</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" /> Conectado y listo sin conexión
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" /> Modo sin conexión activo
                  </>
                )}
              </span>
            </div>

            <h1
              className="mt-4 font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold text-[#1C1917] leading-[1.12] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Bienvenido a Meditación Gnóstica
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#44403C] leading-relaxed max-w-2xl">
              Un espacio minimalista, cálido y sereno dedicado a la práctica de la meditación a través de audios dirigidos. Aquiete el cuerpo físico, armonice sus tres cerebros y adéntrese en la paz del corazón bajo la guía eterna de <strong>Jesús el Cristo</strong>, el <strong>V.M. Samael Aun Weor</strong> y el <strong>V.M. Lakhsmi Daimon</strong>.
            </p>
          </div>

          {/* Navegación Directa a Página 2 y Página 3 como se solicita desde la Portada */}
          <div className="mt-8 pt-6 border-t border-[#E5DEC9]">
            <p className="text-xs font-semibold text-[#57534E] mb-4">
              Seleccione a dónde desea dirigirse desde esta portada:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleGoPage('indicaciones')}
                className="group flex flex-col justify-between rounded-xl border border-[#D6CEBE] bg-[#F3EFE6] p-5 text-left hover:border-[#78350F] hover:bg-[#EBE5D8] transition-all duration-150 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono text-[#78350F]">PÁGINA 02</span>
                  <BookOpen className="w-4 h-4 text-[#78350F] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="mt-3">
                  <p className="font-serif text-xl font-semibold text-[#1C1917]">
                    Indicaciones Precisas
                  </p>
                  <p className="mt-1 text-xs text-[#57534E] leading-relaxed">
                    Instrucciones esenciales de postura, relajación y recogimiento antes de comenzar con los audios.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#78350F]">
                  <span>Ir a la Página 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleGoPage('audios')}
                className="group flex flex-col justify-between rounded-xl bg-[#78350F] p-5 text-left text-[#FBF9F5] hover:bg-[#9A3412] transition-all duration-150 cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono text-[#F3EFE6]/80">PÁGINA 03</span>
                  <Headphones className="w-4 h-4 text-[#FBF9F5] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="mt-3">
                  <p className="font-serif text-xl font-semibold text-[#FBF9F5]">
                    Audios Dirigidos y Reproductor
                  </p>
                  <p className="mt-1 text-xs text-[#F3EFE6]/90 leading-relaxed">
                    Escuche en reproducción continua uno detrás del otro, descargue cada audio o úselos sin conexión.
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#FBF9F5]">
                  <span>Ir a la Página 3</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Imagen de Santuario en la Portada */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-2xl border border-[#D6CEBE] bg-[#F3EFE6]">
            <ResilientImage
              src={HERO_SANCTUARY_IMAGE}
              alt="Santuario minimalista de meditación gnóstica al atardecer"
              className="w-full h-full object-cover"
              fallbackTitle="Templo de Meditación Interior"
              fallbackSubtitle="Paz · Reverencia · Silencio"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/20 to-transparent flex flex-col justify-end p-6">
              <p className="font-serif italic text-lg sm:text-xl text-[#FBF9F5] leading-snug">
                «La meditación es el pan diario del sabio. En el silencio del corazón florece la sabiduría del Ser.»
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#E5DEC9]">
                <span>{tracks.length} audios dirigidos disponibles</span>
                <span aria-hidden="true">·</span>
                <span>{offlineSavedIds.length} listos sin conexión</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: ÚLTIMAS ACTUALIZACIONES PARA USUARIOS QUE YA HAN INGRESADO A LA APLICACIÓN */}
      <section
        id="ultimas-actualizaciones"
        className="rounded-2xl border border-[#D6CEBE] bg-[#F3EFE6]/80 p-6 sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5DEC9]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#78350F] font-medium">
              <span>Novedades para practicantes registrados en el dispositivo</span>
              <span aria-hidden="true">·</span>
              <span>Ingreso N.º {visitInfo.visitCount}</span>
              <span aria-hidden="true">·</span>
              <span>Última sesión: {visitInfo.previousVisitFormatted}</span>
            </div>
            <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
              Últimas Actualizaciones de Audios Dirigidos
            </h2>
            <p className="mt-1 text-sm text-[#57534E]">
              Bienvenido nuevamente. Estos son los audios dirigidos que se han subido o actualizado recientemente para su práctica:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSaveAllOffline}
              disabled={isSavingAllOffline}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-3.5 py-2 text-xs font-medium text-[#1C1917] hover:border-[#78350F] transition-colors cursor-pointer whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#78350F]" />
              <span>
                {isSavingAllOffline
                  ? 'Guardando en memoria...'
                  : offlineSavedIds.length === tracks.length
                  ? 'Todos guardados sin conexión'
                  : 'Guardar todos sin conexión'}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#78350F] px-3.5 py-2 text-xs font-medium text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir o Actualizar Audio</span>
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayUpdates.map((track) => {
            const isSavedOffline = offlineSavedIds.includes(track.id);
            return (
              <div
                key={track.id}
                className="flex flex-col justify-between rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] p-5 hover:border-[#78350F]/60 transition-colors"
              >
                <div>
                  {/* Clean unboxed metadata following Zero-Pill Discipline */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#78350F] font-medium">
                    <span>Actualizado: {track.updatedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDuration(track.durationSeconds)}
                    </span>
                    {isSavedOffline && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#57534E]">Disponible sin conexión</span>
                      </>
                    )}
                  </div>

                  <h3 className="mt-2 font-serif text-xl font-semibold text-[#1C1917]">
                    {track.title}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-[#57534E]">
                    Autor / Crédito: {track.authorCredit}
                  </p>

                  <p className="mt-2.5 text-sm text-[#44403C] leading-relaxed">
                    {track.updateSummary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F3EFE6] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => onPlayTrackFromCover(track.id)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#78350F] hover:text-[#9A3412] transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Escuchar este audio en Página 3</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoPage('indicaciones')}
                    className="text-xs text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
                  >
                    Ver indicaciones previas →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN 3: TRÍPTICO SAGRADO: JESÚS EL CRISTO, V.M. SAMAEL AUN WEOR Y V.M. LAKHSMI DAIMON */}
      <section id="maestros-inspiradores" className="space-y-8">
        <div className="border-b border-[#E5DEC9] pb-5">
          <div className="flex items-center gap-2 text-xs text-[#78350F] font-medium">
            <span>Línea de Sabiduría y Guía Espiritual</span>
            <span aria-hidden="true">·</span>
            <span>Enseñanza Cristocéntrica y Gnóstica</span>
          </div>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Inspiración y Guía de los Venerables Maestros
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#57534E] max-w-3xl">
            Las prácticas de meditación dirigida reunidas en esta aplicación se fundamentan en la enseñanza viva del Cristo Íntimo y en la doctrina entregada por los Venerables Maestros de la Conciencia Despierta.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SACRED_FIGURES.map((figure) => (
            <article
              key={figure.id}
              className="flex flex-col justify-between rounded-2xl border border-[#D6CEBE] bg-[#FBF9F5] overflow-hidden shadow-2xs"
            >
              <div>
                <div className="aspect-[3/4] w-full overflow-hidden bg-[#F3EFE6] border-b border-[#E5DEC9]">
                  <ResilientImage
                    src={figure.imageUrl}
                    alt={figure.name}
                    className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-[1.02]"
                    fallbackTitle={figure.name}
                    fallbackSubtitle={figure.title}
                  />
                </div>

                <div className="p-6">
                  <p className="text-xs text-[#78350F] font-medium">
                    {figure.title}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold text-[#1C1917]">
                    {figure.name}
                  </h3>

                  <blockquote className="mt-4 py-3 border-y border-[#E5DEC9] font-serif italic text-base text-[#292524] leading-relaxed">
                    {figure.quote}
                  </blockquote>

                  <p className="mt-4 text-sm text-[#44403C] leading-relaxed">
                    {figure.teaching}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => handleGoPage('audios')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#F3EFE6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#78350F] hover:text-[#FBF9F5] hover:border-[#78350F] transition-colors cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5" />
                  <span>Ir a los Audios de Meditación</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
