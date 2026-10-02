export type Video = {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail?: string;
  collective: string;
  year: number;
  album?: string;
  series?: string;
  part?: number;
  genres: string[];
  moods: string[];
  topics: string[];
};

export const DIMENSIONS = ["collective", "genre", "mood", "topic", "album"] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = { collective: "Artist(s)", genre: "Genre", mood: "Mood", topic: "Topic", album: "Album" };

export type Galaxy = {
  key: string;
  name: string;
  position: [number, number, number];
  videos: Video[];
  orbits: Orbit[];
};

export type Orbit = {
  radius: number;
  tilt: number;
  speed: number;
  series?: string;
  planets: Planet[];
};

export type Planet = {
  video: Video;
  phase: number;
  size: number;
};

const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967295;
};

const PALETTE = ["#f97316", "#ec4899", "#8b5cf6", "#06b6d4", "#22c55e", "#eab308", "#ef4444", "#3b82f6"];

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

export function placeholderImage(label: string, kind: "cover" | "text") {
  const c1 = PALETTE[Math.floor(hash(label) * PALETTE.length)];
  const c2 = PALETTE[Math.floor(hash(label + "2") * PALETTE.length)];
  const [w, h] = kind === "cover" ? [256, 256] : [512, 128];
  const fontSize = Math.min(kind === "text" ? 56 : 30, (w * 1.6) / Math.max(label.length, 1));
  const fill = kind === "text" ? "rgba(10,5,30,0.85)" : "url(#g)";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="${w}" height="${h}" rx="${kind === "text" ? 24 : 8}" fill="${fill}" stroke="rgba(255,255,255,0.4)" stroke-width="${kind === "text" ? 3 : 0}"/>
<text x="${w / 2}" y="${h / 2}" dy="0.35em" font-family="sans-serif" font-size="${fontSize}" font-weight="bold" fill="#fff" text-anchor="middle">${esc(label)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const HI_REN = "s_nc1IVoMxc";

type Extra = Partial<Pick<Video, "album" | "series" | "part" | "youtubeId" | "thumbnail">>;

const v = (id: string, title: string, collective: string, year: number, genres: string[], moods: string[], topics: string[], extra: Extra = {}): Video => ({
  id,
  title,
  youtubeId: HI_REN,
  collective,
  year,
  genres,
  moods,
  topics,
  ...extra,
});

export const videoThumbnail = (video: Video) => video.thumbnail ?? `https://i.ytimg.com/vi/${video.youtubeId}/mqdefault.jpg`;

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const GALAXY_IMAGES: Record<string, string> = {
  Ren: ytThumb(HI_REN),
  Inpatient: ytThumb("a7cVWh3THbU"),
  Asylum: ytThumb("a7cVWh3THbU"),
  "Ren & The Skinner Brothers": ytThumb("u1qtyMPokZM"),
  "SICK SICK SOUL": ytThumb("u1qtyMPokZM"),
  "Vincent's Tale": ytThumb("MTn_bhTVr2U"),
  "The Big Push": placeholderImage("The Big Push", "cover"),
  "Ren & Chinchilla": placeholderImage("Ren & Chinchilla", "cover"),
  "Sick Boi": placeholderImage("Sick Boi", "cover"),
  "Freckled Angels": placeholderImage("Freckled Angels", "cover"),
};

export const galaxyImage = (name: string): string | undefined => GALAXY_IMAGES[name];

const SICK_BOI = { album: "Sick Boi" };
const TALES = "The Tale of Jenny & Screech";
const VINCENT = "Vincent's Tale";
const ASYLUM = { album: "Asylum" };
const SICK_SICK_SOUL = { album: "SICK SICK SOUL" };

export const VIDEOS: Video[] = [
  v("hi-ren", "Hi Ren", "Ren", 2022, ["Folk", "Hip Hop"], ["Dark", "Cathartic"], ["Mental Health", "Illness"], SICK_BOI),
  v("money-game-1", "Money Game Part 1", "Ren", 2021, ["Hip Hop"], ["Angry"], ["Society", "Money"], { ...SICK_BOI, series: "Money Game", part: 1 }),
  v("money-game-2", "Money Game Part 2", "Ren", 2021, ["Hip Hop"], ["Angry"], ["Society", "Money"], { ...SICK_BOI, series: "Money Game", part: 2 }),
  v("money-game-3", "Money Game Part 3", "Ren", 2023, ["Hip Hop"], ["Angry", "Dark"], ["Society", "Money"], { ...SICK_BOI, series: "Money Game", part: 3 }),
  v("sick-boi", "Sick Boi", "Ren", 2023, ["Hip Hop"], ["Dark"], ["Illness", "Mental Health"], SICK_BOI),
  v("suicide", "Suicide", "Ren", 2023, ["Hip Hop", "Folk"], ["Dark", "Cathartic"], ["Mental Health"], SICK_BOI),
  v("illest", "Illest of Our Time", "Ren", 2023, ["Hip Hop"], ["Cathartic"], ["Illness"], SICK_BOI),
  v("genesis", "Genesis", "Ren", 2023, ["Hip Hop"], ["Dark"], ["Religion", "Society"], SICK_BOI),
  v("animal-flow", "Animal Flow", "Ren", 2023, ["Hip Hop"], ["Playful"], ["Nature"], SICK_BOI),
  v("losing-it", "Losing It", "Ren", 2023, ["Hip Hop"], ["Playful"], ["Mental Health"], SICK_BOI),
  v("how-to-be-me", "How to Be Me", "Ren", 2023, ["Folk"], ["Melancholic"], ["Identity"], SICK_BOI),
  v("humble", "Humble", "Ren", 2023, ["Hip Hop"], ["Angry"], ["Society"], SICK_BOI),
  v("the-hunger", "The Hunger", "Ren", 2023, ["Hip Hop", "Rock"], ["Angry", "Dark"], ["Society"], SICK_BOI),
  v("violets-tale", "Violet's Tale", "Ren", 2022, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Society"], { album: TALES, series: TALES, part: 1 }),
  v("jennys-tale", "Jenny's Tale", "Ren", 2022, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Society"], { album: TALES, series: TALES, part: 2 }),
  v("screechs-tale", "Screech's Tale", "Ren", 2022, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Society"], { album: TALES, series: TALES, part: 3 }),
  v("seven-sins", "Seven Sins", "Ren", 2022, ["Hip Hop"], ["Dark"], ["Religion"], { album: "Freckled Angels" }),
  v("for-joe", "For Joe", "Ren", 2022, ["Folk"], ["Melancholic", "Cathartic"], ["Grief", "Friendship"], { album: "Freckled Angels" }),
  v("dear-christine", "Dear Christine", "Ren", 2023, ["Folk"], ["Melancholic"], ["Love"], { album: "Freckled Angels" }),
  v("kujo-beatbox", "Kujo Beatbox", "Ren", 2023, ["Hip Hop", "Beatbox"], ["Playful"], ["Music"]),
  v("ocean", "Ocean", "Ren", 2023, ["Folk"], ["Melancholic"], ["Love"], { album: "Freckled Angels" }),
  v("chalk-outlines", "Chalk Outlines", "Ren & Chinchilla", 2022, ["Folk", "Pop"], ["Melancholic", "Cathartic"], ["Love", "Grief"], { album: "Freckled Angels" }),
  v("blind-eyed", "Blind Eyed", "Ren & Chinchilla", 2022, ["Pop", "Hip Hop"], ["Dark"], ["Society"]),
  v("morning-light", "Morning Light", "Ren & Chinchilla", 2023, ["Folk", "Pop"], ["Hopeful"], ["Love"]),
  v("chunky", "Chunky", "The Big Push", 2019, ["Blues", "Busking"], ["Playful"], ["Music"], { album: "Live in Brighton" }),
  v("walk-away", "Walk Away", "The Big Push", 2019, ["Blues", "Busking"], ["Hopeful"], ["Love"], { album: "Live in Brighton" }),
  v("jamming-beach", "Jamming at the Beach", "The Big Push", 2020, ["Blues", "Busking"], ["Playful"], ["Music"], { album: "Live in Brighton" }),
  v("hey-ya", "Hey Ya (Cover)", "The Big Push", 2019, ["Pop", "Busking"], ["Playful"], ["Music"], { album: "Live in Brighton" }),
  v("fever", "Fever", "The Big Push", 2020, ["Blues"], ["Playful"], ["Love"], { album: "Live in Brighton" }),
  v("inpatient-madhouse", "Madhouse", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { ...ASYLUM, youtubeId: "7meWEiJEHeI" }),
  v("inpatient-instigator", "Instigator", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { ...ASYLUM, youtubeId: "uoIlEWKReqE" }),
  v("inpatient-neurodivergent", "Neurodivergent", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { ...ASYLUM, youtubeId: "7y4MUCCHFGY" }),
  v("inpatient-down-the-road", "Down The Road", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { ...ASYLUM, youtubeId: "6jPLEVrL4BI" }),
  v("inpatient-bad-company", "Bad Company", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { ...ASYLUM, youtubeId: "IImkLCKxAcs" }),
  v("inpatient-asylum", "Asylum", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { ...ASYLUM, youtubeId: "K9T6ASpDtVI" }),
  v("inpatient-me-and-my-monster", "Me and My Monster", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { ...ASYLUM, youtubeId: "ZU0yRhvoQj8" }),
  v("inpatient-smoking-gun", "Smoking Gun", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { ...ASYLUM, youtubeId: "O431N-XdZpQ" }),
  v("inpatient-tarantula", "Tarantula", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { ...ASYLUM, youtubeId: "0DTrjpIb4QI" }),
  v("inpatient-mason-jar", "Mason Jar", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { ...ASYLUM, youtubeId: "cGo0pVcUt5o" }),
  v("inpatient-silence", "Silence", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { ...ASYLUM, youtubeId: "A27AV1iHl_Q" }),
  v("inpatient-dr-meyers", "Dr Meyers", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { ...ASYLUM, youtubeId: "GKTthHxp9_A" }),
  v("inpatient-caskets", "Caskets", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { ...ASYLUM, youtubeId: "Hd19DLlHA7w" }),
  v("inpatient-end-of-the-world", "End of The World", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { ...ASYLUM, youtubeId: "O7ICrxgpmlI" }),
  v("inpatient-lunatic-lullaby", "Lunatic Lullaby", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { ...ASYLUM, youtubeId: "ExIP3rlANp0" }),
  v("inpatient-documentary", "ASYLUM | The Documentary", "Inpatient", 2026, ["Documentary"], ["Hopeful"], ["Music", "Mental Health"], { ...ASYLUM, youtubeId: "JadrrdwzO1U" }),
  v("skinner-so-the-story-goes", "So The Story Goes...", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Playful"], ["Love"], { ...SICK_SICK_SOUL, youtubeId: "u1qtyMPokZM" }),
  v("skinner-ctrl-alt-delete", "Ctrl Alt Delete", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Cathartic"], ["Money"], { ...SICK_SICK_SOUL, youtubeId: "X--PXyB1Zw0" }),
  v("skinner-truth-or-dare", "Truth Or Dare", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Melancholic"], ["Identity"], { ...SICK_SICK_SOUL, youtubeId: "FmaBhsRfhIw" }),
  v("skinner-dream-life", "Dream Life", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Hopeful"], ["Mental Health"], { ...SICK_SICK_SOUL, youtubeId: "0HhRNbZ0wRY" }),
  v("skinner-twos-on-a-cigarette", "Twos On A Cigarette", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Dark"], ["Society"], { ...SICK_SICK_SOUL, youtubeId: "1WCfWxgEY8E" }),
  v("skinner-pink-heineken", "Pink Heineken", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Angry"], ["Illness"], { ...SICK_SICK_SOUL, youtubeId: "Ra8gSw7Djvo" }),
  v("vincent-sunflowers-prologue", "Sunflowers (Prologue)", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: VINCENT, series: VINCENT, part: 1, youtubeId: "vZ1MnVHARME" }),
  v("vincent-self-portrait", "Self Portrait", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: VINCENT, series: VINCENT, part: 2, youtubeId: "d-myXdYvu3w" }),
  v("vincent-the-bedroom", "The Bedroom", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: VINCENT, series: VINCENT, part: 3, youtubeId: "Xu8Xm4gpDP8" }),
  v("vincent-the-first-night", "The First Night", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: VINCENT, series: VINCENT, part: 4, youtubeId: "-1r0bxN-Ycw" }),
  v("vincent-the-second-night", "The Second Night", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: VINCENT, series: VINCENT, part: 5, youtubeId: "vM6zjlxmrGE" }),
  v("vincent-the-third-night", "The Third Night", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: VINCENT, series: VINCENT, part: 6, youtubeId: "QJzZI0-8als" }),
  v("vincent-starry-night", "Starry Night", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: VINCENT, series: VINCENT, part: 7, youtubeId: "MTn_bhTVr2U" }),
];

export const seriesParts = (video: Video) =>
  video.series ? VIDEOS.filter((v) => v.series === video.series).sort((a, b) => (a.part ?? 0) - (b.part ?? 0)) : [];

export const tagsFor = (video: Video, dim: Dimension): string[] => {
  switch (dim) {
    case "collective":
      return [video.collective];
    case "genre":
      return video.genres;
    case "mood":
      return video.moods;
    case "topic":
      return video.topics;
    case "album":
      return video.album ? [video.album] : ["Singles"];
  }
};

const ORBIT_START = 5;
const ORBIT_STEP = 1.8;
const GALAXY_GAP = 12;

function buildOrbits(videos: Video[]): Orbit[] {
  const slots: Video[][] = [];
  const bySeries = new Map<string, Video[]>();
  for (const video of videos) {
    const group = video.series ? bySeries.get(video.series) : undefined;
    if (group) {
      group.push(video);
      continue;
    }
    const slot = [video];
    if (video.series) bySeries.set(video.series, slot);
    slots.push(slot);
  }
  return slots.map((group, j) => {
    group.sort((a, b) => (a.part ?? 0) - (b.part ?? 0));
    const base = hash(group[0].id) * Math.PI * 2;
    return {
      radius: ORBIT_START + j * ORBIT_STEP,
      tilt: (hash(group[0].id + "t") - 0.5) * 0.5,
      speed: 0.25 / Math.sqrt(1 + j),
      series: group.length > 1 ? group[0].series : undefined,
      planets: group.map((video, k) => ({
        video,
        phase: base + (k * Math.PI * 2) / group.length,
        size: 1 + hash(video.id + "s") * 0.5,
      })),
    };
  });
}

export function buildGalaxies(dim: Dimension): Galaxy[] {
  const groups = new Map<string, Video[]>();
  for (const video of VIDEOS) {
    for (const tag of tagsFor(video, dim)) {
      groups.set(tag, [...(groups.get(tag) ?? []), video]);
    }
  }
  const names = [...groups.keys()].sort((a, b) => groups.get(b)!.length - groups.get(a)!.length);
  const orbitsByName = new Map(names.map((name) => [name, buildOrbits(groups.get(name)!)]));
  const radii = names.map((name) => orbitRadius(orbitsByName.get(name)!));
  const n = names.length;
  const neighbourSpan = Math.max(...radii.map((r, i) => r + radii[(i + 1) % n] + GALAXY_GAP));
  const ringRadius = n === 1 ? 0 : neighbourSpan / (2 * Math.sin(Math.PI / n));
  return names.map((name, i) => {
    const angle = Math.PI / 2 + (i / n) * Math.PI * 2;
    return {
      key: `${dim}:${name}`,
      name,
      position: [Math.cos(angle) * ringRadius, (hash(name) - 0.5) * 20, Math.sin(angle) * ringRadius],
      videos: groups.get(name)!,
      orbits: orbitsByName.get(name)!,
    };
  });
}

const orbitRadius = (orbits: Orbit[]) => orbits[orbits.length - 1].radius + 4;

export const galaxyRadius = (galaxy: Galaxy) => orbitRadius(galaxy.orbits);

export function overviewExtent(galaxies: Galaxy[]) {
  return Math.max(...galaxies.map((g) => Math.hypot(g.position[0], g.position[2]) + galaxyRadius(g)));
}
