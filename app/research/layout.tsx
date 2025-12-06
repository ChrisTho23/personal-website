export default function ResearchLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="relative min-h-screen bg-gradient-to-tl from-zinc-900 via-blue-950/10 to-zinc-900 ">
			{children}
		</div>
	);
}

