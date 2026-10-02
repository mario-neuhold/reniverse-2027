import json
import re
import subprocess
from pathlib import Path

from match import albums, best, channels as d, norm

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "src" / "lib" / "data.ts"
src = open(DATA).read()
tagged = subprocess.run(["git", "-C", str(ROOT), "show", "HEAD:src/lib/data.ts"], capture_output=True, text=True).stdout
old = {}
for m in re.finditer(r'^  v\("([^"]+)", "([^"]+)", "([^"]+)", (\d+), (\[[^\]]*\]), (\[[^\]]*\]), (\[[^\]]*\])', tagged, re.M):
    old.setdefault(norm(m.group(2)), {"genres": json.loads(m.group(5)), "moods": json.loads(m.group(6)), "topics": json.loads(m.group(7))})
MANUAL_ID = {"Money Game Part 1": "0ivQwwgW4OY", "Prologue - Sunflowers": "vZ1MnVHARME", "For Joe": "ebX5ZvrT6-o", "It's Alright - Live": "5vqU2t29XN4", "Watch Out - Live": "x0YPR4wX2rg", "English man in New-York": "ZI9Q295iJl4", "What kind of woman is this": "8Rpbg9FG1-o", "Lonely Boy": "nxVCK6XBZpY", "Wade in the water": "DbL7Frf6nJI", "Be bop a lula": "Ay2WBiKJfrY", "These boots are made for walkin'": "ZlJ0wSzBWKw", "Bongo Bongo": "EQAUupOFarw", "Sweet Little Lady - Acoustic": "7gARCb013cw", "Mannequin": "yu1jhwNrryY", "When She Goes": "0vfvViyyWXk", "All My Heroes": "ESd5YihFvis", "The First Night": "-1r0bxN-Ycw", "The Second Night": "vM6zjlxmrGE", "The Third Night": "QJzZI0-8als", "Starry Night": "MTn_bhTVr2U", "The Tale of Jenny & Screech": "TYAnqQ--KX0"}
pub = {v["id"]: v["published"][:4] for ch in d.values() for v in ch["videos"]}
ALBUM_ARTIST = {a: ("Inpatient" if a == "Asylum" else "Ren & The Skinner Brothers" if a.startswith("Sick Sick") else "The Big Push" if a in ("Busking Sessions", "Can Do Will Do") else "Ren") for a in albums}
ALBUM_GENRE = {"Asylum": ["Hip Hop"], "Sick Sick Soul (Vol.1)": ["Indie", "Rock"], "Busking Sessions": ["Busking", "Rock"], "Can Do Will Do": ["Blues", "Rock"], "Sick Boi": ["Hip Hop"], "Freckled Angels": ["Folk"], "Love Music": ["Folk"], "The Tale of Jenny & Screech": ["Folk", "Spoken Word"], "Vincent's Tale": ["Folk", "Spoken Word"]}
SERIES = {"money game part 1": ("Money Game", 1), "money game part 2": ("Money Game", 2), "money game part 3": ("Money Game", 3), "violets tale": ("The Tale of Jenny & Screech", 1), "jennys tale": ("The Tale of Jenny & Screech", 2), "screechs tale": ("The Tale of Jenny & Screech", 3), "prologue sunflowers": ("Vincent's Tale", 1), "self portrait": ("Vincent's Tale", 2), "the bedroom": ("Vincent's Tale", 3), "the first night": ("Vincent's Tale", 4), "the second night": ("Vincent's Tale", 5), "the third night": ("Vincent's Tale", 6), "starry night": ("Vincent's Tale", 7), "what went wrong": ("What Went Wrong", 1), "what went wrong ii": ("What Went Wrong", 2), "love music part 3": ("Love Music", 3), "love music part 4": ("Love Music", 4)}
def clean(t):
    t = re.sub(r"\s*\(feat\..*?\)", "", t).replace("Suic_de", "Suicide").replace(", Pt. ", " Part ").replace("It’s", "It's")
    t = re.sub(r"^Vincent's Tale - ", "", t)
    return "Prologue - Sunflowers" if t == "Prologue - Sunflowers" else t
slug = lambda t: re.sub(r"-+", "-", "".join(c if c.isalnum() else "-" for c in t.lower().replace("'", "").replace("’", ""))).strip("-")
PREFIX = {"Inpatient": "inpatient-", "Ren & The Skinner Brothers": "skinner-", "The Big Push": "bp-", "Ren & Chinchilla": "chinchilla-", "Ren & Sam Tompkins": "sam-", "Ren": ""}
LABELS = {"official lyric video": "Lyric Video", "official lyrics video": "Lyric Video", "lyric video": "Lyric Video", "official music video": "Official Music Video", "official video": "Official Video", "4k official video": "4K", "official": "Official", "official visualizer": "Visualiser", "visualiser": "Visualiser", "video": "Official Video", "live": "Live", "live performance": "Live", "live performance video": "Live", "live acoustic video": "Live Acoustic", "acoustic version - live": "Live Acoustic", "live @ dead wax": "Live at Dead Wax", "the sick boi live at dead wax": "Live at Dead Wax", "the other songs live at koko": "Live at KOKO", "live at the sky arts awards 2024": "Live at Sky Arts Awards", "acoustic": "Acoustic", "live retake": "Live Retake", "live at chalk": "Live at Chalk", "live busking": "Live Busking", "live busking 2020": "Live Busking 2020", "live acoustic": "Live Acoustic"}
def label(title):
    m = re.findall(r"[\(\[]([^\)\]]*)[\)\]]", title)
    cands = [x.strip() for x in m if not re.match(r"ft\.|feat\.", x.strip(), re.I) and not re.match(r"ren x chris webby", x.strip(), re.I)]
    raw = cands[-1] if cands else ""
    if not raw and re.search(r"\blive\b", title, re.I): raw = "Live"
    if re.search(r"rehearsal|bts|reaction|flashing", raw, re.I): return ""
    if not re.search(r"live|acoustic|lyric|visuali|official|4k|remix|instrumental|retake|version|video|stream|session|rap|cover|retake|dead wax|koko|sky arts|brighton dome|chalk|fatboy|sbtrkt|verve|nas|foofighters", raw, re.I): return ""
    raw = re.sub(r"^Official (?=.*Remix)", "", raw)
    return LABELS.get(raw.lower(), raw[:1].upper() + raw[1:])
def type_for(lab, title):
    l = (lab + " " + title).lower()
    if "reaction" in l: return "Reaction"
    if re.search(r"behind the scenes|\bbts\b|behind the push", l): return "Behind the Scenes"
    if re.search(r"documentary|prisoners. round|episode \d", l): return "Documentary"
    if "stream" in l: return "Stream"
    ll = lab.lower()
    if "lyric" in ll: return "Lyric Video"
    if "visuali" in ll: return "Visualiser"
    if "remix" in ll: return "Remix"
    if "instrumental" in ll: return "Instrumental"
    if re.search(r"live|busking|session", ll): return "Live"
    if "acoustic" in ll: return "Acoustic"
    if re.search(r"cover|retake|rap|fatboy|sbtrkt|verve|nas|foofighters", ll): return "Cover"
    if not lab and re.search(r"\blive\b", title, re.I): return "Live"
    return "Music Video"
videos, seen = [], set()
versions = []
titles = {v["id"]: v["title"] for ch in d.values() for v in ch["videos"]}
def add(title, collective, yid, album=None):
    if yid in seen: return
    seen.add(yid)
    n = norm(title); o = old.get(n, {})
    genres = o.get("genres") or (ALBUM_GENRE.get(album) if album else None) or ["Hip Hop"]
    extra = {}
    if album: extra["album"] = album
    if n in SERIES: extra["series"], extra["part"] = SERIES[n]
    if (album == "Vincent's Tale" or n in ("the first night", "the second night", "the third night", "starry night")) and "series" in extra and album is None: extra["album"] = "Vincent's Tale"
    extra["youtubeId"] = yid
    vid = PREFIX[collective] + slug(title)
    primary_label = label(titles.get(yid, ""))
    if primary_label: extra["version"] = primary_label
    extra["type"] = type_for(primary_label, titles.get(yid, ""))
    videos.append((vid, title, collective, int(pub.get(yid, 2023)), genres, o.get("moods", []), o.get("topics", []), extra))
    for c in best(title, exclude_live=False):
        if c["id"] in seen: continue
        lab = label(c["title"])
        if not lab or (collective == "The Big Push") != (c["ch"] == "The Big Push"): continue
        seen.add(c["id"])
        year = int(pub.get(c["id"], 2023))
        if any(v[7]["versionOf"] == vid and v[7]["version"] == lab for v in versions): lab = f"{lab} {year}"
        versions.append((vid + "-" + slug(lab), title, collective, year, genres, [], [], {"versionOf": vid, "version": lab, "type": type_for(lab, c["title"]), "youtubeId": c["id"]}))
for alb, a in albums.items():
    for t in a["tracks"]:
        title = clean(t["title"])
        if title.startswith("Richard's Tale") or alb == "Love Music" and title != "Can't Stop Me": continue
        yid = MANUAL_ID.get(t["title"]) or MANUAL_ID.get(title) or (best(t["title"]) or [{}])[0].get("id")
        if yid: add(title, ALBUM_ARTIST[alb], yid, alb)
for title in ["The First Night", "The Second Night", "The Third Night", "Starry Night"]: add(title, "Ren", MANUAL_ID[title], "Vincent's Tale")
SINGLES = [("Hi Ren","Ren"),("Money Game Part 1","Ren"),("Money Game Part 2","Ren"),("The Tale of Jenny & Screech","Ren"),("Losing It","Ren"),("Humble","Ren"),("Kujo Beat Down","Ren"),("Mackay","Ren"),("Troubles","Ren"),("Slaughter House","Ren"),("For Joe","Ren"),("Money Ties","Ren"),("Power","Ren"),("Depression","Ren"),("Insomnia","Ren"),("Penitence","Ren"),("Children of the Moon","Ren"),("Everybody Drops","Ren"),("Right Here, Right Now","Ren"),("Wildfire","Ren"),("All My Life","Ren"),("Bittersweet Symphony","Ren"),("Eden","Ren"),("Life Is Funny","Ren"),("Dear God","Ren"),("Ocean","Ren"),("Heretic","Ren"),("Ready For You","Ren"),("Crucify Your Culture","Ren"),("Fred Again Mash Up","Ren"),("Halftime","Ren"),("Dumb King Come","Ren"),("Love Music Part 3","Ren"),("Girls!","Ren"),("Do You Believe","Ren"),("Hold On","Ren"),("Jessica","Ren"),("Chalk Outlines","Ren & Chinchilla"),("How to Be Me","Ren & Chinchilla"),("Blind Eyed","Ren & Sam Tompkins"),("What Went Wrong","Ren & Sam Tompkins"),("What Went Wrong II","Ren & Sam Tompkins"),("Sweet Little Lady","The Big Push"),("Icarus","The Big Push"),("Why My Woman?","The Big Push"),("Oh My Woman!","The Big Push"),("Dignity","The Big Push"),("Heart Attack","The Big Push")]
for title, coll in SINGLES:
    yid = MANUAL_ID.get(title) or (best(title) or [{}])[0].get("id")
    if yid: add(title, coll, yid)
add("ASYLUM | The Documentary", "Inpatient", "JadrrdwzO1U")
EXTRA_INCLUDE = re.compile(r"behind the scenes|\bbts\b|behind the push|documentary|prisoners. round|episode \d|livestream|live stream|twitch stream|reaction compilation|full video\)", re.I)
EXTRA_EXCLUDE = re.compile(r"#|premier|countdown|trailer|out now|coming|tomorrow|instagram|patreon recap|\(official reaction compilation\).*self", re.I)
primaries_by_norm = {norm(v[1]): v[0] for v in videos}
extras = []
for ch in ["Ren", "RenMakesStuff", "The Big Push"]:
    for v in d[ch]["videos"]:
        t = v["title"]
        if v["id"] in seen or not EXTRA_INCLUDE.search(t) or EXTRA_EXCLUDE.search(t): continue
        seen.add(v["id"])
        collective = "The Big Push" if ch == "The Big Push" else "Inpatient" if "inpatient" in t.lower() else "Ren & Sam Tompkins" if "sam tompkins" in t.lower() else "Ren & Chinchilla" if "chinchilla" in t.lower() else "Ren"
        typ = type_for("", t)
        clean_t = re.sub(r"^(Ren|Inpatient \(Ren x Chris Webby\))\s*[-–]\s*", "", t).strip()
        about = None
        for part in re.split(r"\s*[\(\[\|–:-]\s*|\s+by\s+|\s+w/\s+", clean_t):
            n = norm(re.sub(r"behind the scenes|behind the push|bts|official|reaction compilation|live twitch stream|livestream|live stream|full video|the story of|stories|vol \d|'", "", part, flags=re.I))
            if n in primaries_by_norm: about = primaries_by_norm[n]; break
        extra = {"type": typ, "youtubeId": v["id"]}
        if about: extra["about"] = about
        extras.append((PREFIX[collective] + slug(clean_t)[:60], clean_t, collective, int(v["published"][:4]), ["Documentary"] if typ == "Documentary" else [], [], [], extra))
ts = lambda x: json.dumps(x, ensure_ascii=False)
def ex(e): return ", { " + ", ".join(f"{k}: {ts(v)}" for k, v in e.items()) + " }"
block = "export const VIDEOS: Video[] = [\n" + "\n".join(f"  v({ts(i)}, {ts(t)}, {ts(c)}, {y}, {ts(g)}, {ts(m)}, {ts(tp)}{ex(e)})," for i,t,c,y,g,m,tp,e in videos + versions + extras) + "\n];\n"
v0 = src.index("export const VIDEOS: Video[] = ["); v1 = src.index("];", v0) + 3
open(DATA, "w").write(src[:v0] + block + src[v1:])
print(len(videos), "primaries,", len(versions), "versions,", len(extras), "extras;", sum(1 for v in videos if not v[5]), "primaries without moods")
