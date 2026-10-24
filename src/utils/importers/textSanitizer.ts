/**
 * Security and sanitization utilities for imported documents.
 * Ensures no unsanitized HTML or script execution occurs.
 */

export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function plainTextToSafeHtml(text: string): string {
  if (!text) return '';
  // Split paragraphs on multiple newlines
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    const single = text.trim();
    return single ? `<p>${escapeHtml(single)}</p>` : '';
  }

  return paragraphs
    .map((p) => {
      // Escape each line and join with <br />
      const escaped = p
        .split('\n')
        .map((l) => escapeHtml(l.trim()))
        .filter(Boolean)
        .join('<br />');
      return `<p>${escaped}</p>`;
    })
    .join('');
}

export function cleanBullet(bulletText: string): string {
  if (!bulletText) return '';
  // Remove leading bullet symbols (•, -, *, –, —, \u2022) or numeric lists (1., 2.)
  const cleaned = bulletText.replace(/^[\s•\-*–—\u2022\u25E6\u25AA\u25AB]+/, '').trim();
  return escapeHtml(cleaned);
}

export function cleanLines(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
