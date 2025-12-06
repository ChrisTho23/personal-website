"use client";
import { Github, Mail, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import Image from "next/image";

const socials = [
	{
		icon: <Mail size={16} />,
		href: "mailto:christophe.thomassin23@gmail.com",
		label: "Email",
		handle: "Email",
	},
	{
		icon: <Github size={16} />,
		href: "https://github.com/ChrisTho23",
		label: "Github",
		handle: "Github",
	},
	{
		icon: <Linkedin size={16} />,
		href: "https://www.linkedin.com/in/christophe-thomassin/",
		label: "LinkedIn",
		handle: "LinkedIn",
	},
	{
		icon: <Twitter size={16} />,
		href: "https://x.com/chrisoutho",
		label: "Twitter",
		handle: "Twitter",
	},
];

// About me sections with alternating layouts
const aboutSections = [
	{
		id: "intro",
		title: "Hi, I'm Christophe",
		content: `I am interested in a variety of things but I am obsessed with doing what I do well. Currently, I am learning about the fascinating world of genetics. By applying machine learning methods to genomic data I hope to help better understand complex diseases and make genetic predisposition actionable. Outside of work, I enjoy doing sports and cooking. I currently live in San Francisco, CA.`,
		image: "/aboutme/profile.png", // Update with your actual image path
		imageAlt: "Me on a hot air balloon in Mexico",
		imagePosition: "right"
	},
	{
		id: "journey",
		title: "My Journey",
		content: `I was always fascinated by technology and driven by a deep curiosity to understand how the world works. Growing up in Germany, I began studying electrical engineering, convinced that the electrification of the automotive industry would define my career. Then in 2021, I discovered machine learning, which led me to pursue a master’s degree in data science in France. After internships working on agents and LLM evaluations, I joined the Ioannidis Lab at Stanford, where I now conduct research at the intersection of AI and genetics. My journey has been everything else but linear. But in analogy to the idea behind Kintsugi pottery (see image on the left), I come to believe that path that might seem like deadends at a time, turn out to be the most valuable experiences that make the journey worthy.`,
		image: "/aboutme/kintsugi.png", // Update with your actual image path
		imageAlt: "Kintsugi pottery, a symbol for that things that seem broken at a time may become the most beautiful part in the end.",
		imagePosition: "left"
	},
	{
		id: "research",
		title: "Research Interests",
		content: `I want to help fulfill the promise of precision medicine by making genetic predispositions truly actionable. Concretely, my research interests revolve around closing the still-missing heritability gap to more accurately quantify genetic risk, understanding the biology of complex diseases to map variants to traits, and uncovering genotype–environment interactions that can inform effective prevention strategies.`,
		image: "/aboutme/digital_dna.png",
		imageAlt: "Research interests",
		imagePosition: "right"
	},
	{
		id: "current-work",
		title: "My Work",
		content: `Previously, I developed GenomEn, a genotype-to-phenotype prediction framework that helps reduce the still-missing heritability gap by modeling gene–gene interactions. I also co-developed PM1, a multimodal biomedical foundation model integrating genotype, phenotype, and imaging data. I collaborated in snputils, a fast Python toolbox for genotype, ancestry, and phenotype analyses at biobank scale. Alongside these projects, I play around with mechanistic interpretability techniques. Currently, my work focuses on capturing gene–environment interactions at biobank scale.`,
		image: "/aboutme/interact.png", // Update with your actual image path
		imageAlt: "Current projects",
		imagePosition: "left"
	},
	{
		id: "beyond",
		title: "Beyond Work",
		content: `When I am not on my laptop, you will find me doing sports or in the kitchen. I grew up playing tennis and have since gotten into endurance sports. My goal for next year is completing an Ironman. As a (half) Frenchman, I love cooking and often spend my weekends experimenting with new recipes.`,
		image: "/aboutme/cycling.png",
		imageAlt: "Personal interests",
		imagePosition: "right"
	},
];

export default function AboutMe() {
	return (
		<div className="bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0 min-h-screen">
			<Navigation />
			
			{/* Hero Section with smaller contact cards */}
			<div className="container mx-auto px-4 pt-32 pb-16">
				<div className="text-center mb-12">
					<h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 font-display">
						About Me
					</h1>
					<p className="text-xl text-zinc-400 max-w-2xl mx-auto">
						AI, Genetics, Sport, and Food in no particular order
					</p>
				</div>

				{/* Smaller contact cards */}
				<div className="grid grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto mb-16">
					{socials.map((s) => (
						<Card key={s.label}>
							<Link
								href={s.href}
								target="_blank"
								className="p-4 relative flex flex-col items-center gap-2 duration-700 group"
							>
								<span
									className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
									aria-hidden="true"
								/>
								<span className="relative z-10 flex items-center justify-center w-10 h-10 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
									{s.icon}
								</span>
								<div className="z-10 flex flex-col items-center">
									<span className="text-sm font-medium duration-150 text-zinc-200 group-hover:text-white font-display">
										{s.handle}
									</span>
								</div>
							</Link>
						</Card>
					))}
				</div>
			</div>

			{/* Alternating content sections */}
			<div className="container mx-auto px-8 md:px-16 lg:px-24 pb-32">
				{aboutSections.map((section, index) => (
					<div
						key={section.id}
						className={`flex flex-col ${
							section.imagePosition === "right" 
								? "md:flex-row" 
								: "md:flex-row-reverse"
						} gap-12 md:gap-16 lg:gap-20 items-center mb-32 last:mb-0`}
					>
						{/* Text Content */}
						<div className="flex-1 space-y-6 px-4 md:px-0">
							<h2 className="text-4xl md:text-5xl font-bold text-zinc-100 font-display">
								{section.title}
							</h2>
							<p className="text-lg text-zinc-400 leading-relaxed">
								{section.content}
							</p>
						</div>

						{/* Image */}
						<div className="flex-1 relative">
							<div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl">
								<Image
									src={section.image}
									alt={section.imageAlt}
									fill
									className="object-cover hover:scale-105 transition-transform duration-700"
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Call to action */}
			<div className="container mx-auto px-4 pb-32">
				<div className="max-w-3xl mx-auto text-center space-y-6 p-12 rounded-lg border border-zinc-800 bg-zinc-900/50">
					<h2 className="text-3xl md:text-4xl font-bold text-zinc-100 font-display">
						Let's Connect
					</h2>
					<p className="text-lg text-zinc-400">
						Interested in collaborating, discussing research, or just want to chat? 
						Feel free to reach out through any of the channels above.
					</p>
				</div>
			</div>
		</div>
	);
}
