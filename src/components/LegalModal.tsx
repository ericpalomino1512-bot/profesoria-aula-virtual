import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Shield,
  Cookie,
  BookOpenCheck,
  Building2,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export type LegalTabType = 'terms' | 'privacy' | 'cookies' | 'claims' | 'about';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: LegalTabType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'terms',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);

  // Claims form state
  const [claimantName, setClaimantName] = useState('');
  const [claimantDocType, setClaimantDocType] = useState('DNI');
  const [claimantDocNumber, setClaimantDocNumber] = useState('');
  const [claimantEmail, setClaimantEmail] = useState('');
  const [claimantPhone, setClaimantPhone] = useState('');
  const [claimType, setClaimType] = useState<'Reclamo' | 'Queja'>('Reclamo');
  const [courseAffected, setCourseAffected] = useState('');
  const [claimDetail, setClaimDetail] = useState('');
  const [claimRequest, setClaimRequest] = useState('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimSuccessCode, setClaimSuccessCode] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim() || !claimantDocNumber.trim() || !claimantEmail.trim() || !claimDetail.trim()) {
      alert('Por favor completa todos los campos requeridos (*).');
      return;
    }

    setIsSubmittingClaim(true);
    const code = `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // Send claim email alert via webhook
      await fetch('https://formspree.io/f/xblywekg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          tipo: 'HOJA DE RECLAMACIÓN VIRTUAL',
          codigo_reclamacion: code,
          destinatario: 'hola@tucorretaje.com',
          copia_personal: 'eric.palomino1512@gmail.com',
          destinatarios: 'hola@tucorretaje.com, eric.palomino1512@gmail.com',
          consumidor_nombre: claimantName,
          documento: `${claimantDocType} - ${claimantDocNumber}`,
          email: claimantEmail,
          telefono: claimantPhone,
          tipo_registro: claimType,
          curso_involucrado: courseAffected || 'No especificado',
          detalle_reclamo: claimDetail,
          pedido_del_consumidor: claimRequest,
          fecha: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
          portal: 'https://tuscursosinmobiliarios.com',
        }),
      }).catch(() => {});
    } catch (err) {}

    setIsSubmittingClaim(false);
    setClaimSuccessCode(code);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              {activeTab === 'about' && <Building2 className="w-4 h-4" />}
              {activeTab === 'terms' && <FileText className="w-4 h-4" />}
              {activeTab === 'privacy' && <Shield className="w-4 h-4" />}
              {activeTab === 'cookies' && <Cookie className="w-4 h-4" />}
              {activeTab === 'claims' && <BookOpenCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {activeTab === 'about' ? 'Quiénes Somos' : 'Información Legal y Políticas'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                TusCursosInmobiliarios • Ecosistema Tucorretaje.com
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => { setActiveTab('about'); setClaimSuccessCode(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Quiénes Somos</span>
          </button>

          <button
            onClick={() => { setActiveTab('terms'); setClaimSuccessCode(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Términos y Condiciones</span>
          </button>

          <button
            onClick={() => { setActiveTab('privacy'); setClaimSuccessCode(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Política de Privacidad</span>
          </button>

          <button
            onClick={() => { setActiveTab('cookies'); setClaimSuccessCode(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'cookies'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <Cookie className="w-3.5 h-3.5" />
            <span>Política de Cookies</span>
          </button>

          <button
            onClick={() => { setActiveTab('claims'); setClaimSuccessCode(null); }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'claims'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>Libro de Reclamaciones</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-xs sm:text-sm space-y-6 leading-relaxed">
          
          {/* TAB 0: QUIÉNES SOMOS */}
          {activeTab === 'about' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Campus Virtual Inmobiliario
                </span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white">
                  Quiénes Somos • TusCursosInmobiliarios
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Somos parte del ecosistema oficial de <a href="https://tucorretaje.com" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Tucorretaje.com</a>
                </p>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <section className="space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                    Nuestra Misión
                  </h5>
                  <p>
                    <strong>TusCursosInmobiliarios</strong> nace como el centro de especialización técnica y práctica para agentes, asesores y agencias del sector inmobiliario. Nuestra misión es transformar el modelo tradicional de formación inmobiliaria en una experiencia 100% aplicable, eliminando el exceso de teoría abstracta y concentrándonos en las operaciones del día a día: captaciones en exclusiva, valuación certera, blindaje contractual notarial y marketing digital avanzado.
                  </p>
                </section>

                <section className="space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                    Parte del Ecosistema Tucorretaje.com
                  </h5>
                  <p>
                    Al pertenecer a <a href="https://tucorretaje.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Tucorretaje.com</a>, nuestros programas de estudio están diseñados con base en las tendencias, estadísticas y necesidades operativas reales del mercado actual. Los alumnos no aprenden teoría desactualizada, sino las mejores prácticas implementadas por profesionales activos en corretaje inmobiliario.
                  </p>
                </section>

                <section className="space-y-2">
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                    Pilares de Formación
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <strong className="block text-slate-900 dark:text-white font-bold text-xs mb-1">🎯 100% Práctico y Operativo</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Contratos modelo, plantillas de tasación en Excel, guiones de captación y simulaciones notariales reales.</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <strong className="block text-slate-900 dark:text-white font-bold text-xs mb-1">🤖 Inteligencia Artificial Aplicada</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Herramientas digitales e IA para prospección, análisis de mercado y automatización de marketing.</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <strong className="block text-slate-900 dark:text-white font-bold text-xs mb-1">⏱️ Estudio a Tu Ritmo 24/7</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Acceso ilimitado en cualquier momento y desde cualquier dispositivo (computadora, tablet o móvil).</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                      <strong className="block text-slate-900 dark:text-white font-bold text-xs mb-1">📜 Acreditación con Código QR</strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Certificación verificable en tiempo real para respaldo profesional ante clientes y agencias.</span>
                    </div>
                  </div>
                </section>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href="https://tucorretaje.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    <span>Conocer Tucorretaje.com</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://tucorretaje.com/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                  >
                    <span>Leer Nuestro Blog</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: TÉRMINOS Y CONDICIONES */}
          {activeTab === 'terms' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Términos y Condiciones de Uso del Campus Virtual
                </h4>
                <p className="text-xs text-slate-500">Última actualización: Noviembre de 2026</p>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">1. Objeto del Servicio</h5>
                  <p>
                    TusCursosInmobiliarios (operado a través de <strong>tuscursosinmobiliarios.com</strong> y <strong>aula.tuscursosinmobiliarios.com</strong>) es una plataforma digital de capacitación y perfeccionamiento profesional orientada al sector inmobiliario, que provee acceso a lecciones multimedia, materiales descargables, plantillas de trabajo y evaluaciones prácticas.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">2. Acceso y Registro de Usuario</h5>
                  <p>
                    El registro en el campus es personal e intransferible. El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso y de las actividades efectuadas bajo su cuenta. TusCursosInmobiliarios se reserva el derecho de suspender o cancelar cuentas que violen las normas de convivencia o intenten vulnerar la plataforma.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">3. Propiedad Intelectual y Licencia de Uso</h5>
                  <p>
                    Todos los contenidos de los cursos, incluyendo textos, videos, cuestionarios, guiones de captación y plantillas en hojas de cálculo, son de propiedad exclusiva de TusCursosInmobiliarios o de sus respectivos docentes autorizados. Se concede al estudiante una licencia individual para su estudio personal y aplicación en su actividad profesional. Queda terminantemente prohibida la reventa, redistribución masiva, copia no autorizada o publicación en sitios web de terceros sin consentimiento expreso por escrito.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">4. Emisión y Validación de Certificados</h5>
                  <p>
                    Los certificados emitidos por la plataforma acreditan la culminación satisfactoria de los módulos y la aprobación de las evaluaciones formativas. Cada certificado cuenta con un código QR único que enlaza a los servidores oficiales del campus para su verificación pública en tiempo real por parte de clientes y agencias.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">5. Pagos, Precios y Reembolsos</h5>
                  <p>
                    Los precios indicados en el catálogo están expresados en dólares estadounidenses (USD) o moneda local equivalente según se indique en la pasarela de pago. Tras confirmarse el pago, la matrícula se activa de inmediato. Para dudas o consultas sobre reembolsos, el alumno puede escribir a <strong>hola@tucorretaje.com</strong> dentro de los primeros 7 días posteriores a su compra siempre que no haya completado más del 30% del curso.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 2: POLÍTICA DE PRIVACIDAD */}
          {activeTab === 'privacy' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Política de Privacidad y Protección de Datos Personales
                </h4>
                <p className="text-xs text-slate-500">Comprometidos con la seguridad y confidencialidad de tu información</p>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">1. Información que Recopilamos</h5>
                  <p>
                    Recopilamos únicamente la información necesaria para brindarte el servicio educativo: tu nombre completo, correo electrónico, progreso académico en los cursos, respuestas a cuestionarios y fecha de registro. En ningún momento almacenamos datos bancarios o números completos de tarjetas de crédito; los pagos son procesados directamente por pasarelas seguras certificadas internacionalmente.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">2. Finalidad del Tratamiento de Datos</h5>
                  <p>
                    Tus datos se utilizan con los siguientes fines:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Gestionar tu matrícula y acceso al aula virtual.</li>
                    <li>Generar tus certificados oficiales con nombre y validación QR.</li>
                    <li>Notificar al equipo de administración sobre nuevos registros y avances.</li>
                    <li>Brindar soporte técnico y responder a tus consultas académicas.</li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">3. Seguridad y Confidencialidad</h5>
                  <p>
                    Aplicamos estrictas medidas técnicas y de cifrado (SSL/TLS, autenticación segura con Supabase) para evitar accesos no autorizados, pérdidas o alteraciones de tu información personal. No vendemos ni transferimos tus datos a empresas externas con fines publicitarios.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">4. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h5>
                  <p>
                    Como titular de tus datos personales, puedes solicitar en cualquier momento la actualización, rectificación o eliminación de tu cuenta enviando un correo a <strong>hola@tucorretaje.com</strong> con el asunto "Derechos ARCO", adjuntando tu identificación correspondiente.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 3: POLÍTICA DE COOKIES */}
          {activeTab === 'cookies' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Política de Cookies y Almacenamiento Local
                </h4>
                <p className="text-xs text-slate-500">Transparencia sobre el uso de tecnologías de almacenamiento en tu navegador</p>
              </div>

              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">1. ¿Qué son las Cookies y el Almacenamiento Local?</h5>
                  <p>
                    Las cookies y los elementos de almacenamiento local (LocalStorage) son pequeños archivos de texto que el navegador almacena en tu dispositivo para recordar tus preferencias y mantener abierta tu sesión educativa de forma segura.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">2. Tipos de Cookies que Empleamos</h5>
                  <ul className="list-disc pl-5 space-y-1.5 mt-1">
                    <li>
                      <strong>Cookies Técnicas y de Autenticación:</strong> Esenciales para que inicies sesión en el campus, mantengas tu rol de alumno/profesor y avances en tus clases sin interrupciones.
                    </li>
                    <li>
                      <strong>Almacenamiento de Preferencias y Progreso:</strong> Guardan tu preferencia de tema (modo claro u oscuro) y el porcentaje de avance de tus lecciones.
                    </li>
                    <li>
                      <strong>Cookies de Rendimiento:</strong> Nos permiten optimizar la velocidad de carga de la landing page y el reproductor de lecciones.
                    </li>
                  </ul>
                </section>

                <section className="space-y-1.5">
                  <h5 className="font-bold text-slate-900 dark:text-white">3. Cómo Administrar o Desactivar las Cookies</h5>
                  <p>
                    Puedes bloquear o eliminar las cookies en cualquier momento desde la configuración de privacidad de tu navegador web (Google Chrome, Safari, Mozilla Firefox, Microsoft Edge). Ten en cuenta que si deshabilitas las cookies técnicas indispensables, es posible que no puedas iniciar sesión en el aula virtual.
                  </p>
                </section>
              </div>
            </div>
          )}

          {/* TAB 4: LIBRO DE RECLAMACIONES VIRTUAL */}
          {activeTab === 'claims' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="pb-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Libro de Reclamaciones Virtual</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      Conforme a Ley
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    TusCursosInmobiliarios • Razón: Capacitación Inmobiliaria Virtual
                  </p>
                </div>
              </div>

              {claimSuccessCode ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h5 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Hoja de Reclamación Registrada con Éxito
                  </h5>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                    Se ha generado tu constancia oficial con código <strong>{claimSuccessCode}</strong>.
                    Hemos notificado a la administración y te daremos respuesta formal al correo ingresado en un plazo no mayor a 15 días hábiles conforme a la normativa vigente.
                  </p>
                  <button
                    onClick={() => {
                      setClaimSuccessCode(null);
                      setClaimDetail('');
                      setClaimRequest('');
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Registrar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-semibold">Definiciones conforme al Código de Protección al Consumidor:</p>
                      <p className="text-[11px] mt-0.5 text-amber-800 dark:text-amber-300">
                        <strong>Reclamo:</strong> Disconformidad relacionada a los servicios o productos contratados.<br />
                        <strong>Queja:</strong> Malestar o descontento respecto a la atención al público brindada.
                      </p>
                    </div>
                  </div>

                  {/* Datos del Consumidor */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      1. Identificación del Consumidor Reclamante
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Nombres y Apellidos *
                        </label>
                        <input
                          type="text"
                          required
                          value={claimantName}
                          onChange={(e) => setClaimantName(e.target.value)}
                          placeholder="Tu nombre completo"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Documento *
                          </label>
                          <select
                            value={claimantDocType}
                            onChange={(e) => setClaimantDocType(e.target.value)}
                            className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden text-xs"
                          >
                            <option value="DNI">DNI</option>
                            <option value="CE">C.E.</option>
                            <option value="Pasaporte">Pasaporte</option>
                            <option value="RUC">RUC</option>
                          </select>
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Número de Documento *
                          </label>
                          <input
                            type="text"
                            required
                            value={claimantDocNumber}
                            onChange={(e) => setClaimantDocNumber(e.target.value)}
                            placeholder="Ej: 71234567"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Correo Electrónico de Contacto *
                        </label>
                        <input
                          type="email"
                          required
                          value={claimantEmail}
                          onChange={(e) => setClaimantEmail(e.target.value)}
                          placeholder="nombre@correo.com"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Teléfono de Contacto
                        </label>
                        <input
                          type="tel"
                          value={claimantPhone}
                          onChange={(e) => setClaimantPhone(e.target.value)}
                          placeholder="+51 999 999 999"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detalle del Reclamo */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      2. Detalle de la Reclamación
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Tipo de Disconformidad *
                        </label>
                        <div className="flex gap-4 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="claimType"
                              value="Reclamo"
                              checked={claimType === 'Reclamo'}
                              onChange={() => setClaimType('Reclamo')}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Reclamo</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <input
                              type="radio"
                              name="claimType"
                              value="Queja"
                              checked={claimType === 'Queja'}
                              onChange={() => setClaimType('Queja')}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Queja</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Curso o Servicio Involucrado
                        </label>
                        <input
                          type="text"
                          value={courseAffected}
                          onChange={(e) => setCourseAffected(e.target.value)}
                          placeholder="Ej: Captación en Exclusiva con IA"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Detalle de los Hechos (Descripción clara) *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={claimDetail}
                        onChange={(e) => setClaimDetail(e.target.value)}
                        placeholder="Describe detalladamente los hechos que motivan tu reclamo o queja..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Pedido Concreto del Consumidor
                      </label>
                      <textarea
                        rows={2}
                        value={claimRequest}
                        onChange={(e) => setClaimRequest(e.target.value)}
                        placeholder="Indica qué solución o respuesta esperas recibir..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingClaim}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all shadow-md shadow-amber-600/20 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingClaim ? 'Registrando...' : 'Enviar Hoja de Reclamación'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer note */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-center text-[11px] text-slate-400 shrink-0">
          TusCursosInmobiliarios • Contacto oficial: <a href="mailto:hola@tucorretaje.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">hola@tucorretaje.com</a>
        </div>
      </div>
    </div>
  );
};
