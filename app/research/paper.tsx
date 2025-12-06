import type { Research } from "@/.contentlayer/generated";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Props = {
	paper: Research;
};

export const Paper: React.FC<Props> = ({ paper }) => {
	return (
		<Link href={`/research/${paper.slug}`}>
			<article className="p-4 md:p-8">
				{paper.image && (
					<div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
						<Image
							src={paper.image}
							alt={paper.title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
						/>
					</div>
				)}
				<div className="flex justify-between gap-2 items-center">
					<span className="text-xs duration-1000 text-zinc-200 group-hover:text-white group-hover:border-zinc-200 drop-shadow-orange">
						{paper.date ? (
							<time dateTime={new Date(paper.date).toISOString()}>
								{Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
									new Date(paper.date),
								)}
							</time>
						) : (
							<span>SOON</span>
						)}
					</span>
				</div>
				<div className="flex items-start justify-between gap-2 mt-2">
					<h2 className="z-20 text-xl font-medium duration-1000 lg:text-3xl text-zinc-200 group-hover:text-white font-display">
						{paper.title}
					</h2>
					{paper.paperUrl && (
						<ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 flex-shrink-0 mt-1" />
					)}
				</div>
				<p className="text-sm text-zinc-500 mt-2 font-medium">{paper.venue}</p>
				<p className="z-20 mt-4 text-sm duration-1000 text-zinc-400 group-hover:text-zinc-200">
					{paper.description}
				</p>
			</article>
		</Link>
	);
};

