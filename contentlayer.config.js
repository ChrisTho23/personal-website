import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import remarkToc from 'remark-toc';
import remarkMath from 'remark-math';
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeKatex from 'rehype-katex';
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  path: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
  toc: {
    type: "json",
    resolve: (doc) => {
      const headings = [];
      const regex = /^(#{1,3})\s+(.*)$/gm;
      let match;

      while ((match = regex.exec(doc.body.raw)) !== null) {
        const [, level, title] = match;
        headings.push({ level: level.length, title });
      }

      return headings;
    },
  },
};

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "./projects/**/*.mdx",
  contentType: "mdx",

  fields: {
    published: {
      type: "boolean",
    },
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
    },
    url: {
      type: "string",
    },
    repository: {
      type: "string",
    },
  },
  computedFields,
}));

export const Blog = defineDocumentType(() => ({
  name: "Blog",
  filePathPattern: "./blog/**/*.mdx",
  contentType: "mdx",

  fields: {
    published: {
      type: "boolean",
    },
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
    },
    picture: { 
      type: 'string',
    }
  },
  computedFields,
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields,
}));

export const Research = defineDocumentType(() => ({
  name: "Research",
  filePathPattern: "./research/**/*.mdx",
  contentType: "mdx",

  fields: {
    published: {
      type: "boolean",
    },
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
    },
    venue: {
      type: "string",
      required: true,
    },
    authors: {
      type: "list",
      of: { type: "string" },
    },
    paperUrl: {
      type: "string",
    },
    image: {
      type: "string",
    },
  },
  computedFields,
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Page, Project, Blog, Research],
  mdx: {
    remarkPlugins: [remarkGfm, remarkToc, remarkMath],
    rehypePlugins: [
      rehypeKatex,
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
