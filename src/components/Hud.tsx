"use client";

import Image from "next/image";
import Link from "next/link";
import type { Focus } from "@/components/Reniverse";
import { Search } from "@/components/Search";
import { DIMENSION_LABELS, DIMENSIONS, type Dimension, type Galaxy, type Video, galaxyImage, placeholderImage } from "@/lib/data";

type Props = {
  dimension: Dimension;
  galaxies: Galaxy[];
  focus: Focus;
  onDimension: (d: Dimension) => void;
  onOverview: () => void;
  onGalaxy: (g: Galaxy) => void;
  onVideo: (v: Video) => void;
  onStep: (dir: 1 | -1) => void;
  onDetails: () => void;
};

export const control = "pointer-events-auto h-11 rounded-xl border border-white/20 bg-black/60 px-3 text-sm text-white backdrop-blur-sm";

export function Hud({ dimension, galaxies, focus, onDimension, onOverview, onGalaxy, onVideo, onStep, onDetails }: Props) {
  const current = focus.kind === "overview" ? "" : focus.galaxy.key;
  return (
    <>
      {focus.kind !== "overview" && <GalaxyCard galaxy={focus.galaxy} dimension={dimension} onDetails={onDetails} />}
      <header className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] text-white">
        <div className="flex items-center gap-3">
          <button onClick={onOverview} className="pointer-events-auto text-xl font-bold tracking-wide">
            Reniverse
          </button>
          <Link href="/table" className={`${control} flex items-center`}>
            Table
          </Link>
          <label className="ml-auto flex items-center gap-2 text-xs text-white/60">
            Group by
            <select aria-label="Dimension" value={dimension} onChange={(e) => onDimension(e.target.value as Dimension)} className={control}>
              {DIMENSIONS.map((d) => (
                <option key={d} value={d}>
                  {DIMENSION_LABELS[d]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Search galaxies={galaxies} onVideo={onVideo} onGalaxy={onGalaxy} className={control} />
      </header>
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <p className="hidden text-xs text-white/50 sm:block">Drag to orbit · scroll or pinch to zoom · tap a sun to focus, again for details · tap a video to play · tap empty space for overview</p>
        <div className="flex w-full max-w-md items-center gap-2">
          <button onClick={() => onStep(-1)} aria-label="Previous galaxy" className={`${control} w-11 shrink-0 text-lg`}>
            ‹
          </button>
          <select
            aria-label="Galaxy"
            value={current}
            onChange={(e) => {
              const g = galaxies.find((g) => g.key === e.target.value);
              if (g) onGalaxy(g);
              else onOverview();
            }}
            className={`${control} min-w-0 flex-1`}
          >
            <option value="">Overview</option>
            {galaxies.map((g) => (
              <option key={g.key} value={g.key}>
                {g.name} ({g.videos.length})
              </option>
            ))}
          </select>
          <button onClick={() => onStep(1)} aria-label="Next galaxy" className={`${control} w-11 shrink-0 text-lg`}>
            ›
          </button>
        </div>
      </footer>
    </>
  );
}

function GalaxyCard({ galaxy, dimension, onDetails }: { galaxy: Galaxy; dimension: Dimension; onDetails: () => void }) {
  const years = galaxy.videos.map((v) => v.year);
  const from = Math.min(...years);
  const to = Math.max(...years);
  return (
    <aside className="pointer-events-auto absolute inset-x-4 bottom-20 flex items-center gap-3 rounded-2xl border border-white/20 bg-[#120b2e]/90 p-3 text-white shadow-2xl shadow-black/60 backdrop-blur-sm sm:inset-x-auto sm:bottom-auto sm:left-4 sm:top-1/2 sm:w-72 sm:-translate-y-1/2 sm:flex-col sm:items-stretch sm:p-4">
      <Image src={galaxyImage(galaxy.name) ?? placeholderImage(galaxy.name, "cover")} alt="" width={96} height={96} unoptimized className="h-14 w-14 shrink-0 rounded-xl object-cover sm:h-auto sm:w-full sm:aspect-video" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-white/50">{DIMENSION_LABELS[dimension]}</p>
        <h2 className="truncate text-lg font-semibold">{galaxy.name}</h2>
        <p className="text-xs text-white/60">
          {galaxy.videos.length} videos · {from === to ? from : `${from}–${to}`}
        </p>
      </div>
      <button onClick={onDetails} className="h-11 shrink-0 rounded-xl bg-white px-4 text-sm font-medium text-black hover:bg-white/90 sm:w-full">
        Details
      </button>
    </aside>
  );
}
