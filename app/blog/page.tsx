import Link from "next/link";
import React from "react";
import { allBlogs } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Post } from "./post";
import { Redis } from "@upstash/redis";
import { Eye } from "lucide-react";

const redis = Redis.fromEnv();

export const revalidate = 60;

export default async function BlogPage() {
  const views = (
    await redis.mget<number[]>(
      ...allBlogs.map((b) => ["pageviews", "blogs", b.slug].join(":")),
    )
  ).reduce((acc, v, i) => {
    acc[allBlogs[i].slug] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  const sortedBlogs = allBlogs
    .filter((b) => b.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Blog
          </h2>
          <p className="mt-4 text-zinc-400">
            Find below an overview of blog posts I have written. By clicking on
            the blog cards, you can read more about each post.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-600" />

        <div className="flex flex-col gap-8 mx-auto lg:mx-0">
          {sortedBlogs.map((blog) => (
            <Card key={blog.slug}>
              <Link href={`/blogs/${blog.slug}`}>
                <article className="relative w-full h-full p-4 md:p-8">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs text-zinc-100">
                      {blog.date ? (
                        <time dateTime={new Date(blog.date).toISOString()}>
                          {Intl.DateTimeFormat(undefined, {
                            dateStyle: "medium",
                          }).format(new Date(blog.date))}
                        </time>
                      ) : (
                        <span>SOON</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-zinc-500">
                      <Eye className="w-4 h-4" />{" "}
                      {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                        views[blog.slug] ?? 0,
                      )}
                    </span>
                  </div>

                  <h2
                    id="blog-title"
                    className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display"
                  >
                    {blog.title}
                  </h2>
                  <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                    {blog.description}
                  </p>
                  <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8">
                    <p className="text-zinc-200 hover:text-zinc-50">
                      Read more <span aria-hidden="true">&rarr;</span>
                    </p>
                  </div>
                </article>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}