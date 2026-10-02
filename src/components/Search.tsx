"use client";

import Image from "next/image";
import { useState } from "react";
import { type Galaxy, type Video, VIDEOS, matchesQuery, videoThumbnail } from "@/lib/data";

type Props = { galaxies: Galaxy[]; onVideo: (video: Video) => void; onGalaxy: (galaxy: Galaxy) => void; className?: string };

export function Search({ galaxies, onVideo, onGalaxy, className = "" }: Props) {
  const [query, setQuery] = useState("");
  const term = query.trim();
  const galaxyHits = term ? galaxies.filter((g) => g.name.toLowerCase().includes(term.toLowerCase())).slice(0, 3) : [];
  const videoHits = term ? VIDEOS.filter((v) => matchesQuery(v, term)).slice(0, 8) : [];
  const pick = (action: () => void) => {
    setQuery("");
    action();
  };
  return (
    <div className="pointer-events-auto relative w-full max-w-md">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && galaxyHits[0]) pick(() => onGalaxy(galaxyHits[0]));
          else if (e.key === "Enter" && videoHits[0]) pick(() => onVideo(videoHits[0]));
          else if (e.key === "Escape") setQuery("");
        }}
        placeholder="Search videos, artists, albums, tags"
        aria-label="Search"
        className={`${className} w-full`}
      />
      {term && (
        <ul className="absolute inset-x-0 top-full z-10 mt-1 max-h-80 overflow-y-auto rounded-xl border border-white/20 bg-[#120b2e] py-1 text-sm shadow-2xl shadow-black/80">
          {galaxyHits.map((g) => (
            <li key={g.key}>
              <button onClick={() => pick(() => onGalaxy(g))} className="flex min-h-10 w-full items-center gap-2 px-3 text-left hover:bg-white/10">
                <span className="rounded bg-white/10 px-1.5 text-xs text-white/60">Galaxy</span>
                <span className="truncate">{g.name}</span>
                <span className="text-white/40">({g.videos.length})</span>
              </button>
            </li>
          ))}
          {videoHits.map((v) => (
            <li key={v.id}>
              <button onClick={() => pick(() => onVideo(v))} className="flex min-h-10 w-full items-center gap-3 px-3 py-1 text-left hover:bg-white/10">
                <Image src={videoThumbnail(v)} alt="" width={64} height={36} className="aspect-video w-12 shrink-0 rounded object-cover" />
                <span className="min-w-0 flex-1 truncate">
                  {v.title}
                  {v.version && <span className="text-white/50"> · {v.version}</span>}
                </span>
                <span className="shrink-0 text-xs text-white/50">
                  {v.collective} · {v.year}
                </span>
              </button>
            </li>
          ))}
          {!galaxyHits.length && !videoHits.length && <li className="px-3 py-2 text-white/50">No matches</li>}
        </ul>
      )}
    </div>
  );
}
