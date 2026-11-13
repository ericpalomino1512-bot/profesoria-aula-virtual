import React, { useState } from 'react';
import type { Course, StudentUser } from '../types/course';
import { 
  X, 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2,
  Building
} from 'lucide-react';
import { getCourseThumbnail } from '../utils/courseImages';

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  course: Course;
  currentUser: StudentUser | null;
  onClose: () => void;
  onConfirmPayment: (course: Course) => void;
}

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  isOpen,
  course,
  currentUser,
  onClose,
  onConfirmPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card' | 'transfer'>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const priceAmount = course.price && course.price > 0 ? course.price : 49;
  const currency = course.currency || 'USD';

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    // Simulate instant secure processing for testing & campus activation
    await new Promise((r) => setTimeout(r, 1200));
    setIsProcessing(false);
    setIsSuccess(true);

    setTimeout(() => {
      onConfirmPayment(course);
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Pasarela de Pago Seguro
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                TusCursosInmobiliarios Campus • Cifrado SSL 256 bits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Mini Summary */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
          <img
            src={getCourseThumbnail(course)}
            alt={course.title}
            className="w-16 h-12 object-cover rounded-xl shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
              {course.title}
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
              {course.level} • {course.estimatedDuration}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              ${priceAmount} {currency}
            </span>
          </div>
        </div>

        {/* Logged in student info */}
        {currentUser && (
          <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/60 dark:bg-slate-800/40 px-3 py-2 rounded-xl flex items-center justify-between">
            <span>Matriculando a: <strong>{currentUser.email}</strong></span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Cuenta activa
            </span>
          </div>
        )}

        {/* Payment Methods Tabs */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Elige el método de pago:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                paymentMethod === 'paypal'
                  ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold">PayPal</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Saldo o Tarjeta</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                paymentMethod === 'card'
                  ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <CreditCard className="w-4 h-4 mx-auto mb-1 text-slate-500" />
              <div className="text-xs font-bold">Tarjeta</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Crédito / Débito</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                paymentMethod === 'transfer'
                  ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Building className="w-4 h-4 mx-auto mb-1 text-slate-500" />
              <div className="text-xs font-bold">Banca / Yape</div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Transferencia</span>
            </button>
          </div>
        </div>

        {/* Selected method details */}
        {paymentMethod === 'paypal' && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <p className="font-semibold text-slate-900 dark:text-white">
              Conexión directa con PayPal Checkout
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Paga en dólares de forma 100% segura. Serás activado de manera inmediata al confirmar la operación.
            </p>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white">
              Pago con Tarjeta Visa / Mastercard / Amex
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Procesado a través de pasarela bancaria internacional con protección al comprador.
            </p>
          </div>
        )}

        {paymentMethod === 'transfer' && (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <p className="font-semibold text-slate-900 dark:text-white">
              Transferencia Local o Contacto de Pago
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Para pagar por transferencia directa o consultar promociones corporativas, escribe a: <strong className="text-violet-600 dark:text-violet-400">hola@tucorretaje.com</strong>.
            </p>
          </div>
        )}

        {/* Success confirmation */}
        {isSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 font-bold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>¡Pago confirmado con éxito! Desbloqueando acceso al curso...</span>
          </div>
        )}

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            disabled={isProcessing || isSuccess}
            onClick={handleProcessPayment}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-transform active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando pago seguro...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Matrícula confirmada!</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Pagar ${priceAmount} {currency} y Comenzar Curso</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Garantía de acceso completo • Soporte TusCursosInmobiliarios</span>
          </p>
        </div>

      </div>
    </div>
  );
};
