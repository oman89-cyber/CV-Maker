import React from 'react';
import type { Editor } from '@tiptap/react';
import './RichTextToolbar.css';

interface RichTextToolbarProps {
  editor: Editor | null;
}

export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  // Prevent default on mousedown to preserve selection in the editor
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const currentColor = (editor.getAttributes('textStyle').color as string) || '#1e293b';
  const currentFont = (editor.getAttributes('textStyle').fontFamily as string) || '';
  const currentSize = (editor.getAttributes('textStyle').fontSize as string) || '';

  return (
    <div className="cv-toolbar" role="toolbar" aria-label="Rich text formatting">
      {/* Undo / Redo */}
      <div className="cv-toolbar__group">
        <button
          type="button"
          className="cv-toolbar__btn"
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          ↺
        </button>
        <button
          type="button"
          className="cv-toolbar__btn"
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          ↻
        </button>
      </div>

      <div className="cv-toolbar__separator" />

      {/* Font Family Selector */}
      <div className="cv-toolbar__group">
        <select
          className="cv-toolbar__select"
          value={currentFont}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const font = e.target.value;
            if (font) {
              editor.chain().focus().setFontFamily(font).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          aria-label="Font Family"
          title="Font Family"
        >
          <option value="">Font: Default</option>
          <option value="Inter, sans-serif">Inter</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Arial, sans-serif">Arial</option>
        </select>
      </div>

      {/* Font Size Selector */}
      <div className="cv-toolbar__group">
        <select
          className="cv-toolbar__select"
          value={currentSize}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const size = e.target.value;
            if (size) {
              editor.chain().focus().setFontSize(size).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
          aria-label="Font Size"
          title="Font Size"
        >
          <option value="">Size: Default</option>
          <option value="11px">11px</option>
          <option value="12px">12px</option>
          <option value="13px">13px</option>
          <option value="14px">14px</option>
          <option value="15px">15px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="20px">20px</option>
        </select>
      </div>

      <div className="cv-toolbar__separator" />

      {/* Basic Text Formats: Bold, Italic, Underline */}
      <div className="cv-toolbar__group">
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive('bold') ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive('italic') ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive('underline') ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
          aria-label="Underline"
        >
          <u>U</u>
        </button>
      </div>

      {/* Color Picker */}
      <div className="cv-toolbar__group">
        <label className="cv-toolbar__color-wrap" title="Text Color" aria-label="Text Color">
          <input
            type="color"
            className="cv-toolbar__color-input"
            value={currentColor}
            onChange={(e) => {
              editor.chain().focus().setColor(e.target.value).run();
            }}
          />
          <span className="cv-toolbar__color-preview">
            <span
              className="cv-toolbar__color-dot"
              style={{ backgroundColor: currentColor }}
            />
            <span>Color</span>
          </span>
        </label>
      </div>

      <div className="cv-toolbar__separator" />

      {/* Text Alignment */}
      <div className="cv-toolbar__group">
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive({ textAlign: 'left' }) ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align Left"
          aria-label="Align Left"
        >
          ⇠
        </button>
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive({ textAlign: 'center' }) ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align Center"
          aria-label="Align Center"
        >
          ↔
        </button>
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive({ textAlign: 'right' }) ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align Right"
          aria-label="Align Right"
        >
          ⇢
        </button>
      </div>

      <div className="cv-toolbar__separator" />

      {/* Lists */}
      <div className="cv-toolbar__group">
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive('bulletList') ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          aria-label="Bullet List"
        >
          •≡
        </button>
        <button
          type="button"
          className={`cv-toolbar__btn ${editor.isActive('orderedList') ? 'cv-toolbar__btn--active' : ''}`}
          onMouseDown={handleMouseDown}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
          aria-label="Numbered List"
        >
          1≡
        </button>
      </div>

      <div className="cv-toolbar__separator" />

      {/* Clear Formatting */}
      <div className="cv-toolbar__group">
        <button
          type="button"
          className="cv-toolbar__btn"
          onMouseDown={handleMouseDown}
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetAllMarks()
              .clearNodes()
              .unsetFontFamily()
              .unsetFontSize()
              .run()
          }
          title="Clear formatting"
          aria-label="Clear formatting"
        >
          ⌫
        </button>
      </div>
    </div>
  );
};
