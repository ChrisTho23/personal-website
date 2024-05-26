"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Particles from "./components/particles";

const navigation = [
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

// Custom hook to check if this is the first visit
function useFirstVisit() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    const firstVisit = localStorage.getItem("firstVisit");
    if (!firstVisit) {
      setIsFirstVisit(true);
      localStorage.setItem("firstVisit", "true");
    }
  }, []);

  return isFirstVisit;
}

export default function Home() {
  const isFirstVisit = useFirstVisit();

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
      <nav className={`my-16 ${isFirstVisit ? "animate-fade-in" : ""}`}>
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-400 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div
        className={`hidden w-screen h-px md:block bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 ${
          isFirstVisit ? "animate-glow animate-fade-left" : ""
        }`}
      />
      <Particles
        className={`absolute inset-0 -z-10 ${isFirstVisit ? "animate-fade-in" : ""}`}
        quantity={100}
      />
      <h1
        className={`z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text p-4 ${
          isFirstVisit ? "animate-title" : ""
        }`}
      >
        Christophe <br /> Thomassin
      </h1>

      <div
        className={`hidden w-screen h-px md:block bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 ${
          isFirstVisit ? "animate-glow animate-fade-right" : ""
        }`}
      />
      <div className={`my-16 text-center ${isFirstVisit ? "animate-fade-in" : ""}`}>
        <h2 className="text-sm text-zinc-400 ">
          Hi there, this is my website. Feel free to explore!
        </h2>
      </div>
    </div>
  );
}