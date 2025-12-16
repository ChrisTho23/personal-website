import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { allBlogs } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header"; 
import "./mdx.css";
import { TableOfContents } from "@/app/components/toc";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allBlogs
    .filter((b) => b.published)
    .map((b) => ({
      slug: b.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params?.slug;
  const blog = allBlogs.find((blog) => blog.slug === slug);

  if (!blog) {
    return {};
  }

  const baseUrl = 'https://christophethomassin.com';
  const imageUrl = blog.picture ? `${baseUrl}${blog.picture}` : `${baseUrl}/ct.jpg`;

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: `Blog: ${blog.title}`,
      description: blog.description,
      images: [
        {
          url: imageUrl,
          width: 1200,  
          height: 627, 
          alt: blog.title,
        }
      ],
      url: `https://christophethomassin.com/blog/${blog.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Blog: ${blog.title}`,
      description: blog.description,
      images: [
        {
          url: imageUrl,
          width: 1200,  
          height: 627,
          alt: blog.title,
        }
      ],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const blog = allBlogs.find((blog) => blog.slug === slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header blog={blog} /> 
      
      {/* Content area with sticky TOC */}
      <div className="relative z-0 flex justify-center">
        {/* Sticky TOC on the left - hidden on mobile, starts below header */}
        <aside className="hidden xl:block w-72 shrink-0 pt-8">
          <div className="sticky top-8 z-40 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <TableOfContents toc={blog.toc} />
          </div>
        </aside>

        {/* Main content */}
        <article className="px-4 py-12 prose prose-zinc prose-quoteless max-w-3xl w-full">
          <Mdx code={blog.body.code} />
        </article>

        {/* Spacer to balance the layout */}
        <div className="hidden xl:block w-72 shrink-0" />
      </div>
    </div>
  );
}
