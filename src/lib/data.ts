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
  const [w, h] = kind === "cover" ? [256, 256] : [320, 80];
  const fontSize = Math.min(kind === "text" ? 36 : 30, (w * 1.6) / Math.max(label.length, 1));
  const fill = kind === "text" ? "rgba(10,5,30,0.85)" : "url(#g)";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
<rect width="${w}" height="${h}" rx="${kind === "text" ? 16 : 8}" fill="${fill}" stroke="rgba(255,255,255,0.4)" stroke-width="${kind === "text" ? 3 : 0}"/>
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
  "Sick Sick Soul (Vol.1)": ytThumb("u1qtyMPokZM"),
  "Vincent's Tale": ytThumb("MTn_bhTVr2U"),
  "The Big Push": placeholderImage("The Big Push", "cover"),
  "Ren & Chinchilla": placeholderImage("Ren & Chinchilla", "cover"),
  "Sick Boi": placeholderImage("Sick Boi", "cover"),
};

export const galaxyImage = (name: string): string | undefined => GALAXY_IMAGES[name];


export const VIDEOS: Video[] = [
  v("its-alright", "It's Alright", "Ren", 2016, ["Blues", "Busking"], ["Hopeful"], ["Love"], { album: "Freckled Angels", youtubeId: "hCsQDY8A6og" }),
  v("dominoes", "Dominoes", "Ren", 2019, ["Folk"], [], [], { album: "Freckled Angels", youtubeId: "bbbjWEnC3Gc" }),
  v("satellite-girl", "Satellite Girl", "Ren", 2015, ["Folk"], [], [], { album: "Freckled Angels", youtubeId: "y22m3KksPRw" }),
  v("1990s", "1990s", "Ren", 2017, ["Folk"], [], [], { album: "Freckled Angels", youtubeId: "J2H7wDR9eTU" }),
  v("crutch", "Crutch", "Ren", 2016, ["Folk"], [], [], { album: "Freckled Angels", youtubeId: "3gC2kq6E5Mo" }),
  v("freckled-angels", "Freckled Angels", "Ren", 2015, ["Folk"], [], [], { album: "Freckled Angels", youtubeId: "xRm7DV8jObg" }),
  v("jennys-tale", "Jenny's Tale", "Ren", 2019, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Society"], { album: "The Tale of Jenny & Screech", series: "The Tale of Jenny & Screech", part: 2, youtubeId: "ZT4PtvgakLU" }),
  v("screechs-tale", "Screech's Tale", "Ren", 2019, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Society"], { album: "The Tale of Jenny & Screech", series: "The Tale of Jenny & Screech", part: 3, youtubeId: "HVsrl8zDXnU" }),
  v("violets-tale", "Violet's Tale", "Ren", 2022, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Society"], { album: "The Tale of Jenny & Screech", series: "The Tale of Jenny & Screech", part: 1, youtubeId: "a4R9Vk5_CbU" }),
  v("seven-sins", "Seven Sins", "Ren", 2024, ["Hip Hop"], ["Dark"], ["Religion"], { album: "Sick Boi", youtubeId: "bXS2MF5XW60" }),
  v("sick-boi", "Sick Boi", "Ren", 2023, ["Hip Hop"], ["Dark"], ["Illness", "Mental Health"], { album: "Sick Boi", youtubeId: "3Q6uCrpzbPY" }),
  v("animal-flow", "Animal Flow", "Ren", 2023, ["Hip Hop"], ["Playful"], ["Nature"], { album: "Sick Boi", youtubeId: "F4mUnmFbVNg" }),
  v("money-game-part-3", "Money Game Part 3", "Ren", 2023, ["Hip Hop"], ["Angry", "Dark"], ["Society", "Money"], { album: "Sick Boi", series: "Money Game", part: 3, youtubeId: "nyWbun_PbTc" }),
  v("lost-all-faith", "Lost All Faith", "Ren", 2023, ["Hip Hop"], [], [], { album: "Sick Boi", youtubeId: "hVuTGHClU_A" }),
  v("genesis", "Genesis", "Ren", 2022, ["Hip Hop"], ["Dark"], ["Religion", "Society"], { album: "Sick Boi", youtubeId: "YzsTdLIcbzU" }),
  v("murderer", "Murderer", "Ren", 2023, ["Hip Hop"], ["Dark", "Angry"], ["Society"], { album: "Sick Boi", youtubeId: "hscHqw7CIFo" }),
  v("suicide", "Suicide", "Ren", 2023, ["Hip Hop", "Folk"], ["Dark", "Cathartic"], ["Mental Health"], { album: "Sick Boi", youtubeId: "n3JNtfi4Vb0" }),
  v("illest-of-our-time", "Illest of Our Time", "Ren", 2023, ["Hip Hop"], ["Cathartic"], ["Illness"], { album: "Sick Boi", youtubeId: "tB-JGSdBerE" }),
  v("love-music-part-4", "Love Music Part 4", "Ren", 2023, ["Hip Hop"], [], [], { album: "Sick Boi", series: "Love Music", part: 4, youtubeId: "INheMTgUsuI" }),
  v("uninvited", "Uninvited", "Ren", 2023, ["Hip Hop"], [], [], { album: "Sick Boi", youtubeId: "rXxVv1zxNeM" }),
  v("what-you-want", "What You Want", "Ren", 2022, ["Hip Hop"], [], [], { album: "Sick Boi", youtubeId: "jrjp4Du0rEc" }),
  v("the-hunger", "The Hunger", "Ren", 2022, ["Hip Hop", "Rock"], ["Angry", "Dark"], ["Society"], { album: "Sick Boi", youtubeId: "1T_fLytBFM4" }),
  v("down-on-the-beat", "Down on the Beat", "Ren", 2023, ["Hip Hop"], [], [], { album: "Sick Boi", youtubeId: "XjN7TZh-UY0" }),
  v("masochist", "Masochist", "Ren", 2023, ["Hip Hop"], [], [], { album: "Sick Boi", youtubeId: "OKST_i7Caxw" }),
  v("loco", "Loco", "Ren", 2024, ["Hip Hop"], [], [], { album: "Sick Boi", youtubeId: "AFl2tn7Ty2k" }),
  v("wicked-ways", "Wicked Ways", "Ren", 2023, ["Hip Hop"], [], [], { album: "Sick Boi", youtubeId: "P5xz57kmgHA" }),
  v("prologue-sunflowers", "Prologue - Sunflowers", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: "Vincent's Tale", series: "Vincent's Tale", part: 1, youtubeId: "vZ1MnVHARME" }),
  v("self-portrait", "Self Portrait", "Ren", 2025, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: "Vincent's Tale", series: "Vincent's Tale", part: 2, youtubeId: "d-myXdYvu3w" }),
  v("the-bedroom", "The Bedroom", "Ren", 2026, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: "Vincent's Tale", series: "Vincent's Tale", part: 3, youtubeId: "Xu8Xm4gpDP8" }),
  v("skinner-so-the-story-goes", "So the Story Goes...", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Playful"], ["Love"], { album: "Sick Sick Soul (Vol.1)", youtubeId: "u1qtyMPokZM" }),
  v("skinner-ctrl-alt-delete", "CTRL ALT DELETE", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Cathartic"], ["Money"], { album: "Sick Sick Soul (Vol.1)", youtubeId: "X--PXyB1Zw0" }),
  v("skinner-truth-or-dare", "Truth or Dare", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Melancholic"], ["Identity"], { album: "Sick Sick Soul (Vol.1)", youtubeId: "FmaBhsRfhIw" }),
  v("skinner-dream-life", "Dream Life", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Hopeful"], ["Mental Health"], { album: "Sick Sick Soul (Vol.1)", youtubeId: "0HhRNbZ0wRY" }),
  v("skinner-twos-on-a-cigarette", "Two's on a Cigarette", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Dark"], ["Society"], { album: "Sick Sick Soul (Vol.1)", youtubeId: "1WCfWxgEY8E" }),
  v("skinner-pink-heineken", "Pink Heineken", "Ren & The Skinner Brothers", 2025, ["Indie", "Rock"], ["Angry"], ["Illness"], { album: "Sick Sick Soul (Vol.1)", youtubeId: "Ra8gSw7Djvo" }),
  v("inpatient-madhouse", "Madhouse", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { album: "Asylum", youtubeId: "7meWEiJEHeI" }),
  v("inpatient-instigator", "Instigator", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { album: "Asylum", youtubeId: "uoIlEWKReqE" }),
  v("inpatient-neurodivergent", "Neurodivergent", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { album: "Asylum", youtubeId: "7y4MUCCHFGY" }),
  v("inpatient-down-the-road", "Down the Road", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { album: "Asylum", youtubeId: "6jPLEVrL4BI" }),
  v("inpatient-bad-company", "Bad Company", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { album: "Asylum", youtubeId: "IImkLCKxAcs" }),
  v("inpatient-asylum", "Asylum", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { album: "Asylum", youtubeId: "K9T6ASpDtVI" }),
  v("inpatient-me-and-my-monster", "Me and My Monster", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { album: "Asylum", youtubeId: "ZU0yRhvoQj8" }),
  v("inpatient-smoking-gun", "Smoking Gun", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { album: "Asylum", youtubeId: "O431N-XdZpQ" }),
  v("inpatient-tarantula", "Tarantula", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { album: "Asylum", youtubeId: "0DTrjpIb4QI" }),
  v("inpatient-mason-jar", "Mason Jar", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { album: "Asylum", youtubeId: "cGo0pVcUt5o" }),
  v("inpatient-silence", "Silence", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { album: "Asylum", youtubeId: "A27AV1iHl_Q" }),
  v("inpatient-dr-meyers", "Dr. Meyers", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { album: "Asylum", youtubeId: "GKTthHxp9_A" }),
  v("inpatient-caskets", "Caskets", "Inpatient", 2026, ["Hip Hop"], ["Dark"], ["Mental Health"], { album: "Asylum", youtubeId: "Hd19DLlHA7w" }),
  v("inpatient-end-of-the-world", "End of the World", "Inpatient", 2026, ["Hip Hop"], ["Angry"], ["Society"], { album: "Asylum", youtubeId: "O7ICrxgpmlI" }),
  v("inpatient-lunatic-lullaby", "Lunatic Lullaby", "Inpatient", 2026, ["Hip Hop"], ["Playful"], ["Illness"], { album: "Asylum", youtubeId: "ExIP3rlANp0" }),
  v("bp-praise-you", "Praise You", "The Big Push", 2019, ["Busking", "Pop"], ["Playful"], ["Music"], { album: "Busking Sessions", youtubeId: "5vbA514eVDc" }),
  v("bp-bongo-bongo", "Bongo Bongo", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "EQAUupOFarw" }),
  v("bp-english-man-in-new-york", "English man in New-York", "The Big Push", 2018, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "ZI9Q295iJl4" }),
  v("bp-its-alright-live", "It's Alright - Live", "The Big Push", 2019, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "5vqU2t29XN4" }),
  v("bp-what-kind-of-woman-is-this", "What kind of woman is this", "The Big Push", 2018, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "8Rpbg9FG1-o" }),
  v("bp-sympathy-for-the-devil", "Sympathy for the devil", "The Big Push", 2019, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "i6tGeUVCw3g" }),
  v("bp-wade-in-the-water", "Wade in the water", "The Big Push", 2019, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "DbL7Frf6nJI" }),
  v("bp-my-generation", "My generation", "The Big Push", 2019, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "OGJxccarvkE" }),
  v("bp-be-bop-a-lula", "Be bop a lula", "The Big Push", 2019, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "Ay2WBiKJfrY" }),
  v("bp-watch-out-live", "Watch Out - Live", "The Big Push", 2021, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "x0YPR4wX2rg" }),
  v("bp-war-pigs", "War Pigs", "The Big Push", 2021, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "azAD9KE9HKE" }),
  v("bp-i-shot-the-sheriff", "I shot the sheriff", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "Q_Qxpev7A4M" }),
  v("bp-guns-of-brixton", "Guns Of Brixton", "The Big Push", 2020, ["Busking", "Rock"], ["Angry"], ["Society"], { album: "Busking Sessions", youtubeId: "wC9KrhHBOw8" }),
  v("bp-johnny-b-goode", "Johnny B Goode", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "91hcRu5ixmE" }),
  v("bp-lonely-boy", "Lonely Boy", "The Big Push", 2019, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "nxVCK6XBZpY" }),
  v("bp-these-boots-are-made-for-walkin", "These boots are made for walkin'", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "ZlJ0wSzBWKw" }),
  v("bp-paint-it-black", "Paint it black", "The Big Push", 2021, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "9MkngQ2ojT4" }),
  v("bp-heroes", "Heroes", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "nTywwhxQ3Nk" }),
  v("bp-acustarus", "Acustarus", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "azs5cn5Orq8" }),
  v("bp-sweet-little-lady-acoustic", "Sweet Little Lady - Acoustic", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "7gARCb013cw" }),
  v("bp-swan-song", "Swan Song", "The Big Push", 2020, ["Busking", "Rock"], [], [], { album: "Busking Sessions", youtubeId: "2AFA4sF69mY" }),
  v("bp-watch-out", "Watch Out", "The Big Push", 2021, ["Blues", "Rock"], ["Playful"], ["Society"], { album: "Can Do Will Do", youtubeId: "P0GGFjsrhuU" }),
  v("bp-xbox-marijuana", "Xbox Marijuana", "The Big Push", 2021, ["Blues", "Rock"], [], [], { album: "Can Do Will Do", youtubeId: "SnysmGissKw" }),
  v("bp-mannequin", "Mannequin", "The Big Push", 2021, ["Blues", "Rock"], [], [], { album: "Can Do Will Do", youtubeId: "yu1jhwNrryY" }),
  v("bp-when-she-goes", "When She Goes", "The Big Push", 2021, ["Blues", "Rock"], [], [], { album: "Can Do Will Do", youtubeId: "0vfvViyyWXk" }),
  v("bp-all-my-heroes", "All My Heroes", "The Big Push", 2021, ["Blues", "Rock"], [], [], { album: "Can Do Will Do", youtubeId: "ESd5YihFvis" }),
  v("bp-precious", "Precious", "The Big Push", 2021, ["Blues", "Rock"], [], [], { album: "Can Do Will Do", youtubeId: "IlzN1hF_re8" }),
  v("cant-stop-me", "Can't Stop Me", "Ren", 2012, ["Folk"], [], [], { album: "Love Music", youtubeId: "lyWoZ-_CoMI" }),
  v("the-first-night", "The First Night", "Ren", 2026, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: "Vincent's Tale", series: "Vincent's Tale", part: 4, youtubeId: "-1r0bxN-Ycw" }),
  v("the-second-night", "The Second Night", "Ren", 2026, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: "Vincent's Tale", series: "Vincent's Tale", part: 5, youtubeId: "vM6zjlxmrGE" }),
  v("the-third-night", "The Third Night", "Ren", 2026, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: "Vincent's Tale", series: "Vincent's Tale", part: 6, youtubeId: "QJzZI0-8als" }),
  v("starry-night", "Starry Night", "Ren", 2026, ["Folk", "Spoken Word"], ["Melancholic", "Dark"], ["Storytelling", "Art", "Mental Health"], { album: "Vincent's Tale", series: "Vincent's Tale", part: 7, youtubeId: "MTn_bhTVr2U" }),
  v("hi-ren", "Hi Ren", "Ren", 2022, ["Folk", "Hip Hop"], ["Dark", "Cathartic"], ["Mental Health", "Illness"], { youtubeId: "s_nc1IVoMxc" }),
  v("money-game-part-1", "Money Game Part 1", "Ren", 2019, ["Hip Hop"], ["Angry"], ["Society", "Money"], { series: "Money Game", part: 1, youtubeId: "0ivQwwgW4OY" }),
  v("money-game-part-2", "Money Game Part 2", "Ren", 2022, ["Hip Hop"], ["Angry"], ["Society", "Money"], { series: "Money Game", part: 2, youtubeId: "DxNUwVuG6Lw" }),
  v("the-tale-of-jenny-screech", "The Tale of Jenny & Screech", "Ren", 2022, ["Hip Hop"], [], [], { youtubeId: "TYAnqQ--KX0" }),
  v("losing-it", "Losing It", "Ren", 2022, ["Hip Hop"], ["Playful"], ["Mental Health"], { youtubeId: "mLvAGjhDssc" }),
  v("humble", "Humble", "Ren", 2019, ["Hip Hop"], ["Angry"], ["Society"], { youtubeId: "PO9UC2Zt59c" }),
  v("kujo-beat-down", "Kujo Beat Down", "Ren", 2024, ["Hip Hop", "Beatbox"], ["Playful"], ["Music"], { youtubeId: "it_hPbqcYOA" }),
  v("mackay", "Mackay", "Ren", 2024, ["Hip Hop"], ["Angry"], ["Society"], { youtubeId: "TDrFh9RnpQ4" }),
  v("troubles", "Troubles", "Ren", 2024, ["Folk"], ["Melancholic"], ["Mental Health"], { youtubeId: "pt7Bpy27d1M" }),
  v("slaughter-house", "Slaughter House", "Ren", 2024, ["Hip Hop"], ["Dark"], ["Society"], { youtubeId: "_fTylzY3RsU" }),
  v("for-joe", "For Joe", "Ren", 2023, ["Folk"], ["Melancholic", "Cathartic"], ["Grief", "Friendship"], { youtubeId: "ebX5ZvrT6-o" }),
  v("money-ties", "Money Ties", "Ren", 2024, ["Hip Hop"], [], [], { youtubeId: "Uq3Z6D74dSA" }),
  v("power", "Power", "Ren", 2022, ["Hip Hop"], [], [], { youtubeId: "6_hnhVDtzTY" }),
  v("depression", "Depression", "Ren", 2018, ["Hip Hop"], [], [], { youtubeId: "VCZj2w0iXO8" }),
  v("insomnia", "Insomnia", "Ren", 2018, ["Hip Hop"], [], [], { youtubeId: "IBgp2OX7hYs" }),
  v("penitence", "Penitence", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "R-7UHDoKlMw" }),
  v("children-of-the-moon", "Children of the Moon", "Ren", 2018, ["Hip Hop"], [], [], { youtubeId: "6e4Abttm0Fs" }),
  v("everybody-drops", "Everybody Drops", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "xG6ckC1Q4eU" }),
  v("right-here-right-now", "Right Here, Right Now", "Ren", 2022, ["Hip Hop"], [], [], { youtubeId: "yVaJUdllr3c" }),
  v("wildfire", "Wildfire", "Ren", 2022, ["Hip Hop"], [], [], { youtubeId: "bEVfqR5PJE8" }),
  v("all-my-life", "All My Life", "Ren", 2022, ["Hip Hop"], [], [], { youtubeId: "mViaIY98gUA" }),
  v("bittersweet-symphony", "Bittersweet Symphony", "Ren", 2023, ["Hip Hop"], [], [], { youtubeId: "JwtEOp7pC1A" }),
  v("eden", "Eden", "Ren", 2023, ["Hip Hop"], [], [], { youtubeId: "NdSLsRKnafI" }),
  v("life-is-funny", "Life Is Funny", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "rV8U73JHs0Q" }),
  v("dear-god", "Dear God", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "uOiB2AYUdMQ" }),
  v("ocean", "Ocean", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "xoi7pI0zGPA" }),
  v("heretic", "Heretic", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "wukFdoXRZKM" }),
  v("ready-for-you", "Ready For You", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "PdPVzKTJWXI" }),
  v("crucify-your-culture", "Crucify Your Culture", "Ren", 2020, ["Hip Hop"], [], [], { youtubeId: "LfS41H29asw" }),
  v("fred-again-mash-up", "Fred Again Mash Up", "Ren", 2024, ["Hip Hop"], [], [], { youtubeId: "8ASggnoga9Q" }),
  v("halftime", "Halftime", "Ren", 2024, ["Hip Hop"], [], [], { youtubeId: "e3_KfTO7dfw" }),
  v("dumb-king-come", "Dumb King Come", "Ren", 2023, ["Hip Hop"], [], [], { youtubeId: "gcVUnFisx_Q" }),
  v("love-music-part-3", "Love Music Part 3", "Ren", 2020, ["Hip Hop"], [], [], { series: "Love Music", part: 3, youtubeId: "OjElKx6q2Wc" }),
  v("girls", "Girls!", "Ren", 2018, ["Hip Hop"], [], [], { youtubeId: "ZDRqITGHhMU" }),
  v("do-you-believe", "Do You Believe", "Ren", 2016, ["Hip Hop"], [], [], { youtubeId: "EGgowW6AOyw" }),
  v("hold-on", "Hold On", "Ren", 2016, ["Hip Hop"], [], [], { youtubeId: "n7jsWZmHhcM" }),
  v("jessica", "Jessica", "Ren", 2016, ["Hip Hop"], [], [], { youtubeId: "zU_GnJdT_Fk" }),
  v("chinchilla-chalk-outlines", "Chalk Outlines", "Ren & Chinchilla", 2021, ["Folk", "Pop"], ["Melancholic", "Cathartic"], ["Love", "Grief"], { youtubeId: "4Vn_N5IHHoc" }),
  v("chinchilla-how-to-be-me", "How to Be Me", "Ren & Chinchilla", 2019, ["Folk", "Pop"], ["Melancholic"], ["Identity"], { youtubeId: "3IhoPpHYXjo" }),
  v("sam-blind-eyed", "Blind Eyed", "Ren & Sam Tompkins", 2018, ["Pop", "Hip Hop"], ["Dark"], ["Society"], { youtubeId: "xjF_JTbBZjQ" }),
  v("sam-what-went-wrong", "What Went Wrong", "Ren & Sam Tompkins", 2020, ["Pop", "Folk"], ["Melancholic"], ["Love"], { series: "What Went Wrong", part: 1, youtubeId: "jmOdhbC6BZc" }),
  v("sam-what-went-wrong-ii", "What Went Wrong II", "Ren & Sam Tompkins", 2020, ["Pop", "Folk"], ["Melancholic", "Hopeful"], ["Love"], { series: "What Went Wrong", part: 2, youtubeId: "pqfGZ8IRCXk" }),
  v("bp-sweet-little-lady", "Sweet Little Lady", "The Big Push", 2020, ["Blues", "Busking"], ["Hopeful"], ["Love"], { youtubeId: "X9gOvRAZ1jM" }),
  v("bp-icarus", "Icarus", "The Big Push", 2020, ["Blues", "Rock"], ["Melancholic"], ["Identity"], { youtubeId: "Yo9fjMywmmk" }),
  v("bp-why-my-woman", "Why My Woman?", "The Big Push", 2020, ["Hip Hop"], [], [], { youtubeId: "7b2m5lBcJ64" }),
  v("bp-oh-my-woman", "Oh My Woman!", "The Big Push", 2020, ["Hip Hop"], [], [], { youtubeId: "bVvA7VOU0MI" }),
  v("bp-dignity", "Dignity", "The Big Push", 2020, ["Hip Hop"], [], [], { youtubeId: "3E37nzXX-4g" }),
  v("bp-heart-attack", "Heart Attack", "The Big Push", 2024, ["Hip Hop"], [], [], { youtubeId: "aBJmZ51VgNM" }),
  v("inpatient-asylum-the-documentary", "ASYLUM | The Documentary", "Inpatient", 2026, ["Documentary"], ["Hopeful"], ["Music", "Mental Health"], { youtubeId: "JadrrdwzO1U" }),
];

export type Artist = { mbid?: string; bio: string; members?: string[]; socials: { label: string; url: string }[] };

export type Track = { n: number; title: string; seconds: number };

export type Album = { mbid: string; artist: string; date: string; type: "Album" | "EP"; note?: string; tracks: Track[] };

export const ARTISTS: Record<string, Artist> = {
  Ren: {
    mbid: "81250ee6-a008-4007-8cfd-dddc22176cac",
    bio: "Ren Gill, born 1990 in Bangor, Wales. Singer, songwriter, producer, rapper and multi-instrumentalist. Busked in Brighton with The Big Push, went independent after years of chronic illness, and broke through with Hi Ren in 2022.",
    socials: [
      { label: "Website", url: "https://www.renmakesmusic.com" },
      { label: "YouTube", url: "https://www.youtube.com/channel/UCqq3VcwPGseErHUa0-xLInQ" },
      { label: "Spotify", url: "https://open.spotify.com/artist/0Repe2EiNjaFAFIukrroUM" },
      { label: "Apple Music", url: "https://music.apple.com/gb/artist/1410768470" },
      { label: "Bandcamp", url: "https://renmakesmusic.bandcamp.com/" },
      { label: "Instagram", url: "https://www.instagram.com/renmakesmusic/" },
      { label: "TikTok", url: "https://www.tiktok.com/@renmakesmusic" },
      { label: "Facebook", url: "https://www.facebook.com/renmakesmusic" },
      { label: "X", url: "https://twitter.com/renmakesmusic" },
    ],
  },
  Inpatient: {
    mbid: "5d88f23e-2cbc-44a5-926d-1bea7bba46c4",
    bio: "Hip hop group of Ren, Chris Webby and producer JP On Da Track. Their album Asylum came out in July 2026 with a video for every track.",
    members: ["Ren", "Chris Webby", "JP On Da Track"],
    socials: [
      { label: "Spotify", url: "https://open.spotify.com/artist/5Qqx3JIJnK5mtk7U4tC4Vb" },
      { label: "Instagram", url: "https://www.instagram.com/inpatient.world/" },
      { label: "TikTok", url: "https://www.tiktok.com/@inpatient.world" },
      { label: "YouTube (Chris Webby)", url: "https://www.youtube.com/@ForTheBurbs" },
      { label: "Website (Chris Webby)", url: "http://listentowebby.com/" },
    ],
  },
  "The Big Push": {
    mbid: "f683189d-aa34-4e77-9ee2-483c276aa910",
    bio: "Brighton busking band around Ren, Romain Axisa, Glenn Chambers and Gorran Kendall. Street sets on the seafront, filmed and uploaded, long before Ren's solo breakthrough.",
    members: ["Ren", "Romain Axisa", "Glenn Chambers", "Gorran Kendall"],
    socials: [
      { label: "Website", url: "https://www.thebigpushband.com/" },
      { label: "YouTube", url: "https://www.youtube.com/channel/UCLuR_dea3ed8KbIoyvHUB0w" },
      { label: "Spotify", url: "https://open.spotify.com/artist/4AOiNpcmfXTiWDB3uFszgn" },
      { label: "Instagram", url: "https://www.instagram.com/thebigpushband/" },
      { label: "Facebook", url: "https://www.facebook.com/thebigpushband" },
      { label: "X", url: "https://twitter.com/thebigpushband" },
    ],
  },
  "Ren & The Skinner Brothers": {
    mbid: "ae1b32a2-107d-4093-a00b-ac6acf838632",
    bio: "Collaboration with the London indie band The Skinner Brothers (Zachary Charles Skinner, Jack Leigh, Fredrick Lindal, Kian McCourt), released as the EP Sick Sick Soul (Vol.1).",
    members: ["Ren", "The Skinner Brothers"],
    socials: [
      { label: "Website (Skinner Brothers)", url: "https://www.theskinnerbrothers.com/" },
      { label: "YouTube (Skinner Brothers)", url: "https://www.youtube.com/channel/UCIp5TPlRAWLEIyA969K2V3A" },
      { label: "Spotify (Skinner Brothers)", url: "https://open.spotify.com/artist/4PY51S3HuOMhnZA0Sx8FRN" },
      { label: "Instagram (Skinner Brothers)", url: "https://www.instagram.com/theskinnerbrothers/" },
    ],
  },
  "Ren & Chinchilla": {
    mbid: "4407ef33-e8c2-4749-9a80-a9db9337e4c7",
    bio: "Duets with London singer CHINCHILLA, born 1996, best known together for Chalk Outlines.",
    members: ["Ren", "CHINCHILLA"],
    socials: [
      { label: "YouTube (Chinchilla)", url: "https://www.youtube.com/channel/UCO60azVR9BSu6szZKHx9WZg" },
      { label: "Spotify (Chinchilla)", url: "https://open.spotify.com/artist/7iNrvS80wnHDGVxw3qNRiI" },
      { label: "Instagram (Chinchilla)", url: "https://www.instagram.com/chinchilla_music/" },
      { label: "X (Chinchilla)", url: "https://twitter.com/chinchillamusic" },
    ],
  },
  "Ren & Sam Tompkins": {
    mbid: "0bd1d730-f49b-4661-bf8e-60f30af9f7f5",
    bio: "Collaboration with Brighton singer Sam Tompkins, born 1997. Blind Eyed and the What Went Wrong songs.",
    members: ["Ren", "Sam Tompkins"],
    socials: [
      { label: "Website (Sam Tompkins)", url: "https://www.samtompkins.com/" },
      { label: "YouTube (Sam Tompkins)", url: "https://www.youtube.com/channel/UCN-lWv8IwDNljiJA6oDCERA" },
      { label: "Spotify (Sam Tompkins)", url: "https://open.spotify.com/artist/04uu8U3I1h26Fp2NBkPTRZ" },
      { label: "Instagram (Sam Tompkins)", url: "https://www.instagram.com/samtompkinsuk/" },
    ],
  },
};

export const ALBUMS: Record<string, Album> = {
  "Freckled Angels": {
    mbid: "d6d00508-1b97-4f60-ae60-56f9ad9978da",
    artist: "Ren",
    date: "2016-01-02",
    type: "Album",
    tracks: [
      { n: 1, title: "Make My Way", seconds: 216 }, { n: 2, title: "It’s Alright", seconds: 214 }, { n: 3, title: "Dominoes", seconds: 227 }, { n: 4, title: "Satellite Girl", seconds: 209 }, { n: 5, title: "Love Music, Pt. 1", seconds: 217 }, { n: 6, title: "1990s", seconds: 196 }, { n: 7, title: "Pixie", seconds: 238 }, { n: 8, title: "Streetlights", seconds: 184 }, { n: 9, title: "Run Away", seconds: 200 }, { n: 10, title: "Pocket Full of Pain", seconds: 189 }, { n: 11, title: "Love Music, Pt. 2", seconds: 256 }, { n: 12, title: "Meaning", seconds: 91 }, { n: 13, title: "Bullet", seconds: 189 }, { n: 14, title: "Fire", seconds: 205 }, { n: 15, title: "Crutch", seconds: 218 }, { n: 16, title: "Freckled Angels", seconds: 258 },
    ],
  },
  "Love Music": {
    mbid: "e126aeb4-7485-477c-8a1e-a31204941d2b",
    artist: "Ren",
    date: "2015-03-19",
    type: "Album", note: "First record, acoustic and home-produced.",
    tracks: [
      { n: 1, title: "Love music (acoustic version)", seconds: 248 }, { n: 2, title: "Lost Boy", seconds: 229 }, { n: 3, title: "Living Room Poetry", seconds: 205 }, { n: 4, title: "Wild Place", seconds: 185 }, { n: 5, title: "The Four Elements", seconds: 80 }, { n: 6, title: "Come Closer", seconds: 181 }, { n: 7, title: "Hush Now", seconds: 190 }, { n: 8, title: "Knock Me Down", seconds: 179 }, { n: 9, title: "Jennys Tale", seconds: 121 }, { n: 10, title: "Run Away (acoustic version)", seconds: 158 }, { n: 11, title: "Can't Stop Me", seconds: 135 }, { n: 12, title: "Got to Run", seconds: 153 }, { n: 13, title: "Breakdown", seconds: 154 }, { n: 14, title: "New York City", seconds: 198 }, { n: 15, title: "She Makes The World", seconds: 195 }, { n: 16, title: "If I Leave Tonight", seconds: 222 }, { n: 17, title: "Rockstar", seconds: 206 }, { n: 18, title: "Falling", seconds: 169 }, { n: 19, title: "Okay In The Morning", seconds: 265 }, { n: 20, title: "Power Of Unity", seconds: 202 },
    ],
  },
  "The Tale of Jenny & Screech": {
    mbid: "8d72bfdb-5b2e-438f-a064-54f9c4eedae0",
    artist: "Ren",
    date: "2019-09-18",
    type: "EP", note: "Three-part story told from three perspectives.",
    tracks: [
      { n: 1, title: "Prologue", seconds: 34 }, { n: 2, title: "Jenny's Tale", seconds: 188 }, { n: 3, title: "Run Screech Run", seconds: 12 }, { n: 4, title: "Screech's Tale", seconds: 207 }, { n: 5, title: "Call for Backup", seconds: 17 }, { n: 6, title: "London City", seconds: 48 }, { n: 7, title: "Violet's Tale", seconds: 344 },
    ],
  },
  "Sick Boi": {
    mbid: "48ef3eb3-05a7-46ae-8979-1df069d27658",
    artist: "Ren",
    date: "2023-10-13",
    type: "Album", note: "Debut full-length, self-released.",
    tracks: [
      { n: 1, title: "Seven Sins", seconds: 276 }, { n: 2, title: "Sick Boi", seconds: 193 }, { n: 3, title: "Animal Flow", seconds: 175 }, { n: 4, title: "Money Game, Pt. 3", seconds: 394 }, { n: 5, title: "Lost All Faith", seconds: 229 }, { n: 6, title: "Genesis", seconds: 176 }, { n: 7, title: "Murderer", seconds: 211 }, { n: 8, title: "Suic_de", seconds: 250 }, { n: 9, title: "Illest of Our Time", seconds: 191 }, { n: 10, title: "Love Music, Pt. 4", seconds: 206 }, { n: 11, title: "Uninvited", seconds: 175 }, { n: 12, title: "What You Want", seconds: 196 }, { n: 13, title: "The Hunger", seconds: 147 }, { n: 14, title: "Down on the Beat", seconds: 234 }, { n: 15, title: "Masochist", seconds: 203 }, { n: 16, title: "Loco", seconds: 201 }, { n: 17, title: "Wicked Ways", seconds: 196 }, { n: 18, title: "Sick Boi, Pt. 2", seconds: 252 },
    ],
  },
  "Vincent's Tale": {
    mbid: "d3dc13b0-2c89-4721-a228-0ea9b97c587d",
    artist: "Ren",
    date: "2026-01-17",
    type: "EP", note: "Story cycle around Vincent van Gogh, followed by Richard's Tale.",
    tracks: [
      { n: 1, title: "Vincent's Tale - Prologue - Sunflowers", seconds: 200 }, { n: 2, title: "Vincent's Tale - Self Portrait", seconds: 336 }, { n: 3, title: "Vincent's Tale - The Bedroom", seconds: 258 }, { n: 4, title: "Richard's Tale - Locked Up", seconds: 86 }, { n: 5, title: "Richard's Tale - Set The Scene", seconds: 60 }, { n: 6, title: "Richard's Tale - The Five Stages of Grief", seconds: 85 }, { n: 7, title: "Richard's Tale - Acceptance", seconds: 91 },
    ],
  },
  "Sick Sick Soul (Vol.1)": {
    mbid: "142aa304-1d04-4d6e-a039-cd7a0155f5c5",
    artist: "Ren & The Skinner Brothers",
    date: "2025-11-13",
    type: "EP",
    tracks: [
      { n: 1, title: "So the Story Goes...", seconds: 231 }, { n: 2, title: "CTRL ALT DELETE", seconds: 236 }, { n: 3, title: "Truth or Dare", seconds: 187 }, { n: 4, title: "Dream Life", seconds: 241 }, { n: 5, title: "Two's on a Cigarette (feat. Sahaji)", seconds: 213 }, { n: 6, title: "Pink Heineken (feat. Megan Notcheva)", seconds: 215 },
    ],
  },
  "Asylum": {
    mbid: "f85dc0fe-4966-4360-aa15-9dbdf027f008",
    artist: "Inpatient",
    date: "2026-07-22",
    type: "Album", note: "Ren and Chris Webby as Inpatient, one video per track.",
    tracks: [
      { n: 1, title: "Madhouse", seconds: 213 }, { n: 2, title: "Instigator", seconds: 260 }, { n: 3, title: "Neurodivergent", seconds: 232 }, { n: 4, title: "Down the Road", seconds: 279 }, { n: 5, title: "Bad Company", seconds: 182 }, { n: 6, title: "Asylum", seconds: 301 }, { n: 7, title: "Me and My Monster", seconds: 196 }, { n: 8, title: "Smoking Gun", seconds: 212 }, { n: 9, title: "Tarantula", seconds: 226 }, { n: 10, title: "Mason Jar", seconds: 187 }, { n: 11, title: "Silence", seconds: 260 }, { n: 12, title: "Dr. Meyers", seconds: 340 }, { n: 13, title: "Caskets", seconds: 226 }, { n: 14, title: "End of the World", seconds: 216 }, { n: 15, title: "Lunatic Lullaby", seconds: 331 },
    ],
  },
  "Can Do Will Do": {
    mbid: "c3c846dc-149e-4c87-b4d2-b45c5c8db10f",
    artist: "The Big Push",
    date: "2021-06-30",
    type: "Album",
    tracks: [
      { n: 1, title: "Watch Out", seconds: 232 }, { n: 2, title: "Xbox Marijuana", seconds: 170 }, { n: 3, title: "Mannequin", seconds: 202 }, { n: 4, title: "When She Goes", seconds: 138 }, { n: 5, title: "All My Heroes", seconds: 304 }, { n: 6, title: "Precious", seconds: 204 },
    ],
  },
  "Busking Sessions": {
    mbid: "a826482d-b612-47f1-87e1-a59caa5fcdb8",
    artist: "The Big Push",
    date: "2022-11-01",
    type: "Album", note: "Covers from the Brighton seafront sets.",
    tracks: [
      { n: 1, title: "Praise You", seconds: 214 }, { n: 2, title: "Bongo Bongo", seconds: 226 }, { n: 3, title: "English man in New-York", seconds: 258 }, { n: 4, title: "It's Alright - Live", seconds: 254 }, { n: 5, title: "What kind of woman is this", seconds: 246 }, { n: 6, title: "Sympathy for the devil", seconds: 270 }, { n: 7, title: "Wade in the water", seconds: 369 }, { n: 8, title: "My generation", seconds: 277 }, { n: 9, title: "Be bop a lula", seconds: 228 }, { n: 10, title: "Watch Out - Live", seconds: 303 }, { n: 11, title: "War Pigs", seconds: 304 }, { n: 12, title: "I shot the sheriff", seconds: 344 }, { n: 13, title: "Guns Of Brixton", seconds: 216 }, { n: 14, title: "Johnny B Goode", seconds: 200 }, { n: 15, title: "Lonely Boy", seconds: 251 }, { n: 16, title: "These boots are made for walkin'", seconds: 202 }, { n: 17, title: "Paint it black", seconds: 240 }, { n: 18, title: "Heroes", seconds: 375 }, { n: 19, title: "Acustarus", seconds: 190 }, { n: 20, title: "Sweet Little Lady - Acoustic", seconds: 161 }, { n: 21, title: "Swan Song", seconds: 218 },
    ],
  },
};

const normTitle = (t: string) =>
  t
    .toLowerCase()
    .replace(/\(feat\..*?\)/g, "")
    .replace(/suic_de/g, "suicide")
    .replace(/\bpt\.\s*/g, "part ")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const videoForTrack = (album: string, track: Track) =>
  VIDEOS.find((v) => v.album === album && normTitle(v.title) === normTitle(track.title.replace(/^vincent.s tale - /i, "")));

export const albumsOf = (artist: string) =>
  Object.entries(ALBUMS)
    .filter(([, a]) => a.artist === artist)
    .sort(([, a], [, b]) => a.date.localeCompare(b.date));

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

const PLANET_SPACING = 4.5;

function buildOrbits(videos: Video[]): Orbit[] {
  const bySeries = new Map<string, Video[]>();
  const loose: Video[] = [];
  for (const video of videos) {
    if (!video.series) loose.push(video);
    else bySeries.set(video.series, [...(bySeries.get(video.series) ?? []), video]);
  }
  const slots: Video[][] = [];
  for (const group of bySeries.values()) {
    if (group.length > 1) slots.push(group.sort((a, b) => (a.part ?? 0) - (b.part ?? 0)));
    else loose.push(group[0]);
  }
  for (let i = 0; i < loose.length; ) {
    const capacity = Math.max(1, Math.floor((2 * Math.PI * (ORBIT_START + slots.length * ORBIT_STEP)) / PLANET_SPACING));
    slots.push(loose.slice(i, i + capacity));
    i += capacity;
  }
  return slots.map((group, j) => {
    const base = hash(group[0].id) * Math.PI * 2;
    return {
      radius: ORBIT_START + j * ORBIT_STEP,
      tilt: (hash(group[0].id + "t") - 0.5) * 0.5,
      speed: 0.25 / Math.sqrt(1 + j),
      series: group[0].series && group.length > 1 ? group[0].series : undefined,
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
    const angle = Math.PI / 2 - (i / n) * Math.PI * 2;
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
