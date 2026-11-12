import React, { useState } from 'react';
import { Briefcase, CheckCircle2, FileText, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { FinalProject } from '../types/course';

interface FinalProjectsViewProps {
  projects: FinalProject[];
}

export const FinalProjectsView: React.FC<FinalProjectsViewProps> = ({ projects }) => {
  const [completedProjects, setCompletedProjects] = useState<Record<string, boolean>>({});

  const toggleProject = (id: string) => {
    const isNowDone = !completedProjects[id];
    setCompletedProjects(prev => ({ ...prev, [id]: isNowDone }));

    if (isNowDone) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Aplicación Práctica Real
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Proyectos Prácticos Integradores
            </h2>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Para consolidar tus aprendizajes, te proponemos dos proyectos basados en casos de estudio reales. Ambos requieren sintetizar y aplicar de forma transversal las lecciones de este curso.
        </p>
      </div>

      {/* Projects cards */}
      <div className="space-y-6">
        {projects.map((project, idx) => {
          const isDone = !!completedProjects[project.id];

          return (
            <div
              key={project.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all p-6 sm:p-8 ${
                isDone 
                  ? 'border-emerald-300 dark:border-emerald-800 shadow-md ring-1 ring-emerald-500/20' 
                  : 'border-purple-100 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <span className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleProject(project.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300'
                      : 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100'
                  }`}
                >
                  {isDone ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Proyecto completado</span>
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-violet-500" />
                      <span>Marcar como completado</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.description}
              </div>

              {/* Deliverable block */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="block text-slate-900 dark:text-white font-semibold mb-0.5">
                    Entregable esperado:
                  </strong>
                  <span className="text-slate-600 dark:text-slate-300">
                    {project.deliverable}
                  </span>
                </div>
              </div>

              {/* Criteria */}
              {project.evaluationCriteria && project.evaluationCriteria.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                    Criterios de Evaluación y Rúbrica
                  </h4>
                  <ul className="space-y-2">
                    {project.evaluationCriteria.map((crit, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
