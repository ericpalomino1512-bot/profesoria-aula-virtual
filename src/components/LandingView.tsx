import React, { useState, useMemo } from 'react';
import type { Course, StudentUser } from '../types/course';
import { getCourseThumbnail } from '../utils/courseImages';
import { LegalModal, type LegalTabType } from './LegalModal';
import {
  GraduationCap,
  Search,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Star,
  Menu,
  X,
  FileSpreadsheet,
  Smartphone,
  Sparkles,
  ShieldCheck,
  Layers,
  TrendingUp,
  Briefcase,
  Mail
} from 'lucide-react';

interface LandingViewProps {
  courses: Course[];
  currentUser: StudentUser | null;
  onSelectCourse: (course: Course) => void;
  onExploreCatalog: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenDashboard: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  courses,
  currentUser,
  onSelectCourse,
  onExploreCatalog,
  onOpenAuthModal,
  onOpenDashboard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType>('terms');

  const openLegal = (tab: LegalTabType) => {
    setLegalModalTab(tab);
    setLegalModalOpen(true);
  };

  // Dynamic categories extracted from real courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => {
      if (c.category) set.add(c.category);
    });
    return ['todos', ...Array.from(set)];
  }, [courses]);

  // Filter courses based on search & category
  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.subtitle.toLowerCase().includes(q) ||
        (c.category && c.category.toLowerCase().includes(q)) ||
        c.targetProfile.toLowerCase().includes(q);

      const matchesCat =
        selectedCategory === 'todos' ||
        (c.category && c.category.toLowerCase() === selectedCategory.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [courses, searchQuery, selectedCategory]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqs = [
    {
      q: '¿Cómo y cuándo tengo acceso a los cursos?',
      a: 'El acceso es 100% inmediato y digital. En cuanto te inscribes en el aula virtual, puedes ver todas las lecciones, guías prácticas y plantillas descargables desde tu computadora, tablet o teléfono móvil las 24 horas del día.',
    },
    {
      q: '¿Los cursos incluyen certificado oficial con validación?',
      a: 'Sí. Al completar todas las lecciones y superar la evaluación práctica de cada curso, la plataforma emite automáticamente un diploma personalizado con código QR único y verificable en línea.',
    },
    {
      q: '¿Puedo estudiar desde mi teléfono móvil?',
      a: 'Por supuesto. Nuestra plataforma está optimizada para que puedas aprender cómodamente entre visitas a propiedades, traslados o desde tu oficina sin necesidad de instalar aplicaciones pesadas.',
    },
    {
      q: '¿Qué métodos de pago aceptan para los cursos?',
      a: 'Aceptamos tarjetas de débito y crédito internacionales (Visa, Mastercard, American Express), transferencias bancarias y billeteras digitales seguras. La activación es automática tras la confirmación.',
    },
    {
      q: '¿Por cuánto tiempo tengo acceso al contenido del curso?',
      a: 'El acceso es ilimitado y de por vida. Puedes repasar los videos, consultar las plantillas y acceder a futuras actualizaciones del temario siempre que lo necesites.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ========================================================
          1. HEADER / NAVBAR ESTILO UDEMY & COURSERA
          ======================================================== */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="leading-tight">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                  TusCursos<span className="text-indigo-600 dark:text-indigo-400">Inmobiliarios</span>
                </span>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Campus Virtual Profesional
                </span>
              </div>
            </div>

            {/* Live Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar: captación exclusiva, tasación, marketing..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
              />
            </div>

            {/* Nav Quick Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => scrollToSection('catalogo')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Catálogo
              </button>
              <button
                onClick={() => scrollToSection('beneficios')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Beneficios
              </button>
              <button
                onClick={() => scrollToSection('opiniones')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Opiniones
              </button>
              <button
                onClick={() => scrollToSection('preguntas')}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                Preguntas
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {currentUser ? (
                <button
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Mi Campus</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onOpenAuthModal('login')}
                    className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => onOpenAuthModal('register')}
                    className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
                  >
                    Registrarse
                  </button>
                  <button
                    onClick={onOpenDashboard}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Mi Campus</span>
                  </button>
                </>
              )}

              {/* Mobile hamburger toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden cursor-pointer"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>

            <button
              onClick={() => scrollToSection('catalogo')}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              📚 Catálogo de Cursos
            </button>
            <button
              onClick={() => scrollToSection('beneficios')}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ✨ Beneficios del Campus
            </button>
            <button
              onClick={() => scrollToSection('opiniones')}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ⭐ Opiniones de Alumnos
            </button>
            <button
              onClick={() => scrollToSection('preguntas')}
              className="w-full text-left py-2 px-3 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              ❓ Preguntas Frecuentes
            </button>

            {!currentUser && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal('login');
                  }}
                  className="w-full py-2 text-center text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal('register');
                  }}
                  className="w-full py-2 text-center text-xs font-bold rounded-xl bg-indigo-600 text-white"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ========================================================
          2. HERO SECTION ESTILO COURSERA / UDEMY
          ======================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white py-16 sm:py-24">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Campus Oficial de Especialización Inmobiliaria • Certificados con QR</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
                Domina el Mercado <br />
                <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-teal-200 bg-clip-text text-transparent">
                  Inmobiliario Práctico
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Metodologías probadas para agentes independientes y de agencia: captación de exclusivas con Inteligencia Artificial, valoración precisa de inmuebles, marketing digital y negociación inmobiliaria.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => scrollToSection('catalogo')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Explorar Catálogo de Cursos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenDashboard}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm backdrop-blur-xs border border-white/15 transition-all cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Acceso a Mi Campus</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>+1,200 Alumnos Capacitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Diplomas Verificables en Línea</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>100% Online y a tu Ritmo</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Mockup */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md bg-gradient-to-tr from-slate-800/90 to-slate-900/90 p-5 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-md space-y-4">
                
                {/* Visual card header */}
                <div className="relative h-48 rounded-2xl overflow-hidden shadow-inner group">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                    alt="Campus Inmobiliario"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Programa Destacado
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      4.9 / 5.0 (340 valoraciones)
                    </span>
                    <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-md text-[11px]">
                      Acreditado
                    </span>
                  </div>
                </div>

                {/* Card Title & Perks */}
                <div className="space-y-2">
                  <h3 className="font-bold text-base text-white">
                    Captación de Exclusivas y Tasación con IA
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Aprende la metodología paso a paso para conseguir de 3 a 5 mandatos en exclusiva cada mes.
                  </p>
                </div>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700/60 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Plantillas Excel</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Acceso de por Vida</span>
                  </div>
                </div>

                {/* Bottom button */}
                <button
                  onClick={() => scrollToSection('catalogo')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold text-xs hover:from-indigo-600 hover:to-violet-700 transition-all text-center block cursor-pointer"
                >
                  Ver Todos los Cursos Disponibles
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. VALUE METRICS BAR
          ======================================================== */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
                +150 Horas
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Contenido Inmobiliario Aplicado
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
                4.9 / 5.0
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Calificación Media de Alumnos
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
                100% Práctico
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Plantillas y Guiones Listos
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 block">
                Código QR
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Certificados con Validación Única
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. CATÁLOGO DE CURSOS EN VIVO (UDEMY GRID)
          ======================================================== */}
      <section id="catalogo" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Programas Formativos
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explora Nuestro Catálogo de Cursos
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Formación especializada diseñada para que comiences a generar resultados reales desde la primera lección.
          </p>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              {cat === 'todos' ? 'Todos los Programas' : cat}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const thumbnail = getCourseThumbnail(course);
            const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail Header */}
                <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  {/* Level & Category Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-indigo-600 dark:text-indigo-400 backdrop-blur-xs shadow-xs">
                      {course.level}
                    </span>
                    {course.category && (
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                        {course.category}
                      </span>
                    )}
                  </div>

                  {/* Duration & Price overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-semibold">
                    <span className="flex items-center gap-1 drop-shadow-md">
                      <Clock className="w-3.5 h-3.5 text-indigo-300" />
                      {course.estimatedDuration}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-black shadow-xs ${
                      course.price && course.price > 0
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-600 text-white'
                    }`}>
                      {course.price && course.price > 0 ? `$${course.price} USD` : 'Gratuito'}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Meta Chips */}
                  <div className="pt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{course.units.length} módulos • {totalLessons} lecciones estructuradas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">Para: {course.targetProfile}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-600 dark:group-hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <span>Ver Programa y Clases</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* CTA Button to Full Catalog */}
        <div className="text-center pt-8">
          <button
            onClick={onExploreCatalog}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Ir al Catálogo Completo de Cursos (Todos los Programas)</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </section>

      {/* ========================================================
          5. POR QUÉ FORMARTE CON NOSOTROS (BENEFICIOS)
          ======================================================== */}
      <section id="beneficios" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              Ventajas del Campus
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              ¿Por Qué Estudiar en Tus Cursos Inmobiliarios?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              A diferencia de la teoría tradicional, nuestra metodología se enfoca en resolver las situaciones reales con las que te encuentras a diario en la calle y en la notaría.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Enfoque 100% Práctico</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Casos reales de tasaciones, modelos de contratos y técnicas de negociación listas para ser implementadas de inmediato.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-600/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Certificado Oficial con QR</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Acredita tus conocimientos ante clientes y agencias con diplomas verificables en línea mediante código QR único.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Estudia a tu Ritmo</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Campus accesible las 24 horas del día desde teléfono móvil, tablet o computadora sin límites ni horarios fijos.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Plantillas Descargables</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Hojas de cálculo en Excel para tasación, guiones telefónicos y documentos PDF listos para tus operaciones diarias.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          6. TESTIMONIOS Y OPINIONES DE ALUMNOS REALES
          ======================================================== */}
      <section id="opiniones" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            Opiniones Reales
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Lo que Dicen Nuestros Alumnos
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Agentes independientes y equipos de agencias inmobiliarias que ya están aplicando lo aprendido.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "El curso de Captación en Exclusiva cambió por completo mi forma de hablar con propietarios. Pasé de que me colgaran el teléfono a cerrar 3 exclusivas el mes pasado."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Laura Méndez"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Laura Méndez</div>
                <div className="text-[11px] text-slate-400">Agente Inmobiliaria Independiente</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "La plantilla de tasación en Excel que descargué en el curso de valoración me ahorra horas en cada estudio de mercado. La explicación en video es clara y directa al grano."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Carlos Benítez"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Carlos Benítez</div>
                <div className="text-[11px] text-slate-400">Director de Agencia Inmobiliaria</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                "Poder estudiar desde el celular entre visita y visita a propiedades es lo mejor. Los cuestionarios al final de cada tema te ayudan a fijar los conceptos legales indispensables."
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                alt="Sofía Valenzuela"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">Sofía Valenzuela</div>
                <div className="text-[11px] text-slate-400">Asesora Residencial</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          7. PREGUNTAS FRECUENTES (FAQ ACORDEÓN)
          ======================================================== */}
      <section id="preguntas" className="py-16 sm:py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              Resolvemos tus Dudas
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Preguntas Frecuentes
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Todo lo que necesitas saber antes de empezar a formarte.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================
          8. FOOTER PROFESIONAL CON LEGAL Y LIBRO DE RECLAMACIONES
          ======================================================== */}
      <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Columnas Principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
            
            {/* Col 1 & 2: Brand */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-white font-extrabold text-lg">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span>TusCursos<span className="text-indigo-400">Inmobiliarios</span></span>
              </div>
              <p className="text-sm text-slate-300 max-w-md leading-relaxed">
                Somos parte de <a href="https://tucorretaje.com" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-indigo-400 underline decoration-indigo-500/50 underline-offset-2 transition-colors">Tucorretaje.com</a>. Plataforma líder en formación práctica para agentes y agencias inmobiliarias. Campus Virtual de Especialización Inmobiliaria en temas como tasación inmobiliaria, marketing inmobiliario, tributación inmobiliaria, entre otros.
              </p>
            </div>

            {/* Col 3: Navegación */}
            <div className="space-y-3.5">
              <span className="font-bold text-white block uppercase tracking-wider text-xs">Navegación</span>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button onClick={() => scrollToSection('catalogo')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">
                    Catálogo de Cursos
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('beneficios')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">
                    Beneficios del Campus
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('opiniones')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">
                    Opiniones y Testimonios
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('preguntas')} className="text-slate-300 hover:text-white transition-colors cursor-pointer text-left">
                    Preguntas Frecuentes
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal y Políticas (Sin libro de reclamaciones, que va al centro) */}
            <div className="space-y-3.5">
              <span className="font-bold text-white block uppercase tracking-wider text-xs">Legal y Políticas</span>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <button onClick={() => openLegal('terms')} className="text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer text-left">
                    Términos y Condiciones
                  </button>
                </li>
                <li>
                  <button onClick={() => openLegal('cookies')} className="text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer text-left">
                    Política de Cookies
                  </button>
                </li>
                <li>
                  <button onClick={() => openLegal('privacy')} className="text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer text-left">
                    Política de Privacidad
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Atención y Soporte */}
            <div className="space-y-3.5">
              <span className="font-bold text-white block uppercase tracking-wider text-xs">Atención y Soporte</span>
              <p className="text-sm text-slate-300">
                ¿Dudas sobre inscripciones o acceso institucional?
              </p>
              <div className="space-y-2.5 pt-1 text-sm">
                <a
                  href="mailto:hola@tucorretaje.com"
                  className="flex items-center gap-2.5 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span>hola@tucorretaje.com</span>
                </a>
                <a
                  href="https://wa.me/51913392312"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                  title="Escribir por WhatsApp a soporte"
                >
                  <svg className="w-4 h-4 shrink-0 fill-current text-emerald-400" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>+51 913 392 312</span>
                </a>
              </div>
            </div>

            {/* Col 5: Redes Sociales */}
            <div className="space-y-3.5">
              <span className="font-bold text-white block uppercase tracking-wider text-xs">Redes Sociales</span>
              <p className="text-sm text-slate-300">
                Únete a nuestra comunidad inmobiliaria:
              </p>
              <ul className="space-y-2 text-sm pt-1">
                <li>
                  <a
                    href="https://www.instagram.com/tucorretaje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-slate-300 hover:text-pink-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/tucorretaje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.tiktok.com/@tucorretaje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-slate-300 hover:text-cyan-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                    <span>TikTok</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/@tucorretaje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/tucorretaje"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-slate-300 hover:text-sky-400 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Sección Central Destacada: Libro de Reclamaciones */}
          <div className="pt-8 border-t border-slate-900 flex flex-col items-center justify-center text-center">
            <button
              onClick={() => openLegal('claims')}
              className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 hover:text-amber-200 transition-all font-bold text-sm sm:text-base shadow-lg shadow-amber-950/20 cursor-pointer group"
              title="Libro de Reclamaciones Virtual conforme a las normas de protección al consumidor"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">📖</span>
              <span>Libro de Reclamaciones Virtual</span>
            </button>
          </div>

          {/* Barra Inferior Limpia (Solo derechos de autor, sin duplicados) */}
          <div className="pt-6 border-t border-slate-900 text-center text-xs sm:text-sm text-slate-400">
            <p>© {new Date().getFullYear()} TusCursosInmobiliarios. Todos los derechos reservados. Campus de Especialización Inmobiliaria.</p>
          </div>

        </div>
      </footer>

      {/* Modal Legal Interactivo */}
      <LegalModal
        isOpen={legalModalOpen}
        initialTab={legalModalTab}
        onClose={() => setLegalModalOpen(false)}
      />

    </div>
  );
};
