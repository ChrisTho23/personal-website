import Link from "next/link";
import React from "react";
import { allResearch } from "contentlayer/generated";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Paper } from "./paper";

export default async function ResearchPage() {
  const sortedResearch = allResearch
    .filter((r) => r.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    );

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-20 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Research
          </h2>
          <p className="mt-4 text-zinc-400">
            Find below an overview of research papers I have worked on. By clicking on
            the paper cards, you can read more about each paper and access the full publication.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-600" />

        {sortedResearch.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-2 lg:grid-cols-3">
            {sortedResearch.map((paper) => (
              <Card key={paper.slug}>
                <Paper paper={paper} />
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-xl text-zinc-400">
              Stay tuned! Research publications coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

