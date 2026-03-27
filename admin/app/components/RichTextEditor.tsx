'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import ResizableImage from 'tiptap-extension-resize-image';
import { Youtube } from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { FontFamily } from '@tiptap/extension-font-family';
import FontSize from 'tiptap-extension-font-size';
import LineHeight from 'tiptap-extension-line-height';
import Indent from '@weiruo/tiptap-extension-indent';
import { useCallback, useState, useEffect } from 'react';
import MediaPicker from './MediaPicker';

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.getAttribute('data-background-color'),
        renderHTML: attributes => {
          if (!attributes.backgroundColor) {
            return {}
          }
          return {
            'data-background-color': attributes.backgroundColor,
            style: `background-color: ${attributes.backgroundColor}`,
          }
        },
      },
    }
  },
})

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  icon, 
  title,
  className = ""
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  disabled?: boolean, 
  icon: string, 
  title: string,
  className?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all flex items-center justify-center ${
      isActive 
        ? 'bg-primary text-white shadow-sm' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    } disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
  </button>
);

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [isSourceView, setIsSourceView] = useState(false);
  const [sourceCode, setSourceCode] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      ResizableImage,
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'rounded-xl overflow-hidden my-4 max-w-full aspect-video',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      CustomTableCell,
      FontFamily,
      FontSize,
      LineHeight.configure({
        types: ['heading', 'paragraph'],
        defaultLineHeight: '1.5',
      }),
      Indent.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setSourceCode(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-3 text-slate-700 text-sm leading-relaxed',
      },
    },
  });

  // Sync source view content when toggled
  useEffect(() => {
    if (!isSourceView && editor && sourceCode !== editor.getHTML()) {
      editor.commands.setContent(sourceCode);
    }
  }, [isSourceView, editor, sourceCode]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL link:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL hình ảnh:');
    if (url) {
      editor.chain().focus().insertContent(`<img src="${url}" />`).run();
    }
  }, [editor]);

  const addVideo = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({ src: url });
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const [pickerOpen, setPickerOpen] = useState(false);

  const addImageFromLibrary = (url: string) => {
    if (editor) {
      editor.chain().focus().insertContent(`<img src="${url}" />`).run();
    }
    setPickerOpen(false);
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 border-b border-slate-200">
        <MenuButton
          title="Bold (Ctrl+B)"
          icon="format_bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          disabled={isSourceView}
        />
        <MenuButton
          title="Italic (Ctrl+I)"
          icon="format_italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          disabled={isSourceView}
        />
        <MenuButton
          title="Underline (Ctrl+U)"
          icon="format_underlined"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          disabled={isSourceView}
        />
        <MenuButton
          title="Strike"
          icon="format_strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          disabled={isSourceView}
        />
        <div className="w-px h-6 bg-slate-200 mx-1" />
        
        <MenuButton
          title="Heading 1"
          icon="format_h1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          disabled={isSourceView}
        />
        <MenuButton
          title="Heading 2"
          icon="format_h2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          disabled={isSourceView}
        />
        <MenuButton
          title="Heading 3"
          icon="format_h3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          disabled={isSourceView}
        />
        <div className="w-px h-6 bg-slate-200 mx-1" />

        <MenuButton
          title="Bullet List"
          icon="format_list_bulleted"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          disabled={isSourceView}
        />
        <MenuButton
          title="Ordered List"
          icon="format_list_numbered"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          disabled={isSourceView}
        />
        <MenuButton
          title="Blockquote"
          icon="format_quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          disabled={isSourceView}
        />
        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Font Family */}
        <select
          className="h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/30"
          onChange={(e) => (editor.commands as any).setFontFamily(e.target.value)}
          value={editor.getAttributes('textStyle').fontFamily || ''}
          disabled={isSourceView}
        >
          <option value="">Phông chữ</option>
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>

        {/* Font Size */}
        <select
          className="h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/30 w-16"
          onChange={(e) => (editor.commands as any).setFontSize(e.target.value)}
          value={editor.getAttributes('textStyle').fontSize || ''}
          disabled={isSourceView}
        >
          <option value="">Cỡ</option>
          {['8px', '10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        {/* Line Height */}
        <select
          className="h-9 px-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/30 w-16"
          onChange={(e) => (editor.commands as any).setLineHeight(e.target.value)}
          value={editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight || ''}
          disabled={isSourceView}
        >
          <option value="">Dòng</option>
          {['1', '1.15', '1.5', '2', '2.5', '3'].map(lh => (
            <option key={lh} value={lh}>{lh}</option>
          ))}
        </select>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <MenuButton
          title="Dịch Trái (Outdent)"
          icon="format_indent_decrease"
          onClick={() => (editor.commands as any).outdent()}
          disabled={isSourceView}
        />
        <MenuButton
          title="Dịch Phải (Indent)"
          icon="format_indent_increase"
          onClick={() => (editor.commands as any).indent()}
          disabled={isSourceView}
        />

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <MenuButton
          title="Align Left"
          icon="format_align_left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          disabled={isSourceView}
        />
        <MenuButton
          title="Align Center"
          icon="format_align_center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          disabled={isSourceView}
        />
        <MenuButton
          title="Align Right"
          icon="format_align_right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          disabled={isSourceView}
        />
        <MenuButton
          title="Justify"
          icon="format_align_justify"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          disabled={isSourceView}
        />
        <div className="w-px h-6 bg-slate-200 mx-1" />

        <MenuButton
          title="Add Link"
          icon="link"
          onClick={setLink}
          isActive={editor.isActive('link')}
          disabled={isSourceView}
        />
        <MenuButton
          title="Insert from Library"
          icon="photo_library"
          onClick={() => setPickerOpen(true)}
          disabled={isSourceView}
        />
        <MenuButton
          title="Insert Image URL"
          icon="add_photo_alternate"
          onClick={addImage}
          disabled={isSourceView}
        />
        <MenuButton
          title="Insert Video"
          icon="video_library"
          onClick={addVideo}
          disabled={isSourceView}
        />
        <MenuButton
          title="Insert Table"
          icon="table_chart"
          onClick={addTable}
          isActive={editor.isActive('table')}
          disabled={isSourceView}
        />
        
        {/* Table Background Color Picker */}
        <div className="relative group flex items-center h-9 px-1 rounded-lg hover:bg-slate-100 transition-colors" title="Table Cell Background Color">
           <span className="material-symbols-outlined text-[20px] text-slate-600 mr-1">format_color_fill</span>
           <input
             type="color"
             onInput={(e) => {
               if (editor.isActive('table')) {
                 editor.chain().focus().updateAttributes('tableCell', { backgroundColor: (e.target as HTMLInputElement).value }).run();
               }
             }}
             disabled={isSourceView}
             className="w-5 h-5 cursor-pointer disabled:opacity-30 p-0 border-0 bg-transparent"
           />
        </div>
        
        <div className="w-px h-6 bg-slate-200 mx-1" />
        <MenuButton
          title="Clear Formatting"
          icon="format_clear"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          disabled={isSourceView}
        />
        
        <div className="flex-1" />
        
        <MenuButton
          title="Source Code"
          icon="code"
          onClick={() => setIsSourceView(!isSourceView)}
          isActive={isSourceView}
          className={isSourceView ? "!bg-amber-500 !text-white" : ""}
        />

        <MenuButton
          title="Undo"
          icon="undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || isSourceView}
        />
        <MenuButton
          title="Redo"
          icon="redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || isSourceView}
        />
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        {isSourceView ? (
          <textarea
            className="w-full min-h-[300px] p-4 font-mono text-sm bg-slate-900 text-amber-200 focus:outline-none"
            value={sourceCode}
            onChange={(e) => {
              setSourceCode(e.target.value);
              onChange(e.target.value);
            }}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .prose ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
        .prose ol { list-style-type: decimal !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
        .prose h1 { font-size: 1.875rem !important; font-weight: 800 !important; margin-bottom: 1rem !important; color: #0f172a !important; }
        .prose h2 { font-size: 1.5rem !important; font-weight: 700 !important; margin-bottom: 0.75rem !important; color: #1e293b !important; }
        .prose h3 { font-size: 1.25rem !important; font-weight: 600 !important; margin-bottom: 0.5rem !important; color: #334155 !important; }
        .prose p { margin-bottom: 0.75rem !important; }
        .prose blockquote { border-left: 4px solid #e2e8f0 !important; padding-left: 1rem !important; font-style: italic !important; color: #64748b !important; margin-bottom: 1rem !important; }
        .prose table { width: 100% !important; border-collapse: collapse !important; margin-bottom: 1rem !important; }
        .prose table td, .prose table th { border: 1px solid #e2e8f0 !important; padding: 8px !important; min-width: 1em !important; position: relative !important; }
        .prose table th { background-color: #f8fafc !important; font-weight: bold !important; text-align: left !important; }
        
        /* Image Resize Handles */
        .prose img { transition: all 0.2s !important; max-width: 100%; height: auto; }
        .prose img.ProseMirror-selectednode { outline: 3px solid #3b82f6 !important; }
        .resize-cursor { cursor: nwse-resize !important; }
        
        /* Indentation Styles */
        .prose [data-indent="1"] { margin-left: 2rem !important; }
        .prose [data-indent="2"] { margin-left: 4rem !important; }
        .prose [data-indent="3"] { margin-left: 6rem !important; }
        .prose [data-indent="4"] { margin-left: 8rem !important; }
        .prose [data-indent="5"] { margin-left: 10rem !important; }
        .prose [data-indent="6"] { margin-left: 12rem !important; }
        .prose [data-indent="7"] { margin-left: 14rem !important; }
        .prose [data-indent="8"] { margin-left: 16rem !important; }
        .prose [data-indent="9"] { margin-left: 18rem !important; }
        .prose [data-indent="10"] { margin-left: 20rem !important; }
      ` }} />

      <MediaPicker 
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={addImageFromLibrary}
        title="Chèn hình vào bài viết"
      />
    </div>
  );
}
