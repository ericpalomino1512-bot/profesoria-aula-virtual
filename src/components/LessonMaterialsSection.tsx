import React, { useState, useRef } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  BookOpen, 
  Paperclip, 
  Plus, 
  Trash2, 
  FileText, 
  ExternalLink,
  Printer
} from 'lucide-react';
import type { Lesson, LessonAttachment } from '../types/course';
import { 
  downloadLessonExcelWorkbook, 
  openLessonEbookPrintView 
} from '../services/materialGenerator';

interface LessonMaterialsSectionProps {
  lesson: Lesson;
  courseTitle: string;
  unitTitle: string;
  attachments?: LessonAttachment[];
  onAddAttachment: (att: LessonAttachment) => void;
  onRemoveAttachment: (attId: string) => void;
}

export const LessonMaterialsSection: React.FC<LessonMaterialsSectionProps> = ({
  lesson,
  courseTitle,
  unitTitle,
  attachments = [],
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [attachType, setAttachType] = useState<'file' | 'link'>('file');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      let type: 'ebook' | 'excel' | 'pdf' | 'doc' = 'pdf';
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') type = 'excel';
      else if (ext === 'pdf') type = 'pdf';
      else if (ext === 'docx' || ext === 'doc') type = 'doc';

      const reader = new FileReader();
      reader.onload = () => {
        const newAtt: LessonAttachment = {
          id: `att-custom-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          type,
          fileName: file.name,
          fileSizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
          description: `Material adicional adjuntado por el docente para la lección ${lesson.lessonNumber}.`,
          downloadDataUrl: reader.result as string,
          uploadedAt: new Date().toLocaleDateString('es-ES')
        };
        onAddAttachment(newAtt);
        setShowAttachModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;

    const newAtt: LessonAttachment = {
      id: `att-link-${Date.now()}`,
      title: linkTitle.trim(),
      type: 'link',
      fileName: linkUrl.trim(),
      description: linkDescription.trim() || 'Enlace externo de profundización.',
      uploadedAt: new Date().toLocaleDateString('es-ES')
    };

    onAddAttachment(newAtt);
    setLinkTitle('');
    setLinkUrl('');
    setLinkDescription('');
    setShowAttachModal(false);
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'excel':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'ebook':
        return <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />;
      case 'link':
        return <ExternalLink className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <FileText className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
            <Paperclip className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Recursos de Estudio Descargables
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Materiales de la Clase (Ebook, Excel y Documentos)
            </h3>
          </div>
        </div>

        {/* Attach file button */}
        <button
          type="button"
          onClick={() => setShowAttachModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Adjuntar Material Propio</span>
        </button>
      </div>

      {/* Grid of Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Resource 1: Ebook PDF */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-violet-50/60 to-purple-50/40 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-200/80 dark:border-violet-800/60 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200">
                <BookOpen className="w-3.5 h-3.5" /> Ebook de Estudio (PDF)
              </span>
              <span className="text-xs text-slate-500 font-medium">185 KB</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Guía Editorial y Cuaderno de la Lección {lesson.lessonNumber}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Incluye marco teórico completo, diagramas visuales, glosario de términos y los 4 bloques listos para lectura sin conexión o impresión.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openLessonEbookPrintView(lesson, courseTitle, unitTitle)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Abrir / Guardar Ebook en PDF</span>
          </button>
        </div>

        {/* Resource 2: Excel Workbook */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Plantilla Excel (.xlsx)
              </span>
              <span className="text-xs text-slate-500 font-medium">45 KB</span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Libro de Práctica y Ejercicios Formateados
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Plantilla de cálculo en Excel lista para resolver la actividad práctica, con tablas estructuradas, enunciados y rúbrica de calificación.
            </p>
          </div>

          <button
            type="button"
            onClick={() => downloadLessonExcelWorkbook(lesson, courseTitle)}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Plantilla Excel (.xlsx)</span>
          </button>
        </div>

      </div>

      {/* User Custom Attached Materials */}
      {attachments.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Materiales Adicionales Adjuntados ({attachments.length})
          </h4>

          <div className="space-y-2">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-xs shrink-0">
                    {getAttachmentIcon(att.type)}
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {att.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {att.fileName} {att.fileSizeFormatted ? `• ${att.fileSizeFormatted}` : ''} • {att.uploadedAt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {att.downloadDataUrl && (
                    <a
                      href={att.downloadDataUrl}
                      download={att.fileName}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                      title="Descargar archivo"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                  {att.type === 'link' && (
                    <a
                      href={att.fileName.startsWith('http') ? att.fileName : `https://${att.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40"
                      title="Abrir enlace externo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(att.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Eliminar adjunto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to attach files or links */}
      {showAttachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Adjuntar Material a la Lección {lesson.lessonNumber}
              </h3>
              <button
                type="button"
                onClick={() => setShowAttachModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Sub-tabs: Upload File vs Link */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setAttachType('file')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  attachType === 'file'
                    ? 'bg-white dark:bg-slate-900 text-violet-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Subir Archivo (Excel / PDF / Ebook)
              </button>
              <button
                type="button"
                onClick={() => setAttachType('link')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  attachType === 'link'
                    ? 'bg-white dark:bg-slate-900 text-violet-600 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Enlace Externo
              </button>
            </div>

            {attachType === 'file' ? (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf,.docx,.doc,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-violet-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 dark:bg-slate-800/40"
                >
                  <Paperclip className="w-8 h-8 text-violet-500 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Haz clic para seleccionar tu archivo
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Soporta hojas Excel (.xlsx, .csv), Ebooks en PDF o Word.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Título del recurso:
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Ej. Hoja de cálculo en Google Sheets de ejemplo"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    URL o enlace:
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAttachModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    disabled={!linkTitle.trim() || !linkUrl.trim()}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-violet-600 rounded-xl disabled:opacity-40"
                  >
                    Guardar enlace
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
