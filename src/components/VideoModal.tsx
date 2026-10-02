"use client";

import { useEffect, useRef } from "react";
import { type Video, seriesParts } from "@/lib/data";

export function VideoModal({ video, onClose, onSelect }: { video: Video; onClose: () => void; onSelect: (video: Video) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);

  const parts = seriesParts(video);
  const index = parts.findIndex((p) => p.id === video.id);
  const partButton = "rounded-full bg-white/10 px-3 py-1 hover:bg-white/25 disabled:opacity-30";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
      className="m-auto w-[min(96vw,960px)] rounded-xl bg-black p-0 text-white backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h2 className="font-semibold">{video.title}</h2>
          <p className="text-xs text-white/60">
            {video.collective} · {video.year}
            {video.album ? ` · ${video.album}` : ""}
          </p>
        </div>
        <button onClick={() => ref.current?.close()} aria-label="Close" className="rounded px-2 text-xl hover:bg-white/10">
          ×
        </button>
      </div>
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      {parts.length > 1 && (
        <nav className="flex items-center justify-between gap-2 px-4 py-3 text-xs">
          <button disabled={index <= 0} onClick={() => onSelect(parts[index - 1])} className={partButton}>
            ‹ Part {index}
          </button>
          <span className="text-center text-white/60">
            {video.series} · Part {index + 1} of {parts.length}
          </span>
          <button disabled={index >= parts.length - 1} onClick={() => onSelect(parts[index + 1])} className={partButton}>
            Part {index + 2} ›
          </button>
        </nav>
      )}
      <ul className="flex flex-wrap gap-1 px-4 pb-3 pt-1 text-xs">
        {[...video.genres, ...video.moods, ...video.topics].map((t) => (
          <li key={t} className="rounded-full bg-white/10 px-2 py-0.5">
            {t}
          </li>
        ))}
      </ul>
    </dialog>
  );
}
