declare module 'pdfjs-dist/build/pdf.mjs' {
  const content: any;
  export = content;
}

declare module 'pdfjs-dist/build/pdf.worker.min.mjs?url' {
  const content: string;
  export default content;
}
