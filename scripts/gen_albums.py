import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "lib" / "data.ts"
albums = json.load(open(Path(__file__).resolve().parent / "cache" / "albums.json"))

META = {
    "Freckled Angels": ("Ren", "Album", None),
    "Love Music": ("Ren", "Album", "First record, acoustic and home-produced."),
    "The Tale of Jenny & Screech": ("Ren", "EP", "Three-part story told from three perspectives."),
    "Sick Boi": ("Ren", "Album", "Debut full-length, self-released."),
    "Vincent's Tale": ("Ren", "EP", "Story cycle around Vincent van Gogh, followed by Richard's Tale."),
    "Sick Sick Soul (Vol.1)": ("Ren & The Skinner Brothers", "EP", None),
    "Asylum": ("Inpatient", "Album", "Ren and Chris Webby as Inpatient, one video per track."),
    "Can Do Will Do": ("The Big Push", "Album", None),
    "Busking Sessions": ("The Big Push", "Album", "Covers from the Brighton seafront sets."),
}


def ts(value):
    return json.dumps(value, ensure_ascii=False)


entries = []
for name, (artist, kind, note) in META.items():
    a = albums[name]
    tracks = ", ".join(f'{{ n: {t["n"]}, title: {ts(t["title"])}, seconds: {(t["ms"] or 0) // 1000} }}' for t in a["tracks"])
    note_ts = f", note: {ts(note)}" if note else ""
    entries.append(f'  {ts(name)}: {{\n    mbid: "{a["rg"]}",\n    artist: {ts(artist)},\n    date: "{a["date"]}",\n    type: "{kind}"{note_ts},\n    tracks: [\n      {tracks},\n    ],\n  }},')
block = "export const ALBUMS: Record<string, Album> = {\n" + "\n".join(entries) + "\n};\n"

src = open(DATA).read()
start = src.index("export const ALBUMS: Record<string, Album> = {")
end = src.index("};\n", start) + 3
open(DATA, "w").write(src[:start] + block + src[end:])
print(len(entries), "albums written")
