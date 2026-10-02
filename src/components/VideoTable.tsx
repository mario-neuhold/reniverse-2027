"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useMemo, useState, useSyncExternalStore } from "react";
import { VideoModal } from "@/components/VideoModal";
import { DIMENSION_LABELS, type Dimension, type Video, VIDEOS, matchesQuery, tagsFor, videoThumbnail } from "@/lib/data";

type Column = { key: string; label: string; value: (v: Video) => string | number; render?: (v: Video) => ReactNode; hidden?: boolean };

const COLUMNS: Column[] = [
  { key: "thumb", label: "", value: () => "", render: (v) => <Image src={videoThumbnail(v)} alt="" width={96} height={54} className="aspect-video w-16 rounded object-cover" /> },
  { key: "title", label: "Title", value: (v) => v.title, render: (v) => <span className="font-medium">{v.title}</span> },
  { key: "type", label: "Type", value: (v) => v.type },
  { key: "version", label: "Version", value: (v) => v.version ?? "", hidden: true },
  { key: "collective", label: "Artist(s)", value: (v) => v.collective },
  { key: "album", label: "Album", value: (v) => v.album ?? "" },
  { key: "year", label: "Year", value: (v) => v.year },
  { key: "genres", label: "Genres", value: (v) => v.genres.join(", ") },
  { key: "moods", label: "Moods", value: (v) => v.moods.join(", "), hidden: true },
  { key: "topics", label: "Topics", value: (v) => v.topics.join(", "), hidden: true },
  { key: "series", label: "Series", value: (v) => (v.series ? `${v.series} ${v.part}` : ""), hidden: true },
  {
    key: "youtube",
    label: "YouTube",
    value: (v) => v.youtubeId,
    hidden: true,
    render: (v) => (
      <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-sky-300 hover:underline">
        {v.youtubeId} ↗
      </a>
    ),
  },
];

const FACETS: Dimension[] = ["collective", "type", "album", "genre", "mood", "topic"];
const STORAGE_KEY = "reniverse.table.columns";
const control = "h-10 rounded-lg border border-white/20 bg-black/40 px-3 text-sm text-white";

const DEFAULT_COLUMNS = new Set(COLUMNS.filter((c) => !c.hidden).map((c) => c.key));
const listeners = new Set<() => void>();
const columnStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  read: () => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  },
  write: (keys: Set<string>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
    } catch {}
    listeners.forEach((listener) => listener());
  },
};

export function VideoTable() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Partial<Record<Dimension | "year", string>>>({});
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: "year", dir: -1 });
  const savedColumns = useSyncExternalStore(columnStore.subscribe, columnStore.read, () => "");
  const visible = useMemo(() => (savedColumns ? new Set<string>(JSON.parse(savedColumns)) : DEFAULT_COLUMNS), [savedColumns]);
  const [playing, setPlaying] = useState<Video | null>(null);

  const facetOptions = useMemo(() => {
    const options: Record<string, string[]> = { year: [...new Set(VIDEOS.map((v) => String(v.year)))].sort().reverse() };
    for (const d of FACETS) options[d] = [...new Set(VIDEOS.flatMap((v) => tagsFor(v, d)))].sort();
    return options;
  }, []);

  const rows = useMemo(() => {
    const column = COLUMNS.find((c) => c.key === sort.key);
    return VIDEOS.filter(
      (v) =>
        matchesQuery(v, query) &&
        (!filters.year || String(v.year) === filters.year) &&
        FACETS.every((d) => !filters[d] || tagsFor(v, d).includes(filters[d]!)),
    ).sort((a, b) => {
      const x = column?.value(a) ?? "";
      const y = column?.value(b) ?? "";
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir || a.title.localeCompare(b.title);
    });
  }, [query, filters, sort]);

  const toggleColumn = (key: string) => {
    const next = new Set(visible);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    columnStore.write(next);
  };

  const setFilter = (key: Dimension | "year", value: string) => setFilters((f) => ({ ...f, [key]: value || undefined }));
  const activeFilters = Object.entries(filters).filter(([, v]) => v);
  const columns = COLUMNS.filter((c) => visible.has(c.key));

  return (
    <main className="mx-auto max-w-7xl p-4 pb-16">
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Reniverse
        </Link>
        <Link href="/" className={`${control} flex items-center`}>
          ← Universe
        </Link>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" aria-label="Search" className={`${control} min-w-48 flex-1`} />
        <details className="relative">
          <summary className={`${control} flex cursor-pointer list-none items-center`}>Columns ▾</summary>
          <div className="absolute right-0 z-10 mt-1 flex flex-col gap-1 rounded-lg border border-white/20 bg-[#120b2e] p-3 text-sm shadow-2xl">
            {COLUMNS.filter((c) => c.label).map((c) => (
              <label key={c.key} className="flex min-h-8 cursor-pointer items-center gap-2 whitespace-nowrap">
                <input type="checkbox" checked={visible.has(c.key)} onChange={() => toggleColumn(c.key)} />
                {c.label}
              </label>
            ))}
          </div>
        </details>
      </header>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {[...FACETS, "year" as const].map((key) => (
          <select key={key} aria-label={key === "year" ? "Year" : DIMENSION_LABELS[key]} value={filters[key] ?? ""} onChange={(e) => setFilter(key, e.target.value)} className={control}>
            <option value="">{key === "year" ? "Year" : DIMENSION_LABELS[key]}: all</option>
            {facetOptions[key].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ))}
        {(activeFilters.length > 0 || query) && (
          <button
            onClick={() => {
              setFilters({});
              setQuery("");
            }}
            className={`${control} hover:bg-white/10`}
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-sm text-white/60">
          {rows.length} of {VIDEOS.length} videos
        </span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#0a0620] text-left text-xs uppercase tracking-wide text-white/60">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" aria-sort={sort.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className="px-3 py-2">
                  {c.label ? (
                    <button onClick={() => setSort((s) => ({ key: c.key, dir: s.key === c.key ? ((-s.dir) as 1 | -1) : 1 }))} className="flex items-center gap-1 whitespace-nowrap hover:text-white">
                      {c.label}
                      <span className="text-white/40">{sort.key === c.key ? (sort.dir === 1 ? "▲" : "▼") : ""}</span>
                    </button>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((v) => (
              <tr
                key={v.id}
                tabIndex={0}
                onClick={() => setPlaying(v)}
                onKeyDown={(e) => e.key === "Enter" && setPlaying(v)}
                className="cursor-pointer border-t border-white/5 odd:bg-white/[0.03] hover:bg-white/10 focus:bg-white/10 focus:outline-none"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-2 align-middle">
                    {c.render ? c.render(v) : c.value(v)}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-white/50">
                  No videos match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {playing && (
        <VideoModal
          video={playing}
          currentGalaxy={activeFilters.length ? `${activeFilters[0][0]}:${activeFilters[0][1]}` : ""}
          onClose={() => setPlaying(null)}
          onSelect={setPlaying}
          onTag={(dimension, name) => {
            setFilters({ [dimension]: name });
            setPlaying(null);
          }}
        />
      )}
    </main>
  );
}
