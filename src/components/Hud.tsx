"use client";

import type { Focus } from "@/components/Reniverse";
import { DIMENSION_LABELS, DIMENSIONS, type Dimension, type Galaxy } from "@/lib/data";

type Props = {
  dimension: Dimension;
  galaxies: Galaxy[];
  focus: Focus;
  onDimension: (d: Dimension) => void;
  onOverview: () => void;
  onGalaxy: (g: Galaxy) => void;
  onStep: (dir: 1 | -1) => void;
};

const control = "pointer-events-auto h-11 rounded-xl border border-white/20 bg-black/60 px-3 text-sm text-white backdrop-blur-sm";

export function Hud({ dimension, galaxies, focus, onDimension, onOverview, onGalaxy, onStep }: Props) {
  const current = focus.kind === "overview" ? "" : focus.galaxy.key;
  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-3 p-4 pt-[max(1rem,env(safe-area-inset-top))] text-white">
        <button onClick={onOverview} className="pointer-events-auto text-xl font-bold tracking-wide">
          Reniverse
        </button>
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
