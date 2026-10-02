"use client";

import { Fragment } from "react";
import { Modal } from "@/components/Modal";
import { DIMENSION_LABELS, DIMENSIONS, type Dimension, type Video, relatedTo, seriesParts, tagsFor, versionsOf, videoById } from "@/lib/data";

type Props = {
  video: Video;
  currentGalaxy: string;
  onClose: () => void;
  onSelect: (video: Video) => void;
  onTag: (dimension: Dimension, name: string) => void;
};

const partButton = "min-h-10 rounded-xl border border-white/25 bg-black/40 px-4 hover:bg-white/15 disabled:opacity-30";

export function VideoModal({ video, currentGalaxy, onClose, onSelect, onTag }: Props) {
  const parts = seriesParts(video);
  const index = parts.findIndex((p) => p.id === video.id);
  const versions = versionsOf(video);
  const about = video.about ? videoById(video.about) : undefined;
  const related = relatedTo(video);
  return (
    <Modal title={video.title} subtitle={`${video.collective} · ${video.year}${video.album ? ` · ${video.album}` : ""}${video.version ? ` · ${video.version}` : ""}`} onClose={onClose}>
      <iframe
        className="aspect-video w-full"
        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
        title={video.title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      {versions.length > 1 && (
        <div className="flex flex-wrap items-center gap-3 px-4 pt-3 text-sm">
          <span className="text-xs uppercase tracking-wide text-white/50">Switch version</span>
          <div className="inline-flex overflow-hidden rounded-xl border border-white/25">
            {versions.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelect(v)}
                aria-pressed={v.id === video.id}
                className={`min-h-10 border-l border-white/25 px-3 first:border-l-0 ${v.id === video.id ? "bg-white text-black" : "bg-black/40 hover:bg-white/15"}`}
              >
                {v.version ?? "Original"}
              </button>
            ))}
          </div>
        </div>
      )}
      {(about || related.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 px-4 pt-3 text-sm">
          <span className="text-xs uppercase tracking-wide text-white/50">{about ? "About" : "Related"}</span>
          {about && (
            <button onClick={() => onSelect(about)} className={partButton}>
              ▶ {about.title}
            </button>
          )}
          {related.map((r) => (
            <button key={r.id} onClick={() => onSelect(r)} className={partButton}>
              {r.type}: {r.title}
            </button>
          ))}
        </div>
      )}
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
      <p className="mt-3 border-t border-white/10 px-4 pt-3 text-xs uppercase tracking-wide text-white/50">Explore galaxies</p>
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
