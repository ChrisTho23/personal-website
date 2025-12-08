"use client";

export default function FigRef({ id }: { id: number }) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const element = document.getElementById(`fig-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    
    return (
        <a 
            href={`#fig-${id}`}
            onClick={handleClick}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        >
            Figure {id}
        </a>
    );
}

