"use client";
import { ArrowLeft, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  blog: {
    title: string;
    description: string;
    date?: string;
    picture?: string;
  };
};

export const Header: React.FC<Props> = ({ blog }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={ref}
      className="relative isolate overflow-hidden"
      style={{
        backgroundImage: `url(${blog.picture})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-white/10  border-zinc-200 lg:border-transparent"
        }`}
      >
        <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div className="flex justify-between gap-8">
            <Link
              target="_blank"
              href="https://www.linkedin.com/in/christophe-thomassin/"
            >
              <Linkedin
                className={`w-6 h-6 duration-200 hover:font-medium ${
                  isIntersecting
                    ? " text-zinc-400 hover:text-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900"
                } `}
              />
            </Link>
            <Link target="_blank" href="https://github.com/ChrisTho23">
              <Github
                className={`w-6 h-6 duration-200 hover:font-medium ${
                  isIntersecting
                    ? " text-zinc-400 hover:text-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900"
                } `}
              />
            </Link>
            <Link target="_blank" href="https://x.com/chrisoutho">
              <Twitter
                className={`w-6 h-6 duration-200 hover:font-medium ${
                  isIntersecting
                    ? " text-zinc-400 hover:text-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900"
                } `}
              />
            </Link>
          </div>

          <Link
            href="/blog"
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
      <div className="container mx-auto relative isolate overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-left flex flex-col items-start">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-10 lg:p-12 border border-white/20 shadow-2xl w-full">
            <div className="w-full flex justify-between items-start">
              <div className="max-w-2xl lg:max-w-none">
                <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl font-display drop-shadow-lg">
                  {blog.title}
                </h1>
              </div>
            </div>
            <div className="max-w-2xl lg:max-w-none mt-8">
              <p className="text-lg leading-8 text-black">
                {blog.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};