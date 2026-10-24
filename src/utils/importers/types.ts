import type { CVData } from '../../types/cv';

export type ImportFormat = 'pdf' | 'docx' | 'json' | 'txt';

export interface ExtractedDocument {
  rawText: string;
  format: ImportFormat;
  fileName: string;
  fileSize: number;
  pageCount?: number;
}

export interface ParseWarning {
  field?: string;
  message: string;
}

export interface ImportResult {
  success: boolean;
  cvData?: CVData;
  error?: string;
  warnings: ParseWarning[];
  rawText?: string;
  fileName: string;
  format: ImportFormat;
}
