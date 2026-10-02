"use client";

import { Fragment, useEffect, useRef } from "react";
import { DIMENSIONS, type Dimension, type Video, seriesParts, tagsFor } from "@/lib/data";

type Props = {
  video: Video;
  currentGalaxy: string;
  onClose: () => void;
  onSelect: (video: Video) => void;
  onTag: (dimension: Dimension, name: string) => void;
};

export function VideoModal({ video, currentGalaxy, onClose, onSelect, onTag }: Props) {
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
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 px-4 pb-4 pt-1 text-xs">
        {DIMENSIONS.map((dimension) => (
          <Fragment key={dimension}>
            <dt className="pt-0.5 capitalize text-white/50">{dimension}</dt>
            <dd className="flex flex-wrap gap-1">
              {tagsFor(video, dimension).map((name) => (
                <button
                  key={name}
                  onClick={() => onTag(dimension, name)}
                  className={`rounded-full px-2 py-0.5 ${`${dimension}:${name}` === currentGalaxy ? "bg-white text-black" : "bg-white/10 hover:bg-white/25"}`}
                >
                  {name}
                </button>
              ))}
            </dd>
          </Fragment>
        ))}
      </dl>
    </dialog>
  );
}
