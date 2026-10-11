import { MeditationTrack } from '../types/meditation';

const DB_NAME = 'meditacion_gnostica_offline_db';
const DB_VERSION = 1;
const STORE_TRACKS = 'custom_tracks';
const STORE_BLOBS = 'offline_audio_blobs';

const VISIT_STORAGE_KEY = 'meditacion_gnostica_visit_state_v1';

export interface VisitState {
  visitCount: number;
  firstVisitIso: string;
  lastVisitIso: string;
  lastSeenTrackCount: number;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_TRACKS)) {
        db.createObjectStore(STORE_TRACKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BLOBS)) {
        db.createObjectStore(STORE_BLOBS);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomOrUpdatedTrack(track: MeditationTrack, audioBlob?: Blob): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_TRACKS, STORE_BLOBS], 'readwrite');
    tx.objectStore(STORE_TRACKS).put(track);
    if (audioBlob) {
      tx.objectStore(STORE_BLOBS).put(audioBlob, track.id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllStoredTracks(): Promise<MeditationTrack[]> {
  try {
    const db = await openDatabase();
    return await new Promise<MeditationTrack[]>((resolve, reject) => {
      const tx = db.transaction(STORE_TRACKS, 'readonly');
      const req = tx.objectStore(STORE_TRACKS).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function saveOfflineAudioBlob(trackId: string, blob: Blob): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_BLOBS, 'readwrite');
    tx.objectStore(STORE_BLOBS).put(blob, trackId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOfflineAudioBlob(trackId: string): Promise<Blob | undefined> {
  try {
    const db = await openDatabase();
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE_BLOBS, 'readonly');
      const req = tx.objectStore(STORE_BLOBS).get(trackId);
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return undefined;
  }
}

export async function getAllOfflineSavedTrackIds(): Promise<string[]> {
  try {
    const db = await openDatabase();
    return await new Promise<string[]>((resolve, reject) => {
      const tx = db.transaction(STORE_BLOBS, 'readonly');
      const req = tx.objectStore(STORE_BLOBS).getAllKeys();
      req.onsuccess = () => resolve((req.result || []).map(String));
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

export async function removeOfflineAudioBlob(trackId: string): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_BLOBS, 'readwrite');
    tx.objectStore(STORE_BLOBS).delete(trackId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export function getAndRecordUserVisit(currentTrackCount: number): {
  isReturningUser: boolean;
  visitCount: number;
  previousVisitFormatted: string;
} {
  try {
    const raw = localStorage.getItem(VISIT_STORAGE_KEY);
    const nowIso = new Date().toISOString();
    if (!raw) {
      const initial: VisitState = {
        visitCount: 1,
        firstVisitIso: nowIso,
        lastVisitIso: nowIso,
        lastSeenTrackCount: currentTrackCount
      };
      localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(initial));
      return {
        isReturningUser: true, // Always show the rich updates section on the cover page while greeting the user warmly
        visitCount: 1,
        previousVisitFormatted: 'Hoy'
      };
    }
    const parsed: VisitState = JSON.parse(raw);
    const prevDate = new Date(parsed.lastVisitIso);
    const formatted = prevDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const updated: VisitState = {
      ...parsed,
      visitCount: (parsed.visitCount || 1) + 1,
      lastVisitIso: nowIso,
      lastSeenTrackCount: currentTrackCount
    };
    localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(updated));
    return {
      isReturningUser: true,
      visitCount: updated.visitCount,
      previousVisitFormatted: formatted
    };
  } catch {
    return {
      isReturningUser: true,
      visitCount: 2,
      previousVisitFormatted: 'Reciente'
    };
  }
}
