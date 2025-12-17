import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import { getGithubReadmeDescription, getGithubReadmeContent } from "@/util/github";
import { ReadmeContent } from "@/app/components/readme-content";
import "./mdx.css";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  // Check if MDX body is empty (only whitespace)
  const hasLocalContent = project.body.raw.trim().length > 0;

  // Use frontmatter description if available, otherwise fetch from README
  let description = project.description;
  let readmeContent: string | null = null;

  if (project.repository) {
    // Fetch README content if no local MDX content
    if (!hasLocalContent) {
      readmeContent = await getGithubReadmeContent(project.repository);
    }
    // Fetch description from README if not in frontmatter
    if (!description) {
      const readmeDescription = await getGithubReadmeDescription(project.repository);
      description = readmeDescription ?? "No description available.";
    }
  }
  description = description ?? "No description available.";

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header project={{ ...project, description: description }} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless max-w-3xl">
        {hasLocalContent ? (
          <Mdx code={project.body.code} />
        ) : readmeContent ? (
          <>
            <p className="text-sm text-zinc-400 italic mb-8 pb-4 border-b border-zinc-200">
              This content is automatically generated from the project's README on GitHub.
            </p>
            <ReadmeContent content={readmeContent} repository={project.repository!} />
          </>
        ) : (
          <p className="text-zinc-500">No content available.</p>
        )}
      </article>
    </div>
  );
}
