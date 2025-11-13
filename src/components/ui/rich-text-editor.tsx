'use client';

import { forwardRef, useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { 
  IconBold, 
  IconItalic, 
  IconUnderline, 
  IconList,
  IconListNumbers,
  IconQuote,
  IconH1,
  IconH2
} from '@tabler/icons-react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  ({ value = '', onChange, placeholder = 'Start writing...', disabled = false, className, error = false }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const execCommand = useCallback((command: string, value?: string) => {
      if (disabled) return;
      
      document.execCommand(command, false, value);
      
      // Trigger onChange after command
      if (contentRef.current && onChange) {
        const content = contentRef.current.innerHTML;
        onChange(content);
      }
      
      // Refocus the editor
      contentRef.current?.focus();
    }, [disabled, onChange]);

    const handleInput = useCallback(() => {
      if (contentRef.current && onChange) {
        const content = contentRef.current.innerHTML;
        onChange(content);
      }
    }, [onChange]);

    const handlePaste = useCallback((e: React.ClipboardEvent) => {
      if (disabled) return;
      
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
      handleInput();
    }, [disabled, handleInput]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (disabled) return;
      
      // Handle keyboard shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            execCommand('bold');
            break;
          case 'i':
            e.preventDefault();
            execCommand('italic');
            break;
          case 'u':
            e.preventDefault();
            execCommand('underline');
            break;
        }
      }
    }, [disabled, execCommand]);

    return (
      <div ref={ref} className={cn("rich-text-editor", className)}>
        <div
          className={cn(
            "border rounded-md",
            error ? "border-destructive" : "border-input",
            disabled && "opacity-50 cursor-not-allowed",
            isFocused && "outline-none ring-2 ring-ring ring-offset-2"
          )}
        >
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border-b border-border bg-muted/20">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('bold')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconBold className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('italic')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconItalic className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('underline')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconUnderline className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'h1')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconH1 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'h2')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconH2 className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('insertUnorderedList')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconList className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('insertOrderedList')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconListNumbers className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-6 bg-border mx-1" />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => execCommand('formatBlock', 'blockquote')}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              className="h-8 w-8"
            >
              <IconQuote className="h-4 w-4" />
            </Button>
          </div>

          {/* Editor Content */}
          <div className="relative">
            <div
              ref={contentRef}
              contentEditable={!disabled}
              className={cn(
                "min-h-[150px] p-3 resize-none focus:outline-none",
                "prose prose-sm max-w-none",
                disabled && "cursor-not-allowed"
              )}
              dangerouslySetInnerHTML={{ __html: value }}
              onInput={handleInput}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                minHeight: '150px',
                fontFamily: 'inherit',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
            />
            
            {/* Placeholder */}
            {!value && !isFocused && (
              <div className="absolute top-3 left-3 text-muted-foreground pointer-events-none select-none">
                {placeholder}
              </div>
            )}
          </div>
        </div>
        
        <style jsx global>{`
          .rich-text-editor [contenteditable] {
            outline: none;
          }
          
          .rich-text-editor [contenteditable] h1 {
            font-size: 1.875rem;
            font-weight: bold;
            margin: 1rem 0 0.5rem 0;
            line-height: 1.2;
          }
          
          .rich-text-editor [contenteditable] h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0.75rem 0 0.5rem 0;
            line-height: 1.3;
          }
          
          .rich-text-editor [contenteditable] p {
            margin: 0.5rem 0;
          }
          
          .rich-text-editor [contenteditable] ul,
          .rich-text-editor [contenteditable] ol {
            margin: 0.5rem 0;
            padding-left: 1.5rem;
          }
          
          .rich-text-editor [contenteditable] li {
            margin: 0.25rem 0;
          }
          
          .rich-text-editor [contenteditable] blockquote {
            border-left: 4px solid hsl(var(--border));
            padding-left: 1rem;
            margin: 1rem 0;
            font-style: italic;
            color: hsl(var(--muted-foreground));
          }
          
          .rich-text-editor [contenteditable] strong {
            font-weight: bold;
          }
          
          .rich-text-editor [contenteditable] em {
            font-style: italic;
          }
          
          .rich-text-editor [contenteditable] u {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';