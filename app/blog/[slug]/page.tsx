// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header"; 
import "./mdx.css";
import { ReportView } from "./view"; 
import { Redis } from "@upstash/redis";
import { TableOfContents } from "@/app/components/toc"; // Import the TOC component

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

const redis = Redis.fromEnv();

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allBlogs
    .filter((b) => b.published)
    .map((b) => ({
      slug: b.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const blog = allBlogs.find((blog) => blog.slug === slug);

  if (!blog) {
    notFound();
  }

  const views =
    (await redis.get<number>(["pageviews", "blog", slug].join(":"))) ?? 0;

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header blog={blog} views={views} /> 
      <ReportView slug={blog.slug} /> 
      
      <TableOfContents toc={blog.toc} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-3xl">
        <Mdx code={blog.body.code} />
      </article>
    </div>
  );
}