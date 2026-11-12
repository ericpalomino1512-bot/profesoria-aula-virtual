import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Target, 
  Clock, 
  Layers, 
  UserCheck, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Lightbulb, 
  FileUp,
  Cpu,
  Key
} from 'lucide-react';
import type { CourseFormData, CourseLevel, PreferredFormat } from '../types/course';
import { DocumentUploadZone } from './DocumentUploadZone';
import type { ParsedDocument } from '../services/documentParser';

interface CourseDesignHomeProps {
  onGenerate: (data: CourseFormData) => void;
  onGenerateFromDocuments: (docs: ParsedDocument[], data: CourseFormData) => void;
  isLoading: boolean;
  loadingStepText: string;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

const PRESET_IDEAS = [
  {
    topic: 'Química Orgánica: Hidrocarburos y Reacciones',
    level: 'Intermedio' as CourseLevel,
    profile: 'Estudiante de 2º de Bachillerato (Preparación EBAU / Selectividad)',
    goal: 'Aprobar la EBAU con la máxima nota en reactividad y formulación',
    time: '4 semanas (30 min al día • 14 horas totales)',
    format: 'Lecturas + ejercicios' as PreferredFormat,
    tag: 'Ciencias & EBAU'
  },
  {
    topic: 'Fundamentos de Inteligencia Artificial Generativa',
    level: 'Principiante' as CourseLevel,
    profile: 'Profesional en reconversión laboral / Cambio de sector (Reskilling)',
    goal: 'Aprender prompting avanzado y automatizar flujos de trabajo',
    time: '2 semanas (45 min al día • 10 horas totales)',
    format: 'Mixto' as PreferredFormat,
    tag: 'Tecnología'
  },
  {
    topic: 'Historia de la Antigua Roma: De la República al Imperio',
    level: 'Principiante' as CourseLevel,
    profile: 'Autodidacta / Aprendizaje por curiosidad personal',
    goal: 'Comprender las causas políticas y sociales de la caída de la República',
    time: '4 semanas (30 min al día • 14 horas totales)',
    format: 'Lecturas breves' as PreferredFormat,
    tag: 'Humanidades'
  },
  {
    topic: 'Arquitectura de Microservicios y Cloud Native',
    level: 'Avanzado' as CourseLevel,
    profile: 'Profesional Sénior / Especialista técnico o directivo (+5 años)',
    goal: 'Diseñar sistemas distribuidos resilientes y escalables para producción',
    time: '8 semanas (45 min al día • 35 horas totales)',
    format: 'Esquemas + problemas' as PreferredFormat,
    tag: 'Ingeniería'
  }
];

// Student profiles categorized specifically by academic/experience level
const PROFILES_BY_LEVEL: Record<CourseLevel, string[]> = {
  Principiante: [
    'Estudiante de Secundaria / ESO (Iniciación y refuerzo escolar)',
    'Estudiante de 1º de Bachillerato (Primer contacto con la materia)',
    'Estudiante de 1º de Grado Universitario (Fundamentos desde cero)',
    'Estudiante de Formación Profesional Básica o Grado Medio',
    'Profesional en reconversión laboral / Cambio de sector (Reskilling)',
    'Emprendedor sin conocimientos técnicos previos',
    'Autodidacta / Aprendizaje por curiosidad personal',
    'Junior / Inserción laboral y primer empleo',
    'Personalizado (Escribir perfil propio)'
  ],
  Intermedio: [
    'Estudiante de 2º de Bachillerato (Preparación EBAU / Selectividad)',
    'Estudiante Universitario (Grado medio / 2º - 3º de carrera)',
    'Estudiante de Formación Profesional (Grado Superior)',
    'Profesional en activo con 1-3 años de experiencia (Up-skilling)',
    'Emprendedor con negocio en marcha buscando optimizar procesos',
    'Opositor a plazas técnicas o de administración general',
    'Docente de educación secundaria / Formador ocupacional',
    'Autodidacta con conocimientos previos consolidados',
    'Personalizado (Escribir perfil propio)'
  ],
  Avanzado: [
    'Estudiante de Máster / Posgrado / Doctorado',
    'Profesional Sénior / Especialista técnico o directivo (+5 años)',
    'Opositor a Cuerpos Superiores del Estado / Alta Administración (Grupo A1)',
    'Investigador / Científico de laboratorio o I+D',
    'Docente Universitario / Catedrático / Formador de formadores',
    'Consultor estratégico / Auditor especializado',
    'Profesional preparando certificación oficial avanzada',
    'Personalizado (Escribir perfil propio)'
  ]
};

// Course duration options
const DURATION_PRESETS = [
  '1 semana (Intensivo • 1h al día • 7 horas totales)',
  '2 semanas (Acelerado • 45 min al día • 10 horas totales)',
  '4 semanas (Estándar recomendado • 30 min al día • 14 horas totales)',
  '8 semanas (Profundización • 45 min al día • 35 horas totales)',
  '12 semanas (Trimestral académico • 3h/semana • 36 horas totales)',
  '24 semanas (Semestral / Máster • 4h/semana • 96 horas totales)',
  'Microlearning (2 semanas • 15 min al día • 3,5 horas totales)',
  'Personalizado (Escribir duración propia)'
];

export const CourseDesignHome: React.FC<CourseDesignHomeProps> = ({
  onGenerate,
  onGenerateFromDocuments,
  isLoading,
  loadingStepText,
  hasApiKey,
  onOpenApiKeyModal,
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'manual'>('documents');
  const [documents, setDocuments] = useState<ParsedDocument[]>([]);
  const [isProcessingDocs, setIsProcessingDocs] = useState(false);

  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<CourseLevel>('Intermedio');
  
  // Student Profile state
  const [selectedProfilePreset, setSelectedProfilePreset] = useState<string>(
    PROFILES_BY_LEVEL['Intermedio'][0]
  );
  const [studentProfileCustom, setStudentProfileCustom] = useState<string>('');
  const [isCustomProfile, setIsCustomProfile] = useState<boolean>(false);

  // Duration state
  const [selectedDurationPreset, setSelectedDurationPreset] = useState<string>(
    '4 semanas (Estándar recomendado • 30 min al día • 14 horas totales)'
  );
  const [customDuration, setCustomDuration] = useState<string>('');
  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(false);

  const [mainGoal, setMainGoal] = useState('Dominar los conceptos del temario y resolver casos reales');
  const [preferredFormat, setPreferredFormat] = useState<PreferredFormat>('Lecturas + ejercicios');

  // When Level changes, update available profiles to match that level
  const handleLevelChange = (newLevel: CourseLevel) => {
    setLevel(newLevel);
    if (!isCustomProfile) {
      const levelProfiles = PROFILES_BY_LEVEL[newLevel];
      setSelectedProfilePreset(levelProfiles[0]);
    }
  };

  const handleProfilePresetChange = (preset: string) => {
    setSelectedProfilePreset(preset);
    if (preset === 'Personalizado (Escribir perfil propio)') {
      setIsCustomProfile(true);
      if (!studentProfileCustom) {
        setStudentProfileCustom(`Estudiante de nivel ${level.toLowerCase()}`);
      }
    } else {
      setIsCustomProfile(false);
    }
  };

  const getEffectiveStudentProfile = (): string => {
    if (isCustomProfile) {
      return studentProfileCustom.trim() || `Estudiante de nivel ${level.toLowerCase()}`;
    }
    return selectedProfilePreset;
  };

  const handleDurationPresetChange = (preset: string) => {
    setSelectedDurationPreset(preset);
    if (preset === 'Personalizado (Escribir duración propia)') {
      setIsCustomDuration(true);
      if (!customDuration) {
        setCustomDuration('4 semanas, 30 min al día');
      }
    } else {
      setIsCustomDuration(false);
    }
  };

  const getEffectiveDuration = (): string => {
    if (isCustomDuration) {
      return customDuration.trim() || '4 semanas, 30 min al día';
    }
    return selectedDurationPreset;
  };

  // When documents are uploaded, auto-suggest the topic from first document if not set
  const handleDocumentsChange = (newDocs: ParsedDocument[]) => {
    setDocuments(newDocs);
    if (newDocs.length > 0 && !topic.trim()) {
      const suggestedTopic = newDocs[0].name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTopic(suggestedTopic.charAt(0).toUpperCase() + suggestedTopic.slice(1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTopic = topic.trim() || (documents[0] ? documents[0].name.replace(/\.[^/.]+$/, '') : 'Curso de Especialización');

    const formData: CourseFormData = {
      topic: finalTopic,
      level,
      studentProfile: getEffectiveStudentProfile(),
      mainGoal: mainGoal.trim() || 'Comprender los conceptos esenciales del tema',
      availableTime: getEffectiveDuration(),
      preferredFormat
    };

    if (activeTab === 'documents' && documents.length > 0) {
      onGenerateFromDocuments(documents, formData);
    } else {
      onGenerate(formData);
    }
  };

  const applyPreset = (preset: typeof PRESET_IDEAS[0]) => {
    setActiveTab('manual');
    setTopic(preset.topic);
    handleLevelChange(preset.level);
    
    const available = PROFILES_BY_LEVEL[preset.level];
    if (available.includes(preset.profile)) {
      setSelectedProfilePreset(preset.profile);
      setIsCustomProfile(false);
    } else {
      setSelectedProfilePreset('Personalizado (Escribir perfil propio)');
      setIsCustomProfile(true);
      setStudentProfileCustom(preset.profile);
    }
    
    setSelectedDurationPreset(preset.time);
    setIsCustomDuration(false);
    setMainGoal(preset.goal);
    setPreferredFormat(preset.format);
  };

  const currentLevelProfiles = PROFILES_BY_LEVEL[level];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-4 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold mb-4 border border-violet-200/80 dark:border-violet-800/80 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          <span>Diseño Instruccional Senior + Motor Autónomo Local o Gemini</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Crea tu aula virtual en minutos
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
          Genera rutas de aprendizaje completas, lecciones estructuradas, ejemplos reales, actividades prácticas y tests interactivos <strong>a partir de tus propias presentaciones y documentos</strong>, o para cualquier tema con IA.
        </p>
      </div>

      {/* Central Card Form */}
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-purple-500/5 border border-purple-100 dark:border-slate-800 p-6 sm:p-8 md:p-10 transition-all">
        
        {/* Method Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 mb-7 border border-slate-200/60 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'documents'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>Crear desde Documentos (PPTX / PDF)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-extrabold hidden md:inline">
              Sin API Key
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'manual'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Crear por Tema o Prompt</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* TAB 1: Document Upload */}
          {activeTab === 'documents' && (
            <div className="space-y-5 animate-in fade-in">
              <DocumentUploadZone
                documents={documents}
                onDocumentsChange={handleDocumentsChange}
                isProcessing={isProcessingDocs}
                setIsProcessing={setIsProcessingDocs}
              />
            </div>
          )}

          {/* TAB 2: Quick Presets (when manual mode) */}
          {activeTab === 'manual' && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Ejemplos listos:
              </span>
              {PRESET_IDEAS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:text-violet-600 transition-all"
                >
                  {preset.topic.split(':')[0]} ({preset.level})
                </button>
              ))}
            </div>
          )}

          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              {activeTab === 'documents' ? 'Título o Tema del curso (opcional)' : 'Tema del curso *'}
            </label>
            <div className="relative">
              <input
                type="text"
                required={activeTab === 'manual'}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={
                  activeTab === 'documents'
                    ? 'Se inferirá automáticamente de tus archivos o escribe un título personalizado...'
                    : 'Ej. Química Orgánica: Reacciones y Mecanismos, Historia de Roma, Python...'
                }
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium"
              />
              <BookOpen className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Grid 2 cols: Level & Dynamic Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Nivel del alumno
              </label>
              <div className="relative">
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(e.target.value as CourseLevel)}
                  className="w-full pl-11 pr-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium appearance-none"
                >
                  <option value="Principiante">Principiante (Desde cero / Fundamentos)</option>
                  <option value="Intermedio">Intermedio (Bases consolidadas / EBAU)</option>
                  <option value="Avanzado">Avanzado (Máster / Especialista / Oposiciones)</option>
                </select>
                <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
              </div>
            </div>

            {/* Student profile: DYNAMICALLY ADAPTED TO CHOSEN LEVEL */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Perfil del alumno
                  <span className="text-[11px] font-normal text-violet-600 dark:text-violet-400 ml-1">
                    ({level})
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isCustomProfile;
                    setIsCustomProfile(next);
                    if (next) setSelectedProfilePreset('Personalizado (Escribir perfil propio)');
                  }}
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  {isCustomProfile ? 'Ver listado' : 'Escribir propio'}
                </button>
              </div>

              {!isCustomProfile ? (
                <div className="relative">
                  <select
                    value={selectedProfilePreset}
                    onChange={(e) => handleProfilePresetChange(e.target.value)}
                    className="w-full pl-11 pr-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-xs sm:text-sm font-medium appearance-none"
                  >
                    {currentLevelProfiles.map((p, idx) => (
                      <option key={idx} value={p}>{p}</option>
                    ))}
                  </select>
                  <UserCheck className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfileCustom}
                    onChange={(e) => setStudentProfileCustom(e.target.value)}
                    placeholder="Describe el perfil exacto (ej. Estudiante de 1º de Medicina, Opositor a Bombero...)"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium"
                  />
                  <UserCheck className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              )}
            </div>
          </div>

          {/* Quick Profile Chips adapted to Level */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-slate-400 font-medium mr-1">
              Sugerencias para {level.toLowerCase()}:
            </span>
            {currentLevelProfiles.slice(0, 4).map((preset, idx) => {
              const shortLabel = preset.split('(')[0].trim();
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedProfilePreset(preset);
                    setIsCustomProfile(false);
                  }}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full transition-colors ${
                    selectedProfilePreset === preset && !isCustomProfile
                      ? 'bg-violet-600 text-white font-bold'
                      : 'bg-slate-100 hover:bg-violet-50 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 hover:text-violet-600'
                  }`}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

          {/* Main Goal */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Objetivo principal (centrado en resultado)
            </label>
            <div className="relative">
              <input
                type="text"
                value={mainGoal}
                onChange={(e) => setMainGoal(e.target.value)}
                placeholder="Ej. Aprobar la EBAU, entender los mecanismos básicos, lanzar mi proyecto..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium"
              />
              <Target className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Grid 2 cols: DEDICATED DURATION SELECTOR & Preferred format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Dedicated Duration Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Duración del curso
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isCustomDuration;
                    setIsCustomDuration(next);
                    if (next) setSelectedDurationPreset('Personalizado (Escribir duración propia)');
                  }}
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  {isCustomDuration ? 'Ver opciones' : 'Personalizar'}
                </button>
              </div>

              {!isCustomDuration ? (
                <div className="relative">
                  <select
                    value={selectedDurationPreset}
                    onChange={(e) => handleDurationPresetChange(e.target.value)}
                    className="w-full pl-11 pr-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-xs sm:text-sm font-medium appearance-none"
                  >
                    {DURATION_PRESETS.map((dur, idx) => (
                      <option key={idx} value={dur}>{dur}</option>
                    ))}
                  </select>
                  <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    placeholder="Ej. 6 semanas, fines de semana • 20 horas totales"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium"
                  />
                  <Clock className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              )}

              {/* Quick duration chips */}
              <div className="flex flex-wrap items-center gap-1 mt-2">
                {['1 semana', '2 semanas', '4 semanas', '8 semanas', '12 semanas'].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      const match = DURATION_PRESETS.find(d => d.startsWith(chip));
                      if (match) {
                        setSelectedDurationPreset(match);
                        setIsCustomDuration(false);
                      }
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                      selectedDurationPreset.startsWith(chip) && !isCustomDuration
                        ? 'bg-violet-600 text-white font-bold'
                        : 'bg-slate-100 hover:bg-violet-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred format */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Formato preferido
              </label>
              <div className="relative">
                <select
                  value={preferredFormat}
                  onChange={(e) => setPreferredFormat(e.target.value as PreferredFormat)}
                  className="w-full pl-11 pr-8 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-sm font-medium appearance-none"
                >
                  <option value="Lecturas + ejercicios">Lecturas + ejercicios</option>
                  <option value="Lecturas breves">Lecturas breves</option>
                  <option value="Esquemas + problemas">Esquemas + problemas</option>
                  <option value="Mixto">Mixto (Integrado)</option>
                </select>
                <Layers className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-400 w-0 h-0" />
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Adapta el ritmo pedagógico y el balance entre teoría y ejercicios.
              </p>
            </div>
          </div>

          {/* Engine indicator pill */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-50/90 to-indigo-50/90 dark:from-violet-950/40 dark:to-indigo-950/40 border border-violet-200/80 dark:border-violet-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                hasApiKey 
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                  : 'bg-violet-100 text-violet-700 dark:bg-violet-900/60 dark:text-violet-300'
              }`}>
                {hasApiKey ? <Sparkles className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold">
                  {hasApiKey
                    ? 'Motor Activo: Google Gemini 2.5 Flash (En la nube con Search)'
                    : activeTab === 'documents' && documents.length > 0
                    ? 'Motor Activo: Síntesis Local de Documentos (100% Funcional sin API Key)'
                    : 'Motor Activo: Motor Instruccional Autónomo Local (100% Funcional sin API Key)'}
                </strong>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                  {hasApiKey
                    ? 'Conectado mediante tu clave. Los cursos se generan con IA en tiempo real.'
                    : 'No necesitas API key: los cursos se generan de forma instantánea, privada y gratuita.'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-all ${
                hasApiKey
                  ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 hover:bg-emerald-200'
                  : 'bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-50 shadow-xs'
              }`}
            >
              <Key className="w-3 h-3" />
              <span>{hasApiKey ? 'Modificar Clave' : 'Añadir Gemini (Opcional)'}</span>
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isProcessingDocs || (activeTab === 'manual' && !topic.trim()) || (activeTab === 'documents' && documents.length === 0 && !topic.trim())}
              className="w-full py-4 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-base group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>{loadingStepText || 'Construyendo aula virtual...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {activeTab === 'documents' && documents.length > 0
                      ? `Diseñar curso desde mis ${documents.length} documento${documents.length > 1 ? 's' : ''}`
                      : 'Diseñar curso ahora'}
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* Micro-features footer bar */}
      <div className="py-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Soporta diapositivas PPTX, PDF y Word</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Generación 100% autónoma sin API Key</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Tests interactivos, videos y plantillas Excel</span>
        </div>
      </div>

    </div>
  );
};
