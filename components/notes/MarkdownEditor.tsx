"use client";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { commands } from "@uiw/react-md-editor";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  {
    ssr: false,
    loading: () => <div>Loading editor...</div>
  }
);

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  preview?: "edit" | "live" | "preview";
  hideToolbar?: boolean;
  editable?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onDoubleClick?: () => void;
}

export default function MarkdownEditor({
  value,
  onChange,
  height = 400,
  preview = "preview",
  hideToolbar = true,
  editable = true,
  className = "",
  onKeyDown,
  onDoubleClick,
}: MarkdownEditorProps) {
  const { theme } = useTheme();

  return (
    <div className={className} onDoubleClick={onDoubleClick}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={height}
        preview={editable ? preview : "preview"}
        hideToolbar={!editable || hideToolbar}
        data-color-mode={theme === "dark" ? "dark" : "light"}
        visiableDragbar={false}
        onKeyDown={onKeyDown}
        previewOptions={{
          style: {
            backgroundColor: "transparent",
            padding: 0,
          },
        }}
        commands={[
          commands.bold,
          commands.italic,
          commands.strikethrough,
          commands.hr,
          commands.title,
          commands.unorderedListCommand,
          commands.orderedListCommand,
          commands.checkedListCommand,
          commands.quote,
          commands.code,
          commands.codeBlock,
          commands.link,
        ]}
      />
    </div>
  );
}