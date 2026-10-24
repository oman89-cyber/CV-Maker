import mammoth from 'mammoth';
import type { ExtractedDocument } from '../types';

export async function extractDocxText(file: File): Promise<ExtractedDocument> {
  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new Error('Unable to read the DOCX file. Please ensure the file is not corrupted.', {
      cause: err,
    });
  }

  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    const rawText = (result.value || '').trim();

    if (!rawText || rawText.length === 0) {
      throw new Error('The Word (DOCX) document is empty or contains no readable text.');
    }

    return {
      rawText,
      format: 'docx',
      fileName: file.name,
      fileSize: file.size,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    if (errorMsg.includes('empty or contains no readable text')) {
      throw err;
    }
    throw new Error(`Failed to extract text from DOCX: ${errorMsg}`, { cause: err });
  }
}
