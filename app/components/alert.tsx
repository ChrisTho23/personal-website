"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const Alert: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 0); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (pathname !== '/' || (searchParams && searchParams.toString() !== '')) {
      setVisible(false);
    }
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div className="fixed top-8 left-8 bg-gradient-to-tl from-zinc-200/55 via-zinc-200 to-zinc-200/55 text-black p-4 rounded-lg shadow-lg flex items-center justify-between space-x-4 animate-fade-in">
      <Link href="/blog/may">
        <span className="text-sm cursor-pointer">🎉 We have launched a new blog post! Check it out!</span>
      </Link>
      <button
        onClick={() => setVisible(false)}
        className="text-black text-xl focus:outline-none"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;