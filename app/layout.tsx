import "../global.css";
import 'katex/dist/katex.min.css';
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { Analytics } from "./components/analytics";
import ChatBot from './components/chatbot';

export const metadata: Metadata = {
  title: {
    default: "christophethomassin.com",
    template: "%s | christophethomassin.com",
  },
  description: "Christophe Thomassin's personal website",
  openGraph: {
    title: "christophethomassin.com",
    description:
       "Christophe Thomassin's personal website",
    url: "https://christophethomassin.com",
    siteName: "christophethomassin.com",
    images: [
      {
        url: "https://christophethomassin.com/ct.jpg",
        width: 1920,
        height: 1920,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "ChristopheThomassin",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/ct.jpg",
  },
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={[inter.variable, calSans.variable].join(" ")}>
      <head>
        <Analytics />
      </head>
      <body
        className={`bg-black ${process.env.NODE_ENV === "development" ? "debug-screens" : undefined
          }`}
      >
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
