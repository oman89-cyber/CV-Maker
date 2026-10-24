import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { FontSize } from './extensions/FontSize';
import { RichTextToolbar } from './RichTextToolbar';
import './RichTextEditor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  ariaLabel?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = '100px',
  ariaLabel = 'Rich Text Editor',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      TextStyle,
      FontFamily,
      Color,
      Underline,
      TextAlign.configure({
        types: ['paragraph'],
      }),
      FontSize,
    ],
    content: value || '',
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        'aria-label': ariaLabel,
        class: 'cv-prosemirror-editor',
      },
    },
  });

  // Synchronize when value changes externally (e.g. switching between different entries)
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml && (value || currentHtml !== '<p></p>')) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  return (
    <div className="cv-rich-editor-box">
      <RichTextToolbar editor={editor} />
      <div className="cv-rich-editor-content" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
