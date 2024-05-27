import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header"; 
import "./mdx.css";
import { ReportView } from "./view"; 
import { Redis } from "@upstash/redis";
import { TableOfContents } from "@/app/components/toc"; // Import the TOC component
import Head from "next/head";

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
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.description} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:image" content={blog.picture} /> {/* Replace with the correct image URL */}
        <meta property="og:url" content={`https://yourwebsite.com/blog/${blog.slug}`} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        <meta name="twitter:image" content={blog.picture} /> {/* Replace with the correct image URL */}
      </Head>
      <div className="bg-zinc-50 min-h-screen">
        <Header blog={blog} views={views} /> 
        <ReportView slug={blog.slug} /> 
        
        <TableOfContents toc={blog.toc} />

        <article className="px-4 py-4 -mt-10 mx-auto prose prose-zinc prose-quoteless max-w-3xl">
          <Mdx code={blog.body.code} />
        </article>
      </div>
    </>
  );
}