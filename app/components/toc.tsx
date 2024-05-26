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

  const getChapterNumber = (level: number) => {
    if (level === 1) {
      mainChapterNumber += 1;
      subChapterNumber = 0; // Reset subchapter number
      return `${mainChapterNumber}.`;
    } else {
      subChapterNumber += 1;
      return `${mainChapterNumber}.${subChapterNumber}`;
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
    <div className="toc-container mx-auto my-8 p-4 rounded-lg shadow-lg bg-gradient-to-tl from-zinc-300/10 via-zinc-300 to-zinc-300/10 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
      <ul>
        {toc.map((item, index) => {
          const chapterNumber = getChapterNumber(item.level);
          const itemStyle = item.level === 1
            ? "mt-2 scroll-m-20 text-lg font-normal text-black"
            : "mt-2 scroll-m-20 text-base font-normal text-black ml-4";
          
          const slug = generateSlug(item.title);

          return (
            <li key={index} className={item.level > 1 ? "ml-8" : ""}>
              <a href={`#${slug}`} className={`text-black hover:underline ${itemStyle}`}>
                {chapterNumber} {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
