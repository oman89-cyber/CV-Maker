import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import type { ExtractedDocument } from '../types';

// Configure the PDF.js worker using Vite's URL import
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

export async function extractPdfText(file: File): Promise<ExtractedDocument> {
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new Error('Unable to read the PDF file. Please ensure the file is not corrupted.', {
      cause: err,
    });
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true,
    });

    const doc = await loadingTask.promise;
    const pageCount = doc.numPages;

    if (pageCount === 0) {
      throw new Error('The PDF document contains 0 pages.');
    }

    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Assemble lines based on item positions or strings
      let lastY: number | null = null;
      let pageStr = '';

      for (const item of textContent.items) {
        if ('str' in item) {
          const textItem = item as { str: string; transform: number[] };
          const currentY = textItem.transform ? textItem.transform[5] : null;

          if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
            pageStr += '\n' + textItem.str;
          } else {
            pageStr += (pageStr.length > 0 && !pageStr.endsWith(' ') ? ' ' : '') + textItem.str;
          }
          lastY = currentY;
        }
      }

      pageTexts.push(pageStr.trim());
    }

    const fullText = pageTexts.join('\n\n').trim();

    // Check for scanned / non-selectable PDF
    // If the PDF has pages but virtually no selectable text
    if (fullText.length < 20) {
      throw new Error(
        'No selectable text found in this PDF. It appears to be a scanned document or image. Scanned document OCR is not supported in this phase. Please upload a selectable-text PDF, DOCX, or text file.'
      );
    }

    return {
      rawText: fullText,
      format: 'pdf',
      fileName: file.name,
      fileSize: file.size,
      pageCount,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);

    // Differentiate known PDF.js errors
    if (errorMsg.includes('password') || errorMsg.includes('PasswordException')) {
      throw new Error('This PDF is password-protected. Please remove the password and try again.', {
        cause: err,
      });
    }
    if (errorMsg.includes('Invalid PDF structure') || errorMsg.includes('corrupted')) {
      throw new Error('The PDF file structure appears corrupted or invalid.', { cause: err });
    }
    if (errorMsg.includes('No selectable text found')) {
      throw err;
    }

    throw new Error(`Failed to extract text from PDF: ${errorMsg}`, { cause: err });
  }
}
