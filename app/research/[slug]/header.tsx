"use client";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Props = {
	paper: {
		title: string;
		date?: string;
		venue: string;
		authors?: string[];
		paperUrl?: string;
		image?: string;
	};
};

export const Header: React.FC<Props> = ({ paper }) => {
	const ref = useRef<HTMLElement>(null);
	const [isIntersecting, setIntersecting] = useState(true);

	const links: { label: string; href: string }[] = [];
	if (paper.paperUrl) {
		links.push({
			label: "Paper",
			href: paper.paperUrl,
		});
	}

	useEffect(() => {
		if (!ref.current) return;
		const observer = new IntersectionObserver(([entry]) =>
			setIntersecting(entry.isIntersecting),
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, []);

	return (
		<header
			ref={ref}
			className="relative isolate overflow-hidden bg-gradient-to-tl from-zinc-900 via-blue-950/10 to-zinc-900"
		>
			{/* Background Image with Overlay */}
			<div className="absolute inset-0 z-0">
				<div 
					className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
					style={{ backgroundImage: `url('${paper.image || '/blog-background.jpg'}')` }}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-zinc-900/70 via-zinc-900/80 to-zinc-900/90" />
			</div>

			<div
				className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
					isIntersecting
						? "bg-zinc-900/0 border-transparent"
						: "bg-white/10  border-zinc-200 lg:border-transparent"
				}`}
			>
				<div className="container flex items-center justify-start p-6 mx-auto">
					<Link
						href="/research"
						className={`duration-200 hover:font-medium ${
							isIntersecting
								? " text-zinc-400 hover:text-zinc-100"
								: "text-zinc-600 hover:text-zinc-900"
						} `}
					>
						<ArrowLeft className="w-6 h-6 " />
					</Link>
				</div>
			</div>
			<div className="container mx-auto relative isolate overflow-hidden py-16 sm:py-20 z-10">
				<div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
					<div className="mx-auto max-w-5xl w-full">
						{/* Title with enhanced readability */}
						<div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-10 lg:p-12 border border-white/20 shadow-2xl">
							<h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl font-display drop-shadow-lg">
								{paper.title}
							</h1>
							<p className="mt-4 text-base leading-7 text-zinc-100 font-medium">
								{paper.venue}
							</p>
							{paper.date && (
								<p className="mt-2 text-sm text-zinc-200">
									{Intl.DateTimeFormat(undefined, {
										dateStyle: "long",
									}).format(new Date(paper.date))}
								</p>
							)}
							{paper.authors && paper.authors.length > 0 && (
								<p className="mt-3 text-sm text-zinc-100">
									{paper.authors.join(", ")}
								</p>
							)}
							
							{/* Paper link button inside the box */}
							{links.length > 0 && (
								<div className="mt-6 flex justify-center gap-4">
									{links.map((link) => (
										<Link
											target="_blank"
											key={link.label}
											href={link.href}
											className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
										>
											{link.label} <ExternalLink className="w-4 h-4" />
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

