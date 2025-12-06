import { notFound } from "next/navigation";
import { allResearch } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allResearch
    .filter((r) => r.published)
    .map((r) => ({
      slug: r.slug,
    }));
}

export default async function ResearchPage({ params }: Props) {
  const slug = params?.slug;
  const paper = allResearch.find((paper) => paper.slug === slug);

  if (!paper) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      {/* Background with overlay */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{ backgroundImage: `url('${paper.image || '/blog-background.jpg'}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-50/95 to-zinc-50" />
      </div>

      <div className="relative z-10">
        <Header paper={paper} />

        <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-5xl">
          {/* Content callout box for better readability */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 md:p-12 lg:p-16 shadow-2xl border border-white/40">
            <Mdx code={paper.body.code} />
          </div>
        </article>
      </div>
    </div>
  );
}

