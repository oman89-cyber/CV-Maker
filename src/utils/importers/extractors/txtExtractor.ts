import type { ExtractedDocument } from '../types';

export async function extractTxtText(file: File): Promise<ExtractedDocument> {
  let text: string;
  try {
    text = await file.text();
  } catch (err) {
    throw new Error('Unable to read the text file.', { cause: err });
  }

  const rawText = text.trim();
  if (!rawText || rawText.length === 0) {
    throw new Error('The text file is empty.');
  }

  return {
    rawText,
    format: 'txt',
    fileName: file.name,
    fileSize: file.size,
  };
}
