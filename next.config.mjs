import { withContentlayer } from "next-contentlayer";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	experimental: {
		mdxRs: true,
	},
	// Add MDX configuration
	webpack: (config, { defaultLoaders }) => {
		config.module.rules.push({
			test: /\.mdx?$/,
			use: [
				defaultLoaders.babel,
				{
					loader: '@mdx-js/loader',
					options: {
						remarkPlugins: [remarkMath],
						rehypePlugins: [rehypeKatex],
					},
				},
			],
		});
		return config;
	},
};

export default withContentlayer(nextConfig);
