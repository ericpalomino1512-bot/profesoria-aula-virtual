import React, { useState, useMemo } from 'react';
import type { Course, StudentUser } from '../types/course';
import { getCourseThumbnail } from '../utils/courseImages';
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
  Briefcase
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
          8. FOOTER PROFESIONAL
          ======================================================== */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span>TusCursos<span className="text-indigo-400">Inmobiliarios</span></span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Plataforma líder en formación práctica para agentes y agencias inmobiliarias. Programas actualizados con Inteligencia Artificial y certificación con código QR.
              </p>
            </div>

            {/* Links */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-white block">Enlaces Rápidos</span>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => scrollToSection('catalogo')} className="hover:text-white transition-colors cursor-pointer">
                    Catálogo de Cursos
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('beneficios')} className="hover:text-white transition-colors cursor-pointer">
                    Beneficios del Campus
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('opiniones')} className="hover:text-white transition-colors cursor-pointer">
                    Opiniones y Testimonios
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('preguntas')} className="hover:text-white transition-colors cursor-pointer">
                    Preguntas Frecuentes
                  </button>
                </li>
              </ul>
            </div>

            {/* Support / Contact */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-white block">Atención y Soporte</span>
              <p className="text-slate-400">
                ¿Dudas sobre inscripciones o acceso institucional?
              </p>
              <a
                href="mailto:hola@tucorretaje.com"
                className="inline-block font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                hola@tucorretaje.com
              </a>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} TusCursosInmobiliarios. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <button onClick={onOpenDashboard} className="hover:text-slate-400 transition-colors cursor-pointer">
                Acceso Alumnos
              </button>
              <button onClick={() => onOpenAuthModal('login')} className="hover:text-slate-400 transition-colors cursor-pointer">
                Iniciar Sesión
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
