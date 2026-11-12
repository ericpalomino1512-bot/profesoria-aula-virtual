export type CourseLevel = 'Principiante' | 'Intermedio' | 'Avanzado';

export type PreferredFormat = 
  | 'Lecturas breves' 
  | 'Lecturas + ejercicios' 
  | 'Esquemas + problemas' 
  | 'Mixto';

export interface CourseFormData {
  topic: string;
  level: CourseLevel;
  studentProfile: string;
  mainGoal: string;
  availableTime: string;
  preferredFormat: PreferredFormat;
  apiKey?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  explanation: string;
}

export interface VideoSlide {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
  narrationText: string;
  durationSeconds: number;
  badge: string;
}

export interface LessonVideoData {
  title: string;
  durationFormatted: string;
  slides: VideoSlide[];
  customEmbedUrl?: string;
}

export interface LessonAttachment {
  id: string;
  title: string;
  type: 'ebook' | 'excel' | 'pdf' | 'doc' | 'link';
  fileName: string;
  fileSizeFormatted?: string;
  description: string;
  downloadDataUrl?: string; // base64 or generated data
  excelRows?: Array<Record<string, any>>; // for XLSX generation
  uploadedAt: string;
}

export interface Lesson {
  id: string;
  lessonNumber: string; // e.g. "1.1", "1.2"
  title: string;
  durationMinutes: number;
  keyIdea: string;
  appliedExample: string;
  practicalActivity: string;
  quickQuiz: QuizQuestion[];
  video?: LessonVideoData;
  attachments?: LessonAttachment[];
}

export interface Unit {
  id: string;
  unitNumber: number;
  title: string;
  summary: string;
  lessons: Lesson[];
}

export interface FinalProject {
  id: string;
  title: string;
  description: string;
  deliverable: string;
  evaluationCriteria: string[];
}

export interface SourceReference {
  title: string;
  type: 'libro' | 'artículo' | 'sitio web' | 'documentación oficial' | 'recurso académico';
  description: string;
  url?: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  level: CourseLevel;
  estimatedDuration: string;
  targetProfile: string;
  mainGoal: string;
  preferredFormat: PreferredFormat;
  learningObjectives: string[];
  units: Unit[];
  finalAssessment: QuizQuestion[];
  finalProjects: FinalProject[];
  sourcesAndReferences: SourceReference[];
  createdAt: string;
}

export interface CourseProgress {
  completedLessonIds: string[];
  quizAnswers: Record<string, number>; // quizId -> selectedOptionIndex
  finalAssessmentAnswers: Record<string, number>; // questionId -> selectedOptionIndex
  finalAssessmentSubmitted?: boolean;
  lessonAttachments?: Record<string, LessonAttachment[]>; // lessonId -> attachments
}
