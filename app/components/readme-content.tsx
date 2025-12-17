// Simple markdown to HTML-like structure for rendering README content

interface ReadmeContentProps {
  content: string;
  repository: string;
}

export function ReadmeContent({ content, repository }: ReadmeContentProps) {
  // Parse and render markdown content
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';
  let listItems: string[] = [];
  let inList = false;
  let tableRows: string[][] = [];
  let inTable = false;
  let tableHasHeader = false;
  let key = 0;

  const processInlineMarkdown = (text: string): string => {
    return text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic  
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-zinc-200 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      // Links - convert relative GitHub links to absolute
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
        const absoluteUrl = url.startsWith('http') || url.startsWith('#') 
          ? url 
          : `https://github.com/${repository}/blob/main/${url.replace(/^\.\//, '')}`;
        return `<a href="${absoluteUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${text}</a>`;
      });
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="my-4 ml-6 list-disc">
          {listItems.map((item, i) => (
            <li key={i} className="mt-1" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1);
      
      elements.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-zinc-300">
            <thead className="bg-zinc-100">
              <tr>
                {headerRow.map((cell, i) => (
                  <th 
                    key={i} 
                    className="border border-zinc-300 px-4 py-2 text-left text-sm font-semibold"
                    dangerouslySetInnerHTML={{ __html: processInlineMarkdown(cell) }}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-zinc-50'}>
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="border border-zinc-300 px-4 py-2 text-sm"
                      dangerouslySetInnerHTML={{ __html: processInlineMarkdown(cell) }}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
    tableHasHeader = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (!inCodeBlock) {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3);
        codeBlockContent = [];
      } else {
        elements.push(
          <pre key={key++} className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            <code className="text-sm text-zinc-100">{codeBlockContent.join('\n')}</code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Tables - detect table rows
    if (trimmed.startsWith('|')) {
      flushList();
      
      // Remove leading | and trailing | if present
      let tableContent = trimmed.slice(1);
      if (tableContent.endsWith('|')) {
        tableContent = tableContent.slice(0, -1);
      }
      
      // Parse table cells
      const cells = tableContent
        .split('|')
        .map(cell => cell.trim());
      
      // Check if this is a separator row - all cells contain only dashes, colons, and spaces
      // A separator row has cells like "---", ":---", "---:", ":---:"
      const isSeparatorRow = cells.every(cell => {
        // Empty cells are ok in separators
        if (cell === '') return true;
        // Cell must only contain dashes, colons, and spaces, and have at least one dash
        return /^[:\-\s]+$/.test(cell) && cell.includes('-');
      }) && cells.some(cell => cell.includes('-')); // At least one cell must have dashes
      
      if (isSeparatorRow) {
        tableHasHeader = true;
        continue; // Skip separator rows
      }
      
      inTable = true;
      tableRows.push(cells);
      continue;
    }

    // If we were in a table and hit a non-table line, flush the table
    if (inTable && !trimmed.startsWith('|')) {
      flushTable();
    }

    // Empty lines
    if (!trimmed) {
      flushList();
      if (inTable) {
        flushTable();
      }
      continue;
    }

    // Headers
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      flushList();
      flushTable();
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;
      const headerClasses: Record<number, string> = {
        1: 'mt-8 text-3xl font-bold',
        2: 'mt-6 text-2xl font-semibold border-b border-zinc-300 pb-1',
        3: 'mt-5 text-xl font-semibold',
        4: 'mt-4 text-lg font-semibold',
        5: 'mt-3 text-base font-semibold',
        6: 'mt-3 text-sm font-semibold',
      };
      elements.push(
        <HeaderTag key={key++} className={headerClasses[level]} dangerouslySetInnerHTML={{ __html: processInlineMarkdown(text) }} />
      );
      continue;
    }

    // List items
    const listMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      flushTable();
      inList = true;
      listItems.push(listMatch[1]);
      continue;
    }

    // Numbered list
    const numListMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numListMatch) {
      flushTable();
      inList = true;
      listItems.push(numListMatch[1]);
      continue;
    }

    // Images
    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      flushList();
      flushTable();
      const alt = imgMatch[1];
      let src = imgMatch[2];
      // Convert relative image paths to GitHub raw URLs
      if (!src.startsWith('http')) {
        src = `https://raw.githubusercontent.com/${repository}/main/${src.replace(/^\.\//, '')}`;
      }
      elements.push(
        <div key={key++} className="my-4">
          <img src={src} alt={alt} className="max-w-full rounded-md" />
        </div>
      );
      continue;
    }

    // Blockquotes
    if (trimmed.startsWith('>')) {
      flushList();
      flushTable();
      const quoteText = trimmed.slice(1).trim();
      elements.push(
        <blockquote key={key++} className="my-4 border-l-4 border-zinc-300 pl-4 italic text-zinc-600" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(quoteText) }} />
      );
      continue;
    }

    // Regular paragraphs
    flushList();
    flushTable();
    elements.push(
      <p key={key++} className="my-4 leading-7" dangerouslySetInnerHTML={{ __html: processInlineMarkdown(trimmed) }} />
    );
  }

  // Flush any remaining content
  flushList();
  flushTable();

  return <div className="readme-content">{elements}</div>;
}

