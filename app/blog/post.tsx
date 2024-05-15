import type { Blog } from "@/.contentlayer/generated";
import Link from "next/link";
import { Eye } from "lucide-react";

type Props = {
  blog: Blog;
  views: number;
};

export const Post: React.FC<Props> = ({ blog, views }) => {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <article className="relative p-4 md:p-8 border border-gray-800 rounded-lg">
        <div className="flex justify-between gap-2 items-center">
          <span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
            {blog.date ? (
              <time dateTime={new Date(blog.date).toISOString()}>
                {Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
                  new Date(blog.date)
                )}
              </time>
            ) : (
              <span>SOON</span>
            )}
          </span>
          <span className="text-zinc-500 text-xs flex items-center gap-1">
            <Eye className="w-4 h-4" />{" "}
            {Intl.NumberFormat("en-US", { notation: "compact" }).format(views)}
          </span>
        </div>
        <h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
          {blog.title}
        </h2>
        <p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
          {blog.description}
        </p>
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
          <p className="text-zinc-200 hover:text-zinc-50">
            Read more <span aria-hidden="true">&rarr;</span>
          </p>
        </div>
      </article>
    </Link>
  );
};