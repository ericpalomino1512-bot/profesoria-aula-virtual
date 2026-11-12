import LZString from 'lz-string';
import type { Course } from '../types/course';

/**
 * Encodes the entire course into a compressed, shareable URL.
 */
export function generateShareableUrl(course: Course): string {
  try {
    const jsonStr = JSON.stringify(course);
    const compressed = LZString.compressToEncodedURIComponent(jsonStr);
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    return `${baseUrl}#course=${compressed}`;
  } catch (e) {
    console.error('Error generating shareable URL:', e);
    return window.location.href;
  }
}

/**
 * Checks if the current page URL contains a shared course and decodes it.
 */
export function getSharedCourseFromUrl(): Course | null {
  if (typeof window === 'undefined') return null;

  try {
    const hash = window.location.hash;
    if (hash && hash.includes('course=')) {
      const match = hash.match(/course=([^&]+)/);
      if (match && match[1]) {
        const decompressed = LZString.decompressFromEncodedURIComponent(match[1]);
        if (decompressed) {
          const parsed = JSON.parse(decompressed);
          return parsed as Course;
        }
      }
    }
  } catch (e) {
    console.error('Error unpacking shared course from URL:', e);
  }

  return null;
}

/**
 * Exports the complete course as a downloadable package file (.json / .profesoria)
 */
export function exportCourseAsFile(course: Course) {
  const jsonStr = JSON.stringify(course, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const cleanName = course.title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .substring(0, 35);

  const link = document.createElement('a');
  link.href = url;
  link.download = `Curso_${cleanName || 'aula_virtual'}.profesoria.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Imports a course from a package file (.json / .profesoria)
 */
export async function importCourseFromFile(file: File): Promise<Course> {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!parsed.title || !Array.isArray(parsed.units)) {
    throw new Error('El archivo no tiene el formato válido de un curso de ProfesorIA.');
  }

  return parsed as Course;
}
