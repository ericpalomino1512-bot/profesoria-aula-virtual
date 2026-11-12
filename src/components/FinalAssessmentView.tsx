import React, { useState } from 'react';
import { 
  Award, 
  RotateCcw, 
  Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { QuizQuestion } from '../types/course';

interface FinalAssessmentViewProps {
  questions: QuizQuestion[];
  savedAnswers?: Record<string, number>;
  isSubmitted?: boolean;
  onSaveAnswer: (questionId: string, optionIndex: number) => void;
  onSubmitAssessment: () => void;
}

export const FinalAssessmentView: React.FC<FinalAssessmentViewProps> = ({
  questions,
  savedAnswers = {},
  isSubmitted = false,
  onSaveAnswer,
  onSubmitAssessment,
}) => {
  const [answers, setAnswers] = useState<Record<string, number>>(savedAnswers);
  const [submitted, setSubmitted] = useState<boolean>(isSubmitted);

  const letters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return; // locked after submission unless restarted
    const updated = { ...answers, [questionId]: optionIndex };
    setAnswers(updated);
    onSaveAnswer(questionId, optionIndex);
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });
    return {
      correctCount,
      total: questions.length,
      grade: ((correctCount / questions.length) * 10).toFixed(1),
      percentage: Math.round((correctCount / questions.length) * 100)
    };
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmitAssessment();

    const { percentage } = calculateScore();
    if (percentage >= 50) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const handleRetake = () => {
    setSubmitted(false);
  };

  const score = calculateScore();
  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="space-y-6">
      
      {/* Assessment Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Certificación del curso
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Evaluación Final Global ({questions.length} Preguntas)
              </h2>
            </div>
          </div>

          {submitted && (
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Repetir examen</span>
            </button>
          )}
        </div>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Esta prueba de síntesis integra las competencias de todas las unidades formativas. Selecciona la opción adecuada en cada pregunta y haz clic en entregar para conocer tu calificación detallada y retroalimentación pedagógica.
        </p>

        {/* Score banner when submitted */}
        {submitted && (
          <div className={`mt-6 p-6 rounded-2xl border transition-all ${
            score.percentage >= 70
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
              : score.percentage >= 50
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center font-extrabold text-2xl text-slate-900 dark:text-white">
                  {score.grade}
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    {score.percentage >= 90
                      ? '¡Sobresaliente! Dominio absoluto del temario'
                      : score.percentage >= 70
                      ? '¡Notable alto! Gran comprensión de las materias'
                      : score.percentage >= 50
                      ? 'Aprobado. Buen trabajo, repasa algunos puntos'
                      : 'Requiere refuerzo. Revisa las explicaciones'}
                  </h4>
                  <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                    Has acertado {score.correctCount} de {score.total} preguntas ({score.percentage}% de efectividad).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="w-8 h-8 text-amber-500 shrink-0" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const selectedOption = answers[q.id];
          const isCorrect = selectedOption === q.correctOptionIndex;

          return (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-7 space-y-4 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
                  <span className="text-violet-600 dark:text-violet-400 font-bold mr-2">
                    {idx + 1}.
                  </span>
                  {q.question}
                </h3>
              </div>

              {/* 4 options */}
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isTheCorrectOne = q.correctOptionIndex === optIdx;

                  let btnStyle = 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-300';

                  if (submitted) {
                    if (isTheCorrectOne) {
                      btnStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !isTheCorrectOne) {
                      btnStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                    } else {
                      btnStyle = 'opacity-50 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-violet-50 dark:bg-violet-950/60 border-violet-500 text-violet-900 dark:text-violet-100 font-medium ring-1 ring-violet-500';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        submitted
                          ? isTheCorrectOne
                            ? 'bg-emerald-500 text-white'
                            : isSelected
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          : isSelected
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {letters[optIdx]}
                      </span>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Pedagogy explanation when submitted */}
              {submitted && (
                <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border animate-in fade-in ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                }`}>
                  <strong className="block font-semibold mb-1">
                    {isCorrect ? '✓ Respuesta correcta' : '✗ Corrección y justificación:'}
                  </strong>
                  {q.explanation}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Submit footer bar */}
      {!submitted && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {Object.keys(answers).length} de {questions.length} preguntas respondidas
          </div>

          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-violet-500/20 transition-all text-sm"
          >
            {allAnswered ? 'Entregar evaluación y ver nota' : `Responde las ${questions.length - Object.keys(answers).length} restantes para entregar`}
          </button>
        </div>
      )}

    </div>
  );
};
