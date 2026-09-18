import React from 'react';

/**
 * Cleanly renders markdown text into React elements (bold, italic, code, line breaks)
 */
export function renderFormattedText(text) {
  if (!text) return null;
  if (typeof text !== 'string') return String(text);

  // Split into paragraphs / lines
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Process inline markdown elements
    const parts = [];
    let remaining = line;
    let keyIdx = 0;

    // Regex for bold (**text**), italic (*text*), inline code (`code`), and highlighted terms
    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(line)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(<span key={`txt-${lineIdx}-${keyIdx++}`}>{line.substring(lastIndex, match.index)}</span>);
      }

      const matchStr = match[0];
      if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
        parts.push(
          <strong key={`bold-${lineIdx}-${keyIdx++}`} className="font-bold text-emerald-300">
            {matchStr.slice(2, -2)}
          </strong>
        );
      } else if (matchStr.startsWith('*') && matchStr.endsWith('*')) {
        parts.push(
          <em key={`em-${lineIdx}-${keyIdx++}`} className="italic text-slate-300">
            {matchStr.slice(1, -1)}
          </em>
        );
      } else if (matchStr.startsWith('`') && matchStr.endsWith('`')) {
        parts.push(
          <code key={`code-${lineIdx}-${keyIdx++}`} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[11px]">
            {matchStr.slice(1, -1)}
          </code>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(<span key={`txt-end-${lineIdx}-${keyIdx++}`}>{line.substring(lastIndex)}</span>);
    }

    return (
      <span key={lineIdx} className="block min-h-[1.25rem]">
        {parts.length > 0 ? parts : ' '}
      </span>
    );
  });
}
