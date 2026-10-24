import type { ImportResult, ImportFormat } from './types';
import { extractPdfText } from './extractors/pdfExtractor';
import { extractDocxText } from './extractors/docxExtractor';
import { extractTxtText } from './extractors/txtExtractor';
import { validateAndParseJson } from './extractors/jsonExtractor';
import { parseDocumentText } from './deterministicParser';

export * from './types';
export * from './textSanitizer';

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function parseUploadedFile(file: File): Promise<ImportResult> {
  const fileName = file.name;
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();

  // 1. File size validation
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 15MB limit. Please upload a smaller document.`,
      warnings: [],
      fileName,
      format: (ext.replace('.', '') as ImportFormat) || 'txt',
    };
  }

  // 2. Format validation & Extraction
  try {
    if (ext === '.pdf') {
      const extracted = await extractPdfText(file);
      return parseDocumentText(extracted);
    }

    if (ext === '.docx') {
      const extracted = await extractDocxText(file);
      return parseDocumentText(extracted);
    }

    if (ext === '.txt') {
      const extracted = await extractTxtText(file);
      return parseDocumentText(extracted);
    }

    if (ext === '.json') {
      const text = await file.text();
      const cvData = validateAndParseJson(text, fileName);
      return {
        success: true,
        cvData,
        warnings: [],
        rawText: text,
        fileName,
        format: 'json',
      };
    }

    return {
      success: false,
      error: `Unsupported file format '${ext || 'unknown'}'. Please upload a PDF (.pdf), Word (.docx), JSON (.json), or Plain Text (.txt) file.`,
      warnings: [],
      fileName,
      format: 'txt',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: errorMsg,
      warnings: [],
      fileName,
      format: (ext.replace('.', '') as ImportFormat) || 'txt',
    };
  }
}
