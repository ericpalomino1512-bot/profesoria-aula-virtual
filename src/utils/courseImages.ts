// Helper to provide high-quality real estate course thumbnail images
export const getCourseThumbnail = (course: { title: string; category?: string; thumbnailUrl?: string }): string => {
  if (course.thumbnailUrl && course.thumbnailUrl.trim().length > 0) {
    return course.thumbnailUrl;
  }

  const text = `${course.title} ${course.category || ''}`.toLowerCase();

  // Captación de exclusivas & negociación
  if (text.includes('captaci') || text.includes('exclusiv') || text.includes('propietari') || text.includes('mandato')) {
    return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=80';
  }

  // Marketing digital & redes sociales
  if (text.includes('market') || text.includes('redes') || text.includes('lead') || text.includes('digital') || text.includes('video')) {
    return 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80';
  }

  // Valoración, tasación & finanzas inmobiliarias
  if (text.includes('tasaci') || text.includes('precio') || text.includes('valorac') || text.includes('financ') || text.includes('invers')) {
    return 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=80';
  }

  // Aspectos legales, contratos, notarías & fiscalidad
  if (text.includes('legal') || text.includes('contrat') || text.includes('notar') || text.includes('fiscal') || text.includes('derecho')) {
    return 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1000&q=80';
  }

  // Ciencia / Química / Bachillerato demo
  if (text.includes('quimic') || text.includes('organ') || text.includes('ebau') || text.includes('cienc')) {
    return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80';
  }

  // Default luxury architecture / real estate
  return 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80';
};
