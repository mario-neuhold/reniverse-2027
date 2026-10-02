"use client";

import Image from "next/image";
import { Modal } from "@/components/Modal";
import { ALBUMS, ARTISTS, DIMENSION_LABELS, type Dimension, type Galaxy, type Video, albumsOf, videoForTrack, videoThumbnail } from "@/lib/data";

type Props = { galaxy: Galaxy; dimension: Dimension; onClose: () => void; onPlay: (video: Video) => void; onTag: (dimension: Dimension, name: string) => void };

const unique = (values: string[]) => [...new Set(values)];
const chip = "min-h-10 rounded-full bg-white/10 px-3 text-sm hover:bg-white/25";

export function GalaxyModal({ galaxy, dimension, onClose, onPlay, onTag }: Props) {
  const videos = galaxy.videos;
  const years = videos.map((v) => v.year);
  const span = Math.min(...years) === Math.max(...years) ? `${years[0]}` : `${Math.min(...years)}–${Math.max(...years)}`;
  const artists = unique(videos.map((v) => v.collective));
  const genres = unique(videos.flatMap((v) => v.genres));
  const artist = dimension === "collective" ? ARTISTS[galaxy.name] : undefined;
  const album = dimension === "album" ? ALBUMS[galaxy.name] : undefined;

  const subtitle =
    dimension === "album"
      ? `${album?.type ?? "Album"} · ${album?.artist ?? artists.join(", ")} · ${album?.date.slice(0, 4) ?? span}`
      : dimension === "collective"
        ? `${artist?.members ? artist.members.join(" · ") : "Artist"} · ${videos.length} videos`
        : `${DIMENSION_LABELS[dimension]} · ${videos.length} videos · ${span}`;

  return (
    <Modal title={galaxy.name} subtitle={subtitle} onClose={onClose}>
      {artist && (
        <section className="space-y-3 px-4 pb-4 text-sm">
          <p className="text-white/80">{artist.bio}</p>
          <ul className="flex flex-wrap gap-2">
            {artist.socials.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-full bg-white/10 px-4 hover:bg-white/25">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          {albumsOf(galaxy.name).length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {albumsOf(galaxy.name).map(([name, a]) => (
                <li key={name}>
                  <button onClick={() => onTag("album", name)} className={chip}>
                    {name} · {a.date.slice(0, 4)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      {album && (
        <section className="space-y-3 px-4 pb-4 text-sm">
          {album.note && <p className="text-white/80">{album.note}</p>}
          <ul className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <li key={g}>
                <button onClick={() => onTag("genre", g)} className={chip}>
                  {g}
                </button>
              </li>
            ))}
          </ul>
          <ol className="divide-y divide-white/10">
            {album.tracks.map((track) => {
              const video = videoForTrack(galaxy.name, track);
              const row = (
                <>
                  <span className="w-6 text-right text-white/40">{track.n}</span>
                  {video ? (
                    <Image src={videoThumbnail(video)} alt="" width={96} height={54} className="aspect-video w-16 min-w-16 rounded object-cover" />
                  ) : (
                    <span className="aspect-video w-16 rounded bg-white/5" />
                  )}
                  <span className={`min-w-0 flex-1 truncate ${video ? "" : "text-white/50"}`}>{track.title}</span>
                  <span className="text-xs text-white/50">
                    {Math.floor(track.seconds / 60)}:{String(track.seconds % 60).padStart(2, "0")}
                  </span>
                </>
              );
              return (
                <li key={track.n}>
                  {video ? (
                    <button onClick={() => onPlay(video)} className="flex min-h-12 w-full items-center gap-3 py-1 text-left hover:bg-white/10">
                      {row}
                    </button>
                  ) : (
                    <div className="flex min-h-12 items-center gap-3 py-1">{row}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}
      {!album && (
        <section className="px-4 pb-4">
          {!artist && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {artists.map((a) => (
                <li key={a}>
                  <button onClick={() => onTag("collective", a)} className={chip}>
                    {a}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {videos.map((video) => (
              <li key={video.id}>
                <button onClick={() => onPlay(video)} className="w-full rounded-lg text-left hover:bg-white/10">
                  <Image src={videoThumbnail(video)} alt="" width={320} height={180} className="aspect-video w-full rounded-lg object-cover" />
                  <span className="mt-1 block px-1 text-sm">{video.title}</span>
                  <span className="block px-1 pb-1 text-xs text-white/50">
                    {video.year}
                    {video.album ? ` · ${video.album}` : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Modal>
  );
}
