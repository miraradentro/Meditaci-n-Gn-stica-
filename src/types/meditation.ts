export type PageId = 'portada' | 'indicaciones' | 'audios';

export interface GuidedStep {
  atSecond: number;
  phaseTitle: string;
  instruction: string;
}

export interface MeditationTrack {
  id: string;
  order: number;
  title: string;
  authorCredit: string;
  masterReference: 'cristo' | 'samael' | 'lakhsmi';
  category: string;
  durationSeconds: number;
  updatedAt: string;
  isNewUpdate?: boolean;
  updateSummary: string;
  description: string;
  baseFrequencyHz: number;
  harmonicFrequencyHz: number;
  steps: GuidedStep[];
  isCustomUploaded?: boolean;
  customFileName?: string;
}

export interface SacredFigure {
  id: 'cristo' | 'samael' | 'lakhsmi';
  name: string;
  title: string;
  imageUrl: string;
  quote: string;
  teaching: string;
}

export interface PreciseIndication {
  number: string;
  title: string;
  subtitle: string;
  body: string;
  keyPractice: string;
}
