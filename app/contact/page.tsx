"use client";
import { Github, Mail, Linkedin } from "lucide-react";
import Link from "next/link";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";

const socials = [
	{
		icon: <Mail size={20} />,
		href: "mailto:christophe.thomassin23@gmail.com",
		label: "Email",
		handle: "christophe.thomassin23@gmail.com",
	},
	{
		icon: <Github size={20} />,
		href: "https://github.com/ChrisTho23",
		label: "Github",
		handle: "ChrisTho23",
	},
	{
		icon: <Linkedin size={20} />,
		href: "https://www.linkedin.com/in/christophe-thomassin/",
		label: "Linkedin",
		handle: "Christophe Thomassin",
	},
];

function needSplit() {
    // Determine if any handle needs to be split
    return socials.some(s => s.handle.includes('@') || s.handle.includes(' '));
}

function splitHandle(handle: string) {
    if (!needSplit()) {
        // If no handle needs splitting, display as single line
        return [handle];
    }

    const atIndex = handle.indexOf('@');
    const spaceIndex = handle.indexOf(' ');

    if (atIndex !== -1) {
        // Split at the '@' keeping it with the second part
        return [handle.slice(0, atIndex + 1), handle.slice(atIndex + 1)];
    } else if (spaceIndex !== -1) {
        // Split at first space
        return [handle.slice(0, spaceIndex), handle.slice(spaceIndex + 1)];
    } else {
        // Ensure two lines even if no split character
        return [handle, '\u00A0'];
    }
}

export default function Example() {
	return (
		<div className=" bg-gradient-to-tl from-zinc-900/0 via-zinc-900 to-zinc-900/0">
			<Navigation />
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0 sm:grid-cols-3 lg:gap-16">
					{socials.map((s) => (
						<Card>
							<Link
								href={s.href}
								target="_blank"
								className="p-4 relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24  lg:pb-48  md:p-16"
							>
								<span
									className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
									aria-hidden="true"
								/>
								<span className="relative z-10 flex items-center justify-center w-12 h-12 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange">
									{s.icon}
								</span>{" "}
								<div className="z-10 flex flex-col items-center">	
									{splitHandle(s.handle).map((part, i) => (
										<span key={i} className="lg:text-xl font-medium duration-150 xl:text-3xl text-zinc-200 group-hover:text-white font-display">
											{part}
										</span>	
									))}
									<span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
										{s.label}
									</span>
								</div>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
