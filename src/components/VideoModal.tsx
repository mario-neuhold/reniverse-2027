"use client";

import { Fragment } from "react";
import { Modal } from "@/components/Modal";
import { DIMENSION_LABELS, DIMENSIONS, type Dimension, type Video, seriesParts, tagsFor } from "@/lib/data";

type Props = {
  video: Video;
  currentGalaxy: string;
  onClose: () => void;
  onSelect: (video: Video) => void;
  onTag: (dimension: Dimension, name: string) => void;
};

const partButton = "min-h-10 rounded-full bg-white/10 px-4 hover:bg-white/25 disabled:opacity-30";

export function VideoModal({ video, currentGalaxy, onClose, onSelect, onTag }: Props) {
  const parts = seriesParts(video);
  const index = parts.findIndex((p) => p.id === video.id);
  return (
    <Modal title={video.title} subtitle={`${video.collective} · ${video.year}${video.album ? ` · ${video.album}` : ""}`} onClose={onClose}>
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      {parts.length > 1 && (
        <nav className="flex items-center justify-between gap-2 px-4 py-3 text-sm">
          <button disabled={index <= 0} onClick={() => onSelect(parts[index - 1])} className={partButton}>
            ‹ Part {index}
          </button>
          <span className="text-center text-xs text-white/60">
            {video.series} · Part {index + 1} of {parts.length}
          </span>
          <button disabled={index >= parts.length - 1} onClick={() => onSelect(parts[index + 1])} className={partButton}>
            Part {index + 2} ›
          </button>
        </nav>
      )}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 px-4 pb-4 pt-2 text-sm">
        {DIMENSIONS.filter((dimension) => tagsFor(video, dimension).length > 0).map((dimension) => (
          <Fragment key={dimension}>
            <dt className="pt-2.5 text-xs text-white/50">{DIMENSION_LABELS[dimension]}</dt>
            <dd className="flex flex-wrap gap-2">
              {tagsFor(video, dimension).map((name) => (
                <button
                  key={name}
                  onClick={() => onTag(dimension, name)}
                  className={`min-h-10 rounded-full px-3 ${`${dimension}:${name}` === currentGalaxy ? "bg-white text-black" : "bg-white/10 hover:bg-white/25"}`}
                >
                  {name}
                </button>
              ))}
            </dd>
          </Fragment>
        ))}
      </dl>
    </Modal>
  );
}
