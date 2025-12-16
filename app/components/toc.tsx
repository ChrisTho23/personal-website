import React from 'react';

type TocItem = {
  level: number;
  title: string;
};

type TableOfContentsProps = {
  toc: TocItem[];
};

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  let mainChapterNumber = 0;
  let subChapterNumber = 0;
  let subSubChapterNumber = 0;

  const getChapterNumber = (level: number) => {
    if (level === 1) {
      mainChapterNumber += 1;
      subChapterNumber = 0; // Reset subchapter number
      subSubChapterNumber = 0; // Reset sub-subchapter number
      return `${mainChapterNumber}.`;
    } else if (level === 2) {
      subChapterNumber += 1;
      subSubChapterNumber = 0; // Reset sub-subchapter number
      return `${mainChapterNumber}.${subChapterNumber}`;
    } else {
      subSubChapterNumber += 1;
      return `${mainChapterNumber}.${subChapterNumber}.${subSubChapterNumber}`;
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove all non-word characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Replace multiple - with single -
  };

  return (
    <nav className="toc-container p-5 rounded-lg bg-zinc-100/80 border border-zinc-200">
      <h2 className="text-xl font-bold mb-4 text-zinc-800">Contents</h2>
      <ul className="space-y-2">
        {toc.map((item, index) => {
          const chapterNumber = getChapterNumber(item.level);
          const slug = generateSlug(item.title);

          return (
            <li key={index} className={item.level === 2 ? "ml-5" : item.level === 3 ? "ml-10" : ""}>
              <a 
                href={`#${slug}`} 
                className={`block py-1 hover:text-blue-600 hover:underline transition-colors ${
                  item.level === 1 
                    ? "text-base font-medium text-zinc-700" 
                    : item.level === 2
                    ? "text-sm text-zinc-500"
                    : "text-xs text-zinc-400"
                }`}
              >
                {chapterNumber} {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
