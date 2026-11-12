import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  FileCode, 
  Eye, 
  X,
  Presentation
} from 'lucide-react';
import { parseDocumentFile } from '../services/documentParser';
import type { ParsedDocument } from '../services/documentParser';

interface DocumentUploadZoneProps {
  documents: ParsedDocument[];
  onDocumentsChange: (docs: ParsedDocument[]) => void;
  isProcessing: boolean;
  setIsProcessing: (val: boolean) => void;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  documents,
  onDocumentsChange,
  isProcessing,
  setIsProcessing,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<ParsedDocument | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = async (files: FileList | File[]) => {
    setErrorNotice(null);
    setIsProcessing(true);

    const newDocs: ParsedDocument[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const parsed = await parseDocumentFile(file);
        newDocs.push(parsed);
      } catch (err: any) {
        errors.push(`${file.name}: ${err.message || 'Error al procesar'}`);
      }
    }

    setIsProcessing(false);

    if (newDocs.length > 0) {
      onDocumentsChange([...documents, ...newDocs]);
    }

    if (errors.length > 0) {
      setErrorNotice(errors.join('. '));
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const handleRemoveDoc = (id: string) => {
    onDocumentsChange(documents.filter(d => d.id !== id));
  };

  const handleAddPastedText = () => {
    if (!pasteText.trim()) return;

    const syntheticDoc: ParsedDocument = {
      id: `doc-paste-${Date.now()}`,
      name: 'Apuntes_Pegados.txt',
      size: new Blob([pasteText]).size,
      type: 'text',
      extractedText: pasteText.trim(),
      sections: [{ title: 'Notas y Contenidos Introducidos', content: pasteText.trim() }],
      itemCount: pasteText.split('\n\n').length || 1
    };

    onDocumentsChange([...documents, syntheticDoc]);
    setPasteText('');
    setShowPasteArea(false);
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'pptx':
        return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'docx':
        return <FileSpreadsheet className="w-5 h-5 text-blue-500" />;
      default:
        return <FileCode className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Upload Box */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-violet-500 bg-violet-50/60 dark:bg-violet-950/30 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.pptx,.docx,.txt,.md,.markdown"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-xs">
            {isProcessing ? (
              <Loader2 className="w-7 h-7 animate-spin text-violet-600 dark:text-violet-400" />
            ) : (
              <UploadCloud className="w-7 h-7" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {isProcessing
                ? 'Extrayendo contenido de los documentos...'
                : 'Arrastra tus presentaciones o documentos aquí'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Soporta presentaciones <strong className="text-violet-600 dark:text-violet-400">PowerPoint (.pptx)</strong>, documentos <strong className="text-violet-600 dark:text-violet-400">PDF (.pdf)</strong>, <strong className="text-violet-600 dark:text-violet-400">Word (.docx)</strong> y notas en <strong className="text-violet-600 dark:text-violet-400">Texto / Markdown</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ⚡ 100% Local y Privado
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ✓ No requiere API Key
            </span>
          </div>
        </div>
      </div>

      {/* Button to toggle paste area */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>O si prefieres, pega el temario directamente:</span>
        <button
          type="button"
          onClick={() => setShowPasteArea(!showPasteArea)}
          className="font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          {showPasteArea ? 'Ocultar caja de texto' : 'Pegar texto o notas'}
        </button>
      </div>

      {/* Paste text area */}
      {showPasteArea && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 space-y-3 animate-in fade-in">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Pega aquí el contenido de tus diapositivas, índice o apuntes:
          </label>
          <textarea
            rows={5}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Pega texto aquí (ej. Diapositiva 1: Concepto X... Diapositiva 2: Propiedades Y...)"
            className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { setShowPasteArea(false); setPasteText(''); }}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAddPastedText}
              disabled={!pasteText.trim()}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 rounded-lg shadow-xs"
            >
              Agregar a la biblioteca
            </button>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorNotice && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{errorNotice}</span>
        </div>
      )}

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 px-1">
            <span>Documentos cargados ({documents.length})</span>
            <span className="text-violet-600 dark:text-violet-400 text-[11px]">
              Listos para construir el aula virtual
            </span>
          </div>

          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-purple-100 dark:border-slate-700 shadow-xs hover:border-violet-300 dark:hover:border-violet-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0">
                    {getDocIcon(doc.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[280px] sm:max-w-md">
                      {doc.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{(doc.size / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {doc.type === 'pptx' ? `${doc.itemCount} diapositivas` : `${doc.itemCount} páginas/secciones`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-violet-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Previsualizar texto extraído"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Eliminar documento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 p-6 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                {getDocIcon(previewDoc.type)}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {previewDoc.name}
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {previewDoc.itemCount} secciones/diapositivas extraídas con éxito
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {previewDoc.sections.map((sec, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Sección {idx + 1} {sec.pageOrSlideNumber ? `(Pág./Diap. ${sec.pageOrSlideNumber})` : ''}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed whitespace-pre-line">
                    {sec.content.length > 400 ? sec.content.substring(0, 400) + '...' : sec.content}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-xl"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
