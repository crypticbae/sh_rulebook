import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { Image } from '@tiptap/extension-image';
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Type, ImageIcon } from 'lucide-react';

interface RuleEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RuleEditor: React.FC<RuleEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'max-w-full rounded-lg my-4',
        },
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = () => {
    const url = window.prompt('Enter the image URL:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    isActive, 
    onClick, 
    children 
  }: { 
    isActive: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-white/10 ${
        isActive ? 'text-[#911111] bg-white/5' : 'text-gray-400'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <div className="bg-black/50 border-b border-white/10 p-2 flex space-x-2">
        <select
          value={editor.isActive('heading') ? `h${editor.isActive('heading', { level: 1 }) ? '1' : editor.isActive('heading', { level: 2 }) ? '2' : '3'}` : 'p'}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'p') {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(value[1]) }).run();
            }
          }}
          className="bg-black/50 text-white border border-white/10 rounded-md px-2 py-1 text-sm flex items-center space-x-1"
        >
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div className="w-px h-6 bg-white/10 mx-2" />

        <ToolbarButton
          isActive={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          isActive={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          isActive={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-white/10 mx-2" />
        
        <ToolbarButton
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        
        <ToolbarButton
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-white/10 mx-2" />
        
        <ToolbarButton
          isActive={false}
          onClick={addImage}
        >
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>
      
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none p-4 min-h-[200px] bg-black/30"
      />
    </div>
  );
};

export default RuleEditor;