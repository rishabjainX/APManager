import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const renderMarkdown = (text: string) => {
    if (!text) return '';

    // Split content into lines for processing
    const lines = text.split('\n');
    const renderedLines: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        renderedLines.push(
          <h1 key={index} className="text-2xl font-bold mt-6 mb-3 text-foreground">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        renderedLines.push(
          <h2 key={index} className="text-xl font-semibold mt-5 mb-2 text-foreground">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        renderedLines.push(
          <h3 key={index} className="text-lg font-medium mt-4 mb-2 text-foreground">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        renderedLines.push(
          <h4 key={index} className="text-base font-medium mt-3 mb-1 text-foreground">
            {line.substring(5)}
          </h4>
        );
      }
      // Bold text
      else if (line.includes('**') && line.includes('**')) {
        const parts = line.split('**');
        const renderedParts: React.ReactNode[] = [];
        parts.forEach((part, partIndex) => {
          if (partIndex % 2 === 1) {
            renderedParts.push(<strong key={partIndex}>{part}</strong>);
          } else if (part) {
            renderedParts.push(part);
          }
        });
        renderedLines.push(
          <p key={index} className="mb-2 text-foreground">
            {renderedParts}
          </p>
        );
      }
      // Italic text
      else if (line.includes('*') && line.includes('*') && !line.includes('**')) {
        const parts = line.split('*');
        const renderedParts: React.ReactNode[] = [];
        parts.forEach((part, partIndex) => {
          if (partIndex % 2 === 1) {
            renderedParts.push(<em key={partIndex}>{part}</em>);
          } else if (part) {
            renderedParts.push(part);
          }
        });
        renderedLines.push(
          <p key={index} className="mb-2 text-foreground">
            {renderedParts}
          </p>
        );
      }
      // Code blocks
      else if (line.startsWith('```')) {
        const codeStartIndex = index;
        let codeEndIndex = index;
        let codeContent = '';
        
        // Find the end of the code block
        for (let i = index + 1; i < lines.length; i++) {
          if (lines[i].startsWith('```')) {
            codeEndIndex = i;
            break;
          }
          codeContent += lines[i] + '\n';
        }
        
        if (codeEndIndex > codeStartIndex) {
          renderedLines.push(
            <pre key={index} className="bg-secondary p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm font-mono text-foreground whitespace-pre">
                {codeContent.trim()}
              </code>
            </pre>
          );
          
          // Skip the lines that were processed as code
          for (let i = codeStartIndex + 1; i <= codeEndIndex; i++) {
            renderedLines.push(null);
          }
        }
      }
      // Inline code
      else if (line.includes('`')) {
        const parts = line.split('`');
        const renderedParts: React.ReactNode[] = [];
        parts.forEach((part, partIndex) => {
          if (partIndex % 2 === 1) {
            renderedParts.push(
              <code key={partIndex} className="bg-secondary px-2 py-1 rounded text-sm font-mono">
                {part}
              </code>
            );
          } else if (part) {
            renderedParts.push(part);
          }
        });
        renderedLines.push(
          <p key={index} className="mb-2 text-foreground">
            {renderedParts}
          </p>
        );
      }
      // Lists
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        renderedLines.push(
          <li key={index} className="ml-4 mb-1 text-foreground">
            {line.substring(2)}
          </li>
        );
      }
      // Numbered lists
      else if (/^\d+\.\s/.test(line)) {
        renderedLines.push(
          <li key={index} className="ml-4 mb-1 text-foreground">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      // Links
      else if (line.includes('[') && line.includes('](') && line.includes(')')) {
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [, text, url] = linkMatch;
          const beforeLink = line.substring(0, line.indexOf('['));
          const afterLink = line.substring(line.indexOf(')') + 1);
          
          renderedLines.push(
            <p key={index} className="mb-2 text-foreground">
              {beforeLink}
              <a href={url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                {text}
              </a>
              {afterLink}
            </p>
          );
        } else {
          renderedLines.push(
            <p key={index} className="mb-2 text-foreground">
              {line}
            </p>
          );
        }
      }
      // Horizontal rule
      else if (line.startsWith('---') || line.startsWith('***')) {
        renderedLines.push(
          <hr key={index} className="my-4 border-t border-border" />
        );
      }
      // Empty lines
      else if (line.trim() === '') {
        renderedLines.push(<div key={index} className="h-2" />);
      }
      // Regular paragraphs
      else {
        renderedLines.push(
          <p key={index} className="mb-2 text-foreground leading-relaxed">
            {line}
          </p>
        );
      }
    });

    // Filter out null values and wrap lists properly
    const finalRendered: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let inList = false;

    renderedLines.forEach((line, index) => {
      if (line && typeof line === 'object' && 'type' in line && line.type === 'li') {
        if (!inList) {
          inList = true;
          currentList = [];
        }
        currentList.push(line);
      } else {
        if (inList && currentList.length > 0) {
          finalRendered.push(
            <ul key={`list-${index}`} className="mb-3 ml-4">
              {currentList}
            </ul>
          );
          currentList = [];
          inList = false;
        }
        if (line) {
          finalRendered.push(line);
        }
      }
    });

    // Handle any remaining list
    if (inList && currentList.length > 0) {
      finalRendered.push(
        <ul key="list-final" className="mb-3 ml-4">
          {currentList}
        </ul>
      );
    }

    return finalRendered;
  };

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
};

export default MarkdownRenderer;
