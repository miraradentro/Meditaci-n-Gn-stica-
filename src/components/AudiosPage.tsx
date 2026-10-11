import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Check,
  Download,
  Edit3,
  HardDriveDownload,
  Home,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Upload,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { MeditationTrack, PageId } from '../types/meditation';
import { SACRED_FIGURES } from '../data/meditationData';
import { ResilientImage } from './ResilientImage';
import {
  getOrCreateTrackBlobUrl,
  getTrackBlobForDownload,
} from '../utils/audioSynthesizer';
import { getOfflineAudioBlob } from '../utils/offlineStorage';

interface AudiosPageProps {
  tracks: MeditationTrack[];
  offlineSavedIds: string[];
  initialSelectedTrackId: string | null;
  onNavigate: (page: PageId) => void;
  onOpenUploadModal: () => void;
  onEditTrack: (track: MeditationTrack) => void;
  onSaveTrackOffline: (track: MeditationTrack) => Promise<void>;
  onSaveAllOffline: () => Promise<void>;
  isSavingAllOffline: boolean;
}

export const AudiosPage: React.FC<AudiosPageProps> = ({
  tracks,
  offlineSavedIds,
  initialSelectedTrackId,
  onNavigate,
  onOpenUploadModal,
  onEditTrack,
  onSaveTrackOffline,
  onSaveAllOffline,
  isSavingAllOffline,
}) => {
  const [activeTrackId, setActiveTrackId] = useState<string>(
    initialSelectedTrackId || tracks[0]?.id || ''
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [continuousPlayback, setContinuousPlayback] = useState<boolean>(true);
  const [spokenGuideEnabled, setSpokenGuideEnabled] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(tracks[0]?.durationSeconds || 90);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [savingOfflineId, setSavingOfflineId] = useState<string | null>(null);
  const [masterFilter, setMasterFilter] = useState<'all' | 'cristo' | 'samael' | 'lakhsmi'>('all');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenStepKeyRef = useRef<string>('');

  const filteredTracks =
    masterFilter === 'all'
      ? tracks
      : tracks.filter((t) => t.masterReference === masterFilter);

  const activeTrack =
    tracks.find((t) => t.id === activeTrackId) || tracks[0];

  const getMasterFigure = (ref: 'cristo' | 'samael' | 'lakhsmi') =>
    SACRED_FIGURES.find((f) => f.id === ref) || SACRED_FIGURES[0];

  // Speak guided instruction gently in Spanish when entering a meditation phase
  const speakInstruction = (text: string, stepKey: string) => {
    if (!spokenGuideEnabled || isMuted) return;
    if (lastSpokenStepKeyRef.current === stepKey) return;
    lastSpokenStepKeyRef.current = stepKey;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.88; // Calm, serene cadence
        utterance.pitch = 0.95;
        utterance.volume = Math.min(1, volume);
        window.speechSynthesis.speak(utterance);
      } catch {
        // Ignore if speech synthesis is blocked
      }
    }
  };

  // Load track audio source when activeTrackId changes
  useEffect(() => {
    let isCancelled = false;
    async function loadAudioForActiveTrack() {
      if (!activeTrack || !audioRef.current) return;
      const offlineBlob = await getOfflineAudioBlob(activeTrack.id);
      if (isCancelled) return;
      const blobUrl = getOrCreateTrackBlobUrl(activeTrack, offlineBlob);
      const audioEl = audioRef.current;

      if (audioEl.src !== blobUrl) {
        audioEl.src = blobUrl;
        audioEl.load();
        setCurrentTime(0);
        setDuration(activeTrack.durationSeconds || 90);
        lastSpokenStepKeyRef.current = '';
      }

      if (isPlaying) {
        audioEl.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
    loadAudioForActiveTrack();
    return () => {
      isCancelled = true;
    };
  }, [activeTrackId, activeTrack]);

  // If user clicked "Escuchar este audio" from Portada, start playing it automatically
  useEffect(() => {
    if (initialSelectedTrackId) {
      setActiveTrackId(initialSelectedTrackId);
      setIsPlaying(true);
    }
  }, [initialSelectedTrackId]);

  // Trigger spoken guidance when crossing step thresholds
  useEffect(() => {
    if (!isPlaying || !activeTrack) return;
    const currentStepIndex = [...activeTrack.steps]
      .reverse()
      .findIndex((s) => currentTime >= s.atSecond);
    const actualIdx =
      currentStepIndex >= 0
        ? activeTrack.steps.length - 1 - currentStepIndex
        : 0;
    const step = activeTrack.steps[actualIdx];
    if (step) {
      speakInstruction(
        `${step.phaseTitle}. ${step.instruction}`,
        `${activeTrack.id}-step-${actualIdx}`
      );
    }
  }, [Math.floor(currentTime), isPlaying, activeTrack, spokenGuideEnabled]);

  // Clean up speechSynthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleTogglePlayTrack = (track: MeditationTrack) => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (activeTrackId === track.id) {
      if (isPlaying) {
        audioEl.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        audioEl.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      setActiveTrackId(track.id);
      setIsPlaying(true);
    }
  };

  const handleSeek = (track: MeditationTrack, newSecond: number) => {
    const audioEl = audioRef.current;
    if (!audioEl) return;
    if (activeTrackId !== track.id) {
      setActiveTrackId(track.id);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = newSecond;
          setCurrentTime(newSecond);
        }
      }, 100);
    } else {
      audioEl.currentTime = newSecond;
      setCurrentTime(newSecond);
    }
  };

  // Continuous playback handler: when an audio finishes, continue to the next one automatically
  const handleAudioEnded = () => {
    const currentList = filteredTracks.length > 0 ? filteredTracks : tracks;
    const currentIndex = currentList.findIndex((t) => t.id === activeTrackId);

    if (continuousPlayback && currentIndex >= 0 && currentIndex < currentList.length - 1) {
      const nextTrack = currentList[currentIndex + 1];
      setActiveTrackId(nextTrack.id);
      setIsPlaying(true);
      // Scroll gently to keep the newly active track visible
      const nextCard = document.getElementById(`audio-card-${nextTrack.id}`);
      if (nextCard) {
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handlePlayNext = () => {
    const currentList = filteredTracks.length > 0 ? filteredTracks : tracks;
    const idx = currentList.findIndex((t) => t.id === activeTrackId);
    if (idx >= 0 && idx < currentList.length - 1) {
      setActiveTrackId(currentList[idx + 1].id);
      setIsPlaying(true);
    }
  };

  const handlePlayPrev = () => {
    const currentList = filteredTracks.length > 0 ? filteredTracks : tracks;
    const idx = currentList.findIndex((t) => t.id === activeTrackId);
    if (idx > 0) {
      setActiveTrackId(currentList[idx - 1].id);
      setIsPlaying(true);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleDownloadTrackFile = async (track: MeditationTrack) => {
    setDownloadingId(track.id);
    try {
      const offlineBlob = await getOfflineAudioBlob(track.id);
      const blob = offlineBlob || getTrackBlobForDownload(track);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = track.title
        .toLowerCase()
        .replace(/[^a-z0-9áéíóúñ]+/gi, '_')
        .replace(/^_+|_+$/g, '');
      const ext = track.customFileName
        ? track.customFileName.split('.').pop() || 'wav'
        : 'wav';
      a.href = url;
      a.download = `${safeName}_meditacion_gnostica.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      // Also save in IndexedDB offline storage automatically when downloaded
      await onSaveTrackOffline(track);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSaveOfflineSingle = async (track: MeditationTrack) => {
    setSavingOfflineId(track.id);
    try {
      await onSaveTrackOffline(track);
    } finally {
      setSavingOfflineId(null);
    }
  };

  const formatTime = (sec: number) => {
    const clean = Math.max(0, Math.floor(sec || 0));
    const m = Math.floor(clean / 60);
    const s = clean % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleGoPage = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 space-y-12">
      {/* Elemento de audio HTML5 nativo sincronizado */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current && isFinite(audioRef.current.duration) && audioRef.current.duration > 0) {
            setDuration(Math.round(audioRef.current.duration));
          }
        }}
        onEnded={handleAudioEnded}
      />

      {/* BARRA SUPERIOR DE NAVEGACIÓN: VOLVER A PORTADA INICIAL E IR A PÁGINA 2 */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5DEC9]">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleGoPage('portada')}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#F3EFE6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#78350F] hover:text-[#78350F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#78350F]" />
            <span>Volver a la Portada Inicial</span>
          </button>

          <button
            type="button"
            onClick={() => handleGoPage('indicaciones')}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-4 py-2.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#78350F]" />
            <span>Ver Página 2: Indicaciones Precisas</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSaveAllOffline}
            disabled={isSavingAllOffline}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-3.5 py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#78350F] transition-colors cursor-pointer"
          >
            <HardDriveDownload className="w-3.5 h-3.5 text-[#78350F]" />
            <span>
              {isSavingAllOffline
                ? 'Guardando audios...'
                : offlineSavedIds.length === tracks.length
                ? 'Todos disponibles sin conexión'
                : 'Guardar todos sin conexión'}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#78350F] px-4 py-2.5 text-xs font-semibold text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir o Actualizar Audio</span>
          </button>
        </div>
      </div>

      {/* ENCABEZADO Y PANEL DE CONTROL DE REPRODUCCIÓN CONTINUA */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-2 text-xs text-[#78350F] font-medium">
            <span>Página 3 · Biblioteca y Reproductor</span>
            <span aria-hidden="true">·</span>
            <span>Secuencia de Meditación Gnóstica</span>
          </div>
          <h1
            className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[#1C1917] leading-tight"
            style={{ textWrap: 'balance' }}
          >
            Audios Dirigidos de Meditación
          </h1>
          <p className="mt-3 text-base text-[#44403C] leading-relaxed">
            Cada audio cuenta con su propio reproductor, título, crédito del autor y opción de descarga directa. Active la <strong>reproducción continua</strong> para que los audios se reproduzcan uno detrás del otro sin interrupción durante toda su práctica.
          </p>
        </div>

        {/* Panel de Controles de Continuidad y Voz Guía */}
        <div className="lg:col-span-5 rounded-2xl border border-[#D6CEBE] bg-[#F3EFE6] p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#1C1917] flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#78350F]" />
                <span>Continuar uno detrás del otro</span>
              </p>
              <p className="text-xs text-[#57534E] mt-0.5">
                Al finalizar un audio, inicia automáticamente el siguiente de la lista.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={continuousPlayback}
              onClick={() => setContinuousPlayback((prev) => !prev)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                continuousPlayback
                  ? 'bg-[#78350F] text-[#FBF9F5]'
                  : 'bg-[#FBF9F5] text-[#57534E] border border-[#D6CEBE]'
              }`}
            >
              {continuousPlayback ? 'Activo (Continuo)' : 'Desactivado'}
            </button>
          </div>

          <div className="pt-3 border-t border-[#E5DEC9] flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#1C1917]">
                Voz guía hablada en español en cada fase
              </p>
              <p className="text-[11px] text-[#57534E]">
                Acompaña los cuencos y armónicos leyendo la instrucción de cada etapa.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSpokenGuideEnabled((prev) => {
                  if (prev && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  return !prev;
                });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                spokenGuideEnabled
                  ? 'bg-[#1C1917] text-[#FBF9F5]'
                  : 'bg-[#FBF9F5] text-[#57534E] border border-[#D6CEBE]'
              }`}
            >
              {spokenGuideEnabled ? 'Voz Activa' : 'Solo Sonido'}
            </button>
          </div>

          <div className="pt-3 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const firstTrack = filteredTracks[0] || tracks[0];
                if (firstTrack) {
                  setContinuousPlayback(true);
                  setActiveTrackId(firstTrack.id);
                  setIsPlaying(true);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#78350F] px-4 py-2 text-xs font-semibold text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Iniciar secuencia completa desde el Audio 01</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const nextMute = !isMuted;
                  setIsMuted(nextMute);
                  if (audioRef.current) audioRef.current.muted = nextMute;
                }}
                className="p-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] hover:bg-white cursor-pointer"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-[#9A3412]" /> : <Volume2 className="w-4 h-4 text-[#78350F]" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  setIsMuted(val === 0);
                  if (audioRef.current) {
                    audioRef.current.volume = val;
                    audioRef.current.muted = val === 0;
                  }
                }}
                aria-label="Volumen general"
                className="warm-slider w-20 bg-[#D6CEBE] rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FILTRO INTERACTIVO POR VENERABLE MAESTRO / INSPIRACIÓN */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[#E5DEC9] py-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EFE6] rounded-xl border border-[#D6CEBE]">
          {[
            { id: 'all', label: `Todos los Audios (${tracks.length})` },
            { id: 'cristo', label: 'Jesús el Cristo' },
            { id: 'samael', label: 'V.M. Samael Aun Weor' },
            { id: 'lakhsmi', label: 'V.M. Lakhsmi Daimon' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMasterFilter(tab.id as 'all' | 'cristo' | 'samael' | 'lakhsmi')}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                masterFilter === tab.id
                  ? 'bg-[#FBF9F5] text-[#1C1917] font-semibold shadow-2xs border border-[#D6CEBE]'
                  : 'text-[#57534E] hover:text-[#1C1917]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-[#57534E] font-mono tabular-nums">
          {offlineSavedIds.length} de {tracks.length} audios guardados en memoria offline
        </div>
      </div>

      {/* LISTA DE AUDIOS DIRIGIDOS CON REPRODUCTOR EN CADA AUDIO */}
      <section className="space-y-6">
        {filteredTracks.map((track, idx) => {
          const isThisTrackActive = activeTrackId === track.id;
          const isThisTrackPlaying = isThisTrackActive && isPlaying;
          const isSavedOffline = offlineSavedIds.includes(track.id);
          const masterFigure = getMasterFigure(track.masterReference);

          const trackCurrTime = isThisTrackActive ? currentTime : 0;
          const trackDur = isThisTrackActive ? duration : track.durationSeconds;

          // Determine current guided step for this track
          const activeStepIdx = isThisTrackActive
            ? Math.max(
                0,
                track.steps.reduce(
                  (acc, step, sIdx) => (trackCurrTime >= step.atSecond ? sIdx : acc),
                  0
                )
              )
            : 0;
          const currentStep = track.steps[activeStepIdx] || track.steps[0];
          const nextTrackInQueue =
            idx < filteredTracks.length - 1 ? filteredTracks[idx + 1] : null;

          return (
            <article
              key={track.id}
              id={`audio-card-${track.id}`}
              className={`rounded-2xl border transition-all duration-150 p-6 sm:p-8 ${
                isThisTrackActive
                  ? 'border-[#78350F] bg-[#F3EFE6]/90 shadow-sm'
                  : 'border-[#D6CEBE] bg-[#FBF9F5] hover:border-[#78350F]/50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Columna Izquierda: Imagen del Maestro, Título y Crédito del Autor */}
                <div className="flex items-start gap-4 sm:gap-5 flex-1">
                  <div className="h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden rounded-xl border border-[#D6CEBE] bg-[#F3EFE6]">
                    <ResilientImage
                      src={masterFigure.imageUrl}
                      alt={masterFigure.name}
                      className="h-full w-full object-cover object-top"
                      fallbackTitle={masterFigure.name}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Metadatos limpios sin píldoras */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#78350F] font-medium">
                      <span>{track.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Actualizado: {track.updatedAt}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {track.baseFrequencyHz} Hz
                      </span>
                      {isThisTrackPlaying && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#9A3412]">
                            Reproduciendo ahora
                          </span>
                        </>
                      )}
                    </div>

                    {/* TÍTULO DEL AUDIO */}
                    <h2 className="mt-1.5 font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]">
                      {track.title}
                    </h2>

                    {/* NOMBRE O CRÉDITO DEL AUTOR */}
                    <p className="mt-1 text-sm font-semibold text-[#44403C]">
                      Autor / Crédito: <span className="text-[#78350F]">{track.authorCredit}</span>
                    </p>

                    <p className="mt-2 text-sm text-[#57534E] leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>

                {/* Columna Derecha: Botones de Descarga, Uso Sin Conexión y Edición */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDownloadTrackFile(track)}
                    disabled={downloadingId === track.id}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-3.5 py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#78350F] hover:text-[#78350F] transition-colors cursor-pointer whitespace-nowrap"
                    title="Descargar archivo de audio a su dispositivo"
                  >
                    <Download className="w-3.5 h-3.5 text-[#78350F]" />
                    <span>
                      {downloadingId === track.id ? 'Descargando...' : 'Descargar Audio'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveOfflineSingle(track)}
                    disabled={savingOfflineId === track.id}
                    className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isSavedOffline
                        ? 'border-[#78350F]/40 bg-[#F3EFE6] text-[#78350F]'
                        : 'border-[#D6CEBE] bg-[#FBF9F5] text-[#57534E] hover:text-[#1C1917]'
                    }`}
                    title="Guardar audio en la memoria sin conexión de la aplicación"
                  >
                    {isSavedOffline ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#78350F]" />
                        <span>Listo sin conexión</span>
                      </>
                    ) : (
                      <>
                        <HardDriveDownload className="w-3.5 h-3.5" />
                        <span>
                          {savingOfflineId === track.id ? 'Guardando...' : 'Guardar offline'}
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onEditTrack(track)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-3 py-2.5 text-xs font-medium text-[#57534E] hover:text-[#1C1917] transition-colors cursor-pointer"
                    title="Actualizar este audio o subir nueva versión"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Actualizar</span>
                  </button>
                </div>
              </div>

              {/* REPRODUCTOR INTEGRADO EN CADA AUDIO */}
              <div className="mt-6 pt-5 border-t border-[#E5DEC9]">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Controles Play / Pause / Anterior / Siguiente */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (isThisTrackActive) {
                          handlePlayPrev();
                        } else {
                          handleSeek(track, 0);
                        }
                      }}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] hover:border-[#78350F] transition-colors cursor-pointer"
                      aria-label="Audio anterior o reiniciar"
                      title="Audio anterior o reiniciar"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePlayTrack(track)}
                      className="min-h-[48px] px-5 flex items-center justify-center gap-2.5 rounded-xl bg-[#78350F] text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer font-semibold text-xs whitespace-nowrap shadow-xs"
                    >
                      {isThisTrackPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-current" />
                          <span>Pausar Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          <span>Reproducir Audio</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (isThisTrackActive) {
                          handlePlayNext();
                        } else if (nextTrackInQueue) {
                          setActiveTrackId(nextTrackInQueue.id);
                          setIsPlaying(true);
                        }
                      }}
                      disabled={!nextTrackInQueue}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-[#D6CEBE] bg-[#FBF9F5] text-[#1C1917] hover:border-[#78350F] disabled:opacity-40 transition-colors cursor-pointer"
                      aria-label="Siguiente audio"
                      title="Pasar al siguiente audio"
                    >
                      <SkipForward className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Barra de Progreso y Tiempo Tabular */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums text-[#57534E] mb-1.5">
                      <span>{formatTime(trackCurrTime)}</span>
                      <span className="font-sans text-[#1C1917] font-medium truncate px-2">
                        {currentStep ? `${currentStep.phaseTitle}` : track.title}
                      </span>
                      <span>{formatTime(trackDur)}</span>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={trackDur || 90}
                      step={1}
                      value={trackCurrTime}
                      onChange={(e) => handleSeek(track, Number(e.target.value))}
                      aria-label={`Progreso de ${track.title}`}
                      className="warm-slider w-full bg-[#D6CEBE] rounded-full"
                    />
                  </div>
                </div>

                {/* Guía Dirigida Paso a Paso de este Audio */}
                <div className="mt-4 rounded-xl border border-[#E5DEC9] bg-[#FBF9F5] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#78350F] font-semibold">
                    <span>
                      Guía Dirigida ({currentStep?.phaseTitle || 'Fase I'}):
                    </span>
                    {continuousPlayback && nextTrackInQueue && (
                      <span className="text-[#57534E] font-normal">
                        Al terminar continuará con: <strong className="text-[#1C1917]">{nextTrackInQueue.title}</strong>
                      </span>
                    )}
                  </div>

                  <p className="mt-1.5 font-serif text-lg sm:text-xl text-[#1C1917] italic leading-relaxed">
                    «{currentStep?.instruction}»
                  </p>

                  {/* Botones para saltar directamente a cualquier fase dentro del audio */}
                  <div className="mt-3 pt-3 border-t border-[#F3EFE6] flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-[#78716C] mr-1">Fases del audio:</span>
                    {track.steps.map((step, sIdx) => {
                      const isStepCurrent = isThisTrackActive && activeStepIdx === sIdx;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => {
                            if (activeTrackId !== track.id) {
                              setActiveTrackId(track.id);
                              setIsPlaying(true);
                            }
                            handleSeek(track, step.atSecond);
                          }}
                          className={`rounded-md px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                            isStepCurrent
                              ? 'bg-[#78350F] text-[#FBF9F5] font-medium'
                              : 'bg-[#F3EFE6] text-[#57534E] hover:text-[#1C1917]'
                          }`}
                        >
                          <span className="font-mono tabular-nums mr-1">
                            {formatTime(step.atSecond)}
                          </span>
                          <span>· {step.phaseTitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* PIE DE NAVEGACIÓN DE LA PÁGINA 3: VOLVER A PORTADA Y SUBIR AL INICIO */}
      <div className="pt-8 border-t border-[#E5DEC9] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleGoPage('portada')}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#F3EFE6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#78350F] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4 text-[#78350F]" />
            <span>Volver a la Portada Inicial (Página 1)</span>
          </button>

          <button
            type="button"
            onClick={() => handleGoPage('indicaciones')}
            className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#78350F]" />
            <span>Ir a Indicaciones Precisas (Página 2)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 rounded-lg bg-[#78350F] px-5 py-2.5 text-xs font-semibold text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
          <span>Subir al inicio de la página</span>
        </button>
      </div>
    </div>
  );
};
