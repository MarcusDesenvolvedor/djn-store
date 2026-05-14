"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { AdminInlineSpinner } from "@/components/admin/admin-loading";

type ProductRichTextEditorProps = Readonly<{
  id?: string;
  disabled?: boolean;
  placeholder?: string;
  onHtmlChange: (html: string) => void;
}>;

export function ProductRichTextEditor({
  id,
  disabled = false,
  placeholder = "Descrição longa (negrito, listas, títulos…)",
  onHtmlChange,
}: ProductRichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] rounded border border-outline-variant bg-background px-3 py-2 font-body text-body text-on-surface outline-none focus-visible:ring-1 focus-visible:ring-primary",
        ...(id !== undefined && id.length > 0 ? { id } : {}),
      },
    },
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onHtmlChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  if (!editor) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded border border-outline-variant bg-background/50 px-3 py-2"
      >
        <AdminInlineSpinner className="h-8 w-8 border-[3px]" aria-hidden />
        <span className="font-body-sm text-body-sm text-on-surface-variant">Carregando editor…</span>
      </div>
    );
  }

  return <EditorContent editor={editor} />;
}
