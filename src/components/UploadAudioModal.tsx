import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Music } from 'lucide-react';
import { MeditationTrack } from '../types/meditation';

interface UploadAudioModalProps {
  isOpen: boolean;
  editingTrack: MeditationTrack | null;
  nextOrderNumber: number;
  onClose: () => void;
  onSaveTrack: (track: MeditationTrack, customBlob?: Blob) => Promise<void>;
}

export const UploadAudioModal: React.FC<UploadAudioModalProps> = ({
  isOpen,
  editingTrack,
  nextOrderNumber,
  onClose,
  onSaveTrack,
}) => {
  const [title, setTitle] = useState('');
  const [authorCredit, setAuthorCredit] = useState('');
  const [masterReference, setMasterReference] = useState<'cristo' | 'samael' | 'lakhsmi'>('samael');
  const [category, setCategory] = useState('Práctica Dirigida · Meditación Interior');
  const [updateSummary, setUpdateSummary] = useState('');
  const [description, setDescription] = useState('');
  const [baseFrequencyHz, setBaseFrequencyHz] = useState<number>(432);
  const [step1Text, setStep1Text] = useState('Relaje el cuerpo físico y aquiete la respiración.');
  const [step2Text, setStep2Text] = useState('Dirija la atención al santuario del corazón en silencio.');
  const [step3Text, setStep3Text] = useState('Permanezca en contemplación interior y gratitud.');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [detectedDuration, setDetectedDuration] = useState<number>(90);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingTrack) {
      setTitle(editingTrack.title);
      setAuthorCredit(editingTrack.authorCredit);
      setMasterReference(editingTrack.masterReference);
      setCategory(editingTrack.category);
      setUpdateSummary(editingTrack.updateSummary);
      setDescription(editingTrack.description);
      setBaseFrequencyHz(editingTrack.baseFrequencyHz || 432);
      setDetectedDuration(editingTrack.durationSeconds || 90);
      setStep1Text(editingTrack.steps[0]?.instruction || 'Relaje el cuerpo físico y aquiete la respiración.');
      setStep2Text(editingTrack.steps[1]?.instruction || 'Dirija la atención al santuario del corazón en silencio.');
      setStep3Text(editingTrack.steps[2]?.instruction || 'Permanezca en contemplación interior y gratitud.');
      setSelectedFile(null);
    } else {
      const paddedOrder = String(nextOrderNumber).padStart(2, '0');
      setTitle(`${paddedOrder}. Meditación en la Quietud del Corazón`);
      setAuthorCredit('V.M. Samael Aun Weor · Tradición Gnóstica');
      setMasterReference('samael');
      setCategory('Fase Especial · Meditación Dirigida');
      setUpdateSummary('Nuevo audio dirigido incorporado a la biblioteca sin conexión.');
      setDescription('Práctica guiada para profundizar en el silencio interior, la relajación de los tres cerebros y la comunión con el Ser.');
      setBaseFrequencyHz(432);
      setDetectedDuration(90);
      setStep1Text('Cierre suavemente sus ojos y relaje todos los músculos del cuerpo.');
      setStep2Text('Escuche el sonido interior en el templo-corazón sin identificarse con ningún pensamiento.');
      setStep3Text('Irradie paz y gratitud desde su corazón hacia toda la creación.');
      setSelectedFile(null);
    }
  }, [editingTrack, nextOrderNumber, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);

    const tempUrl = URL.createObjectURL(file);
    const tempAudio = new Audio(tempUrl);
    tempAudio.addEventListener('loadedmetadata', () => {
      if (tempAudio.duration && isFinite(tempAudio.duration)) {
        setDetectedDuration(Math.max(10, Math.round(tempAudio.duration)));
      }
      URL.revokeObjectURL(tempUrl);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorCredit.trim()) return;
    setIsSaving(true);

    try {
      const nowFormatted = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      const dur = detectedDuration || 90;
      const trackToSave: MeditationTrack = {
        id: editingTrack ? editingTrack.id : `med-custom-${Date.now()}`,
        order: editingTrack ? editingTrack.order : nextOrderNumber,
        title: title.trim(),
        authorCredit: authorCredit.trim(),
        masterReference,
        category: category.trim() || 'Meditación Dirigida',
        durationSeconds: dur,
        updatedAt: nowFormatted,
        isNewUpdate: true,
        updateSummary:
          updateSummary.trim() ||
          (editingTrack
            ? 'Audio actualizado recientemente para la comunidad.'
            : 'Nuevo audio dirigido subido a la biblioteca.'),
        description: description.trim(),
        baseFrequencyHz,
        harmonicFrequencyHz: Math.round(baseFrequencyHz * 1.5),
        isCustomUploaded: editingTrack?.isCustomUploaded || !!selectedFile,
        customFileName: selectedFile ? selectedFile.name : editingTrack?.customFileName,
        steps: [
          {
            atSecond: 0,
            phaseTitle: 'Fase I · Inicio y Relajación',
            instruction: step1Text.trim() || 'Inicie con respiración serena y relajación corporal.',
          },
          {
            atSecond: Math.floor(dur * 0.35),
            phaseTitle: 'Fase II · Interiorización Profunda',
            instruction: step2Text.trim() || 'Mantenga la atención en el corazón sin distraerse.',
          },
          {
            atSecond: Math.floor(dur * 0.7),
            phaseTitle: 'Fase III · Contemplación y Cierre',
            instruction: step3Text.trim() || 'Dé gracias al Ser Interior y conserve la paz.',
          },
        ],
      };

      await onSaveTrack(trackToSave, selectedFile || undefined);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-[#D6CEBE] bg-[#FBF9F5] p-6 md:p-8 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-[#E5DEC9] pb-4">
          <div>
            <h2 className="text-2xl font-serif font-semibold text-[#1C1917]">
              {editingTrack ? 'Actualizar Audio Dirigido' : 'Subir Nuevo Audio de Meditación'}
            </h2>
            <p className="mt-1 text-xs text-[#57534E]">
              El audio se guardará en la biblioteca sin conexión y aparecerá en la sección de Últimas Actualizaciones de la Portada.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#57534E] hover:bg-[#F3EFE6] hover:text-[#1C1917] transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Título del Audio *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. 07. Meditación en la Divina Madre"
                className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#78350F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Nombre o Crédito del Autor *
              </label>
              <input
                type="text"
                required
                value={authorCredit}
                onChange={(e) => setAuthorCredit(e.target.value)}
                placeholder="Ej. V.M. Samael Aun Weor / V.M. Lakhsmi Daimon"
                className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#78350F] focus:outline-none"
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {[
                  'V.M. Samael Aun Weor',
                  'V.M. Lakhsmi Daimon',
                  'Inspirado en Jesús el Cristo',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAuthorCredit(preset)}
                    className="text-[11px] text-[#78350F] hover:underline cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Imagen de Referencia Espiritual
              </label>
              <select
                value={masterReference}
                onChange={(e) => setMasterReference(e.target.value as 'cristo' | 'samael' | 'lakhsmi')}
                className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#78350F] focus:outline-none"
              >
                <option value="cristo">Jesús el Cristo</option>
                <option value="samael">Venerable Maestro Samael Aun Weor</option>
                <option value="lakhsmi">Venerable Maestro Lakhsmi Daimon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
                Nota para «Últimas Actualizaciones» en Portada
              </label>
              <input
                type="text"
                value={updateSummary}
                onChange={(e) => setUpdateSummary(e.target.value)}
                placeholder="Ej. Nueva grabación con campanas tibetanas"
                className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3.5 py-2.5 text-sm text-[#1C1917] focus:border-[#78350F] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1917] mb-1.5">
              Descripción del Audio Dirigido
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3.5 py-2 text-sm text-[#1C1917] focus:border-[#78350F] focus:outline-none"
            />
          </div>

          {/* File upload or synthesized harmonic audio */}
          <div className="rounded-xl border border-[#E5DEC9] bg-[#F3EFE6] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[#1C1917] flex items-center gap-1.5">
                  <Music className="w-4 h-4 text-[#78350F]" />
                  <span>Archivo de Audio (.mp3, .wav, .ogg, .m4a)</span>
                </p>
                <p className="text-xs text-[#57534E] mt-0.5">
                  Suba un archivo desde su dispositivo o deje vacío para generar audio armónico meditativo con cuencos tibetanos.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 rounded-lg border border-[#D6CEBE] bg-[#FBF9F5] px-3.5 py-2 text-xs font-medium text-[#1C1917] hover:bg-white transition-colors cursor-pointer shrink-0">
                <Upload className="w-3.5 h-3.5 text-[#78350F]" />
                <span>Seleccionar archivo</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {selectedFile ? (
              <p className="mt-2 text-xs font-medium text-[#78350F]">
                Archivo cargado: {selectedFile.name} ({detectedDuration} seg) · Se guardará para uso sin conexión.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <span className="text-xs text-[#57534E]">Frecuencia armónica si se sintetiza:</span>
                {[432, 528, 396].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setBaseFrequencyHz(freq)}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors cursor-pointer ${
                      baseFrequencyHz === freq
                        ? 'bg-[#78350F] text-[#FBF9F5]'
                        : 'bg-[#FBF9F5] text-[#57534E] border border-[#D6CEBE]'
                    }`}
                  >
                    {freq} Hz
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guided steps instructions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-[#1C1917]">
              Indicaciones de las Fases del Audio (para guía en pantalla y síntesis de voz):
            </p>
            <input
              type="text"
              value={step1Text}
              onChange={(e) => setStep1Text(e.target.value)}
              placeholder="Fase 1: Relajación inicial..."
              className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3 py-2 text-xs text-[#1C1917]"
            />
            <input
              type="text"
              value={step2Text}
              onChange={(e) => setStep2Text(e.target.value)}
              placeholder="Fase 2: Interiorización y silencio..."
              className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3 py-2 text-xs text-[#1C1917]"
            />
            <input
              type="text"
              value={step3Text}
              onChange={(e) => setStep3Text(e.target.value)}
              placeholder="Fase 3: Contemplación y cierre..."
              className="w-full rounded-lg border border-[#D6CEBE] bg-white px-3 py-2 text-xs text-[#1C1917]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#E5DEC9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#D6CEBE] px-4 py-2 text-xs font-medium text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#78350F] px-5 py-2.5 text-xs font-medium text-[#FBF9F5] hover:bg-[#9A3412] transition-colors cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSaving ? 'Guardando...' : editingTrack ? 'Guardar Actualización' : 'Publicar Nuevo Audio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
