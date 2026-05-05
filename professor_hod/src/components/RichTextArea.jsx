import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, Underline } from 'lucide-react';

const RichTextArea = ({ 
  value, 
  onChange, 
  placeholder, 
  className = "",
  style = {},
  required = false,
  ...props 
}) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    if (editorRef.current) {
      // Check if we need to update the content
      const currentHtml = editorRef.current.innerHTML;
      const currentText = editorRef.current.textContent;
      
      // If value contains HTML tags, treat it as HTML; otherwise as plain text
      if (value && value !== currentText && value !== currentHtml) {
        if (value.includes('<') && value.includes('>')) {
          editorRef.current.innerHTML = value;
        } else {
          editorRef.current.textContent = value;
        }
      }
    }
  }, [value]);

  const handleInput = (e) => {
    const html = e.currentTarget.innerHTML || '';
    const text = e.currentTarget.textContent || '';
    if (onChange) {
      // Return both HTML and text, prioritizing HTML for rich content
      onChange({ target: { value: html, textContent: text } });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    
    // Get both HTML and plain text from clipboard
    const htmlPaste = (e.clipboardData || window.clipboardData).getData('text/html');
    const textPaste = (e.clipboardData || window.clipboardData).getData('text');
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    selection.deleteFromDocument();
    
    // If HTML content is available, use it; otherwise use plain text
    if (htmlPaste && htmlPaste.trim()) {
      const range = selection.getRangeAt(0);
      const fragment = range.createContextualFragment(htmlPaste);
      range.insertNode(fragment);
    } else {
      selection.getRangeAt(0).insertNode(document.createTextNode(textPaste));
    }
    
    selection.collapseToEnd();
    
    // Trigger the onChange event with HTML content
    const html = e.currentTarget.innerHTML || '';
    const text = e.currentTarget.textContent || '';
    if (onChange) {
      onChange({ target: { value: html, textContent: text } });
    }
  };

  const handleKeyDown = (e) => {
    // Preserve some basic text formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          document.execCommand('bold', false, null);
          handleInput(e);
          updateActiveFormats();
          break;
        case 'i':
          e.preventDefault();
          document.execCommand('italic', false, null);
          handleInput(e);
          updateActiveFormats();
          break;
        case 'u':
          e.preventDefault();
          document.execCommand('underline', false, null);
          handleInput(e);
          updateActiveFormats();
          break;
        default:
          break;
      }
    }
  };

  const applyFormat = (command) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, null);
      updateActiveFormats();
      // Trigger onChange manually
      const html = editorRef.current.innerHTML || '';
      const text = editorRef.current.textContent || '';
      if (onChange) {
        onChange({ target: { value: html, textContent: text } });
      }
    }
  };

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
    });
  };

  const handleSelectionChange = () => {
    if (document.activeElement === editorRef.current) {
      updateActiveFormats();
    }
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <div className="relative">
      {/* Formatting Toolbar */}
      <div className="flex gap-1 mb-2 border-b border-gray-200 dark:border-gray-600 pb-2">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
            activeFormats.bold ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
            activeFormats.italic ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => applyFormat('underline')}
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
            activeFormats.underline ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none overflow-auto ${className}`}
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: '1.5',
          ...style
        }}
        suppressContentEditableWarning={true}
        {...props}
      />
      {!value && (
        <div 
          className="absolute top-14 left-3 text-gray-400 dark:text-gray-500 pointer-events-none select-none"
          style={{ fontSize: 'inherit' }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextArea;
