import JSZip from 'jszip';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker in Vite
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
} catch (e) {
  console.warn('PDF worker initialization notice:', e);
}

export interface ParsedSection {
  title: string;
  content: string;
  pageOrSlideNumber?: number;
}

export interface ParsedDocument {
  id: string;
  name: string;
  size: number;
  type: 'pdf' | 'pptx' | 'docx' | 'text' | 'other';
  extractedText: string;
  sections: ParsedSection[];
  itemCount: number; // number of pages, slides, or paragraphs
}

/**
 * Extracts plain text from an XML string by reading text nodes (e.g. <a:t> or <w:t>).
 */
function extractTextFromXML(xmlText: string): string[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  const textNodes: string[] = [];

  // Match standard PPTX and DOCX text tags: <a:t> and <w:t>
  const tags = ['a:t', 'w:t', 't'];
  for (const tag of tags) {
    const elements = xmlDoc.getElementsByTagName(tag);
    for (let i = 0; i < elements.length; i++) {
      const text = elements[i].textContent?.trim();
      if (text) {
        textNodes.push(text);
      }
    }
  }

  // If none found with namespace, try a regex fallback
  if (textNodes.length === 0) {
    const regex = /<(?:\w+:)?t[^>]*>([\s\S]*?)<\/(?:\w+:)?t>/gi;
    let match;
    while ((match = regex.exec(xmlText)) !== null) {
      const txt = match[1].replace(/<[^>]+>/g, '').trim();
      if (txt) textNodes.push(txt);
    }
  }

  return textNodes;
}

/**
 * Parses a PPTX presentation (.pptx)
 */
async function parsePPTX(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const sections: ParsedSection[] = [];
  let fullText = '';

  // Find all slide XML files (e.g. ppt/slides/slide1.xml)
  const slideFiles = Object.keys(zip.files).filter(path => 
    path.startsWith('ppt/slides/slide') && path.endsWith('.xml')
  );

  // Sort slides numerically
  slideFiles.sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/[^0-9]/g, ''), 10) || 0;
    return numA - numB;
  });

  for (let idx = 0; idx < slideFiles.length; idx++) {
    const slidePath = slideFiles[idx];
    const xmlContent = await zip.files[slidePath].async('string');
    const texts = extractTextFromXML(xmlContent);

    if (texts.length > 0) {
      // First prominent line is typically the slide title
      const title = texts[0].length < 120 ? texts[0] : `Diapositiva ${idx + 1}`;
      const content = texts.slice(texts[0].length < 120 ? 1 : 0).join('\n');

      sections.push({
        title,
        content: content || texts.join(' '),
        pageOrSlideNumber: idx + 1
      });

      fullText += `\n--- Diapositiva ${idx + 1}: ${title} ---\n${content || texts.join(' ')}\n`;
    }
  }

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    size: file.size,
    type: 'pptx',
    extractedText: fullText.trim() || 'Presentación sin texto legible.',
    sections,
    itemCount: slideFiles.length
  };
}

/**
 * Parses a Word document (.docx)
 */
async function parseDOCX(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  let fullText = '';
  const sections: ParsedSection[] = [];

  const docFile = zip.files['word/document.xml'];
  if (docFile) {
    const xmlContent = await docFile.async('string');
    const texts = extractTextFromXML(xmlContent);

    // Group text into rough paragraphs/sections
    let currentTitle = file.name.replace(/\.[^/.]+$/, '');
    let currentBuffer: string[] = [];

    texts.forEach((line) => {
      // If short line looks like a title/heading
      if (line.length > 3 && line.length < 80 && (line === line.toUpperCase() || line.endsWith(':'))) {
        if (currentBuffer.length > 0) {
          sections.push({
            title: currentTitle,
            content: currentBuffer.join(' ')
          });
          currentBuffer = [];
        }
        currentTitle = line.replace(':', '');
      } else {
        currentBuffer.push(line);
      }
    });

    if (currentBuffer.length > 0) {
      sections.push({
        title: currentTitle,
        content: currentBuffer.join(' ')
      });
    }

    fullText = texts.join('\n');
  }

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    size: file.size,
    type: 'docx',
    extractedText: fullText.trim() || 'Documento sin texto legible.',
    sections: sections.length > 0 ? sections : [{ title: file.name, content: fullText }],
    itemCount: sections.length || 1
  };
}

/**
 * Parses a PDF document (.pdf) using PDF.js
 */
async function parsePDF(file: File): Promise<ParsedDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdfDoc = await loadingTask.promise;

  const sections: ParsedSection[] = [];
  let fullText = '';

  const numPages = pdfDoc.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      .map((item: any) => ('str' in item ? item.str : ''))
      .filter((s: string) => s.trim().length > 0);

    const pageText = pageStrings.join(' ').replace(/\s+/g, ' ').trim();

    if (pageText) {
      const firstLine = pageStrings[0] || `Página ${pageNum}`;
      const title = firstLine.length < 90 ? firstLine : `Página ${pageNum}`;

      sections.push({
        title,
        content: pageText,
        pageOrSlideNumber: pageNum
      });

      fullText += `\n--- Página ${pageNum}: ${title} ---\n${pageText}\n`;
    }
  }

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    size: file.size,
    type: 'pdf',
    extractedText: fullText.trim() || 'Documento PDF sin texto seleccionable.',
    sections,
    itemCount: numPages
  };
}

/**
 * Parses Plain text or Markdown (.txt, .md, .csv)
 */
async function parsePlainText(file: File): Promise<ParsedDocument> {
  const rawText = await file.text();
  const lines = rawText.split('\n');

  const sections: ParsedSection[] = [];
  let currentTitle = file.name.replace(/\.[^/.]+$/, '');
  let currentBuffer: string[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') || (trimmed.length > 3 && trimmed.length < 80 && trimmed.endsWith(':'))) {
      if (currentBuffer.length > 0) {
        sections.push({
          title: currentTitle,
          content: currentBuffer.join('\n')
        });
        currentBuffer = [];
      }
      currentTitle = trimmed.replace(/^#+\s*/, '').replace(':', '');
    } else if (trimmed) {
      currentBuffer.push(trimmed);
    }
  });

  if (currentBuffer.length > 0) {
    sections.push({
      title: currentTitle,
      content: currentBuffer.join('\n')
    });
  }

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    size: file.size,
    type: 'text',
    extractedText: rawText.trim(),
    sections: sections.length > 0 ? sections : [{ title: currentTitle, content: rawText }],
    itemCount: sections.length || 1
  };
}

/**
 * General parser dispatcher that inspects file extension or MIME type.
 */
export async function parseDocumentFile(file: File): Promise<ParsedDocument> {
  const fileName = file.name.toLowerCase();

  try {
    if (fileName.endsWith('.pptx')) {
      return await parsePPTX(file);
    } else if (fileName.endsWith('.docx')) {
      return await parseDOCX(file);
    } else if (fileName.endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (
      fileName.endsWith('.txt') ||
      fileName.endsWith('.md') ||
      fileName.endsWith('.markdown') ||
      fileName.endsWith('.csv') ||
      fileName.endsWith('.json') ||
      file.type.startsWith('text/')
    ) {
      return await parsePlainText(file);
    } else {
      // Fallback: try plain text
      return await parsePlainText(file);
    }
  } catch (error: any) {
    console.error(`Error parsing document ${file.name}:`, error);
    throw new Error(`No se pudo leer el archivo ${file.name}: ${error.message || 'Formato no soportado o archivo dañado'}`);
  }
}
