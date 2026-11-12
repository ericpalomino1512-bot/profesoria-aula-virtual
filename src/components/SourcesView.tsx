import React from 'react';
import { ExternalLink, BookOpen, Globe, FileText, Bookmark } from 'lucide-react';
import type { SourceReference } from '../types/course';

interface SourcesViewProps {
  sources: SourceReference[];
}

export const SourcesView: React.FC<SourcesViewProps> = ({ sources }) => {
  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'libro':
        return { label: 'Libro de Texto', icon: BookOpen, color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300' };
      case 'artículo':
      case 'articulo':
        return { label: 'Artículo Científico', icon: FileText, color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' };
      case 'documentación oficial':
        return { label: 'Doc Oficial / Currículo', icon: Bookmark, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' };
      default:
        return { label: 'Portal Académico Web', icon: Globe, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-200/60 dark:border-cyan-800/60">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Verificación y Rigor Académico
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Fuentes Bibliográficas y Referencias
            </h2>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Para garantizar la máxima fiabilidad pedagógica y evitar alucinaciones, este plan de estudio se fundamenta en obras canónicas, normativas oficiales y portales educativos de referencia contrastada rastreados con Google Search.
        </p>
      </div>

      {/* Sources list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source, idx) => {
          const badge = getTypeBadge(source.type);
          const Icon = badge.icon;

          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {badge.label}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Ref #{idx + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {source.title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {source.description}
                </p>
              </div>

              {source.url && (
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                  >
                    <span>Visitar recurso oficial</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
