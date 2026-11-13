import React, { useState } from 'react';
import type { Course } from '../types/course';
import { X, Tag, CheckCircle2 } from 'lucide-react';

interface EditCoursePriceModalProps {
  isOpen: boolean;
  course: Course;
  onClose: () => void;
  onSavePrice: (courseId: string, newPrice: number, newCategory?: string) => void;
}

export const EditCoursePriceModal: React.FC<EditCoursePriceModalProps> = ({
  isOpen,
  course,
  onClose,
  onSavePrice,
}) => {
  const [isPaid, setIsPaid] = useState<boolean>(Boolean(course.price && course.price > 0));
  const [price, setPrice] = useState<number>(course.price && course.price > 0 ? course.price : 49);
  const [category, setCategory] = useState<string>(course.category || 'Inmobiliario y Ventas');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPrice = isPaid ? Math.max(1, Number(price) || 49) : 0;
    onSavePrice(course.id, finalPrice, category);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Gestión Oficial de Precio</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Admin
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fija o aprueba el precio oficial del curso
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Info */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
            Curso seleccionado
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 mt-0.5">
            {course.title}
          </h4>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Price Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Tipo de Acceso y Precio Oficial
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold border border-slate-200/60 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setIsPaid(false)}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  !isPaid
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Gratuito ($0 USD)
              </button>

              <button
                type="button"
                onClick={() => setIsPaid(true)}
                className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                  isPaid
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                De Pago (USD)
              </button>
            </div>
          </div>

          {/* Amount input if paid */}
          {isPaid && (
            <div className="space-y-1 animate-in fade-in">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tarifa en Dólares (USD):
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 text-sm font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  max="999"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="49"
                  className="w-full pl-8 pr-16 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                <span className="absolute right-4 top-2.5 text-xs font-bold text-slate-400">USD</span>
              </div>
            </div>
          )}

          {/* Category */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Categoría Oficial:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="Inmobiliario y Ventas">Inmobiliario y Ventas</option>
              <option value="Marketing y Redes">Marketing y Redes</option>
              <option value="Captación y Exclusivas">Captación y Exclusivas</option>
              <option value="Valoración y Finanzas">Valoración y Finanzas</option>
              <option value="Legal y Notarial">Legal y Notarial</option>
              <option value="Ciencias y Bachillerato">Ciencias y Bachillerato</option>
              <option value="General">General</option>
            </select>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>¡Precio oficial guardado con éxito!</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-transform active:scale-95 cursor-pointer"
            >
              Guardar Precio
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
