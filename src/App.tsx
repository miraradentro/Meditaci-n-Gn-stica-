import { useEffect, useState } from 'react';
import { INITIAL_MEDITATION_TRACKS } from './data/meditationData';
import { MeditationTrack, PageId } from './types/meditation';
import { TopNavBar } from './components/TopNavBar';
import { PortadaPage } from './components/PortadaPage';
import { IndicacionesPage } from './components/IndicacionesPage';
import { AudiosPage } from './components/AudiosPage';
import { PageFooter } from './components/PageFooter';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { UploadAudioModal } from './components/UploadAudioModal';
import {
  getAllOfflineSavedTrackIds,
  getAllStoredTracks,
  getAndRecordUserVisit,
  saveCustomOrUpdatedTrack,
  saveOfflineAudioBlob,
} from './utils/offlineStorage';
import {
  getTrackBlobForDownload,
  setCustomTrackBlob,
} from './utils/audioSynthesizer';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('portada');
  const [tracks, setTracks] = useState<MeditationTrack[]>(INITIAL_MEDITATION_TRACKS);
  const [offlineSavedIds, setOfflineSavedIds] = useState<string[]>([]);
  const [selectedTrackFromCover, setSelectedTrackFromCover] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [editingTrack, setEditingTrack] = useState<MeditationTrack | null>(null);
  const [isSavingAllOffline, setIsSavingAllOffline] = useState<boolean>(false);
  const [visitInfo, setVisitInfo] = useState({
    isReturningUser: true,
    visitCount: 1,
    previousVisitFormatted: 'Hoy',
  });

  useEffect(() => {
    async function initializeOfflineState() {
      const storedTracks = await getAllStoredTracks();
      let mergedTracks = [...INITIAL_MEDITATION_TRACKS];

      if (storedTracks.length > 0) {
        const storedMap = new Map(storedTracks.map((t) => [t.id, t]));
        mergedTracks = INITIAL_MEDITATION_TRACKS.map((initTrack) =>
          storedMap.get(initTrack.id) || initTrack
        );
        for (const st of storedTracks) {
          if (!mergedTracks.some((m) => m.id === st.id)) {
            mergedTracks.push(st);
          }
        }
        mergedTracks.sort((a, b) => a.order - b.order);
        setTracks(mergedTracks);
      }

      const savedIds = await getAllOfflineSavedTrackIds();
      setOfflineSavedIds(savedIds);

      const visit = getAndRecordUserVisit(mergedTracks.length);
      setVisitInfo(visit);
    }

    initializeOfflineState();
  }, []);

  const handlePlayTrackFromCover = (trackId: string) => {
    setSelectedTrackFromCover(trackId);
    setCurrentPage('audios');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSingleTrackOffline = async (track: MeditationTrack) => {
    const blob = getTrackBlobForDownload(track);
    await saveOfflineAudioBlob(track.id, blob);
    const updatedIds = await getAllOfflineSavedTrackIds();
    setOfflineSavedIds(updatedIds);
  };

  const handleSaveAllOffline = async () => {
    setIsSavingAllOffline(true);
    try {
      for (const track of tracks) {
        if (!offlineSavedIds.includes(track.id)) {
          const blob = getTrackBlobForDownload(track);
          await saveOfflineAudioBlob(track.id, blob);
        }
      }
      const updatedIds = await getAllOfflineSavedTrackIds();
      setOfflineSavedIds(updatedIds);
    } finally {
      setIsSavingAllOffline(false);
    }
  };

  const handleSaveUploadedOrUpdatedTrack = async (
    trackToSave: MeditationTrack,
    customBlob?: Blob
  ) => {
    const finalBlob = customBlob || getTrackBlobForDownload(trackToSave);
    if (customBlob) {
      setCustomTrackBlob(trackToSave.id, customBlob);
    }
    await saveCustomOrUpdatedTrack(trackToSave, finalBlob);

    setTracks((prev) => {
      const exists = prev.some((t) => t.id === trackToSave.id);
      const next = exists
        ? prev.map((t) => (t.id === trackToSave.id ? trackToSave : t))
        : [...prev, trackToSave];
      return [...next].sort((a, b) => a.order - b.order);
    });

    const updatedIds = await getAllOfflineSavedTrackIds();
    setOfflineSavedIds(updatedIds);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Barra superior de navegación con las 3 páginas y subida de nuevos audios */}
      <TopNavBar
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page !== 'audios') {
            setSelectedTrackFromCover(null);
          }
          setCurrentPage(page);
        }}
        onOpenUploadModal={() => {
          setEditingTrack(null);
          setIsUploadModalOpen(true);
        }}
      />

      {/* Contenido de la página activa */}
      <main className="flex-1">
        {currentPage === 'portada' && (
          <PortadaPage
            tracks={tracks}
            offlineSavedIds={offlineSavedIds}
            visitInfo={visitInfo}
            onNavigate={setCurrentPage}
            onPlayTrackFromCover={handlePlayTrackFromCover}
            onOpenUploadModal={() => {
              setEditingTrack(null);
              setIsUploadModalOpen(true);
            }}
            onSaveAllOffline={handleSaveAllOffline}
            isSavingAllOffline={isSavingAllOffline}
          />
        )}

        {currentPage === 'indicaciones' && (
          <IndicacionesPage onNavigate={setCurrentPage} />
        )}

        {currentPage === 'audios' && (
          <AudiosPage
            tracks={tracks}
            offlineSavedIds={offlineSavedIds}
            initialSelectedTrackId={selectedTrackFromCover}
            onNavigate={setCurrentPage}
            onOpenUploadModal={() => {
              setEditingTrack(null);
              setIsUploadModalOpen(true);
            }}
            onEditTrack={(track) => {
              setEditingTrack(track);
              setIsUploadModalOpen(true);
            }}
            onSaveTrackOffline={handleSaveSingleTrackOffline}
            onSaveAllOffline={handleSaveAllOffline}
            isSavingAllOffline={isSavingAllOffline}
          />
        )}
      </main>

      {/* Pie de página presente en cada página con enlace para volver a la portada inicial y subir al inicio */}
      <PageFooter currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Botón flotante siempre disponible en cada página para subir hasta el inicio desde cualquier lugar */}
      <ScrollToTopButton />

      {/* Indicador de estado sin conexión */}
      <OfflineIndicator />

      {/* Modal para subir nuevos audios o actualizar audios existentes */}
      <UploadAudioModal
        isOpen={isUploadModalOpen}
        editingTrack={editingTrack}
        nextOrderNumber={tracks.length + 1}
        onClose={() => {
          setIsUploadModalOpen(false);
          setEditingTrack(null);
        }}
        onSaveTrack={handleSaveUploadedOrUpdatedTrack}
      />
    </div>
  );
}
