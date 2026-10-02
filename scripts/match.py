import json
import re
from pathlib import Path

CACHE = Path(__file__).resolve().parent / "cache"
channels = json.load(open(CACHE / "yt_channels.json"))
albums = json.load(open(CACHE / "albums.json"))

BAD = re.compile(r"#|reaction|behind|bts\b|instagram|premier|countdown|trailer|out now|full album|full video|full ep|full show|full reaction|compilation|livestream|live stream|twitch|interview|patreon|episode|last push|treasure hunt|tour diary|official audio|out tomorrow|coming|release day|stories", re.I)
PREFIX = re.compile(r"^(inpatient \(ren x chris webby\)|the big push|ren\s*(?:x|&|ft\.?|feat\.?)\s*[^-]+|ren)\s*[-–]\s*", re.I)


def song(title):
    t = PREFIX.sub("", title.strip())
    t = re.sub(r"\s*[\(\[].*?[\)\]]", "", t)
    t = re.sub(r"\s*(ft\.?|feat\.?)\s.*$", "", t, flags=re.I)
    return t.strip()


def norm(t):
    t = t.lower().replace("suic_de", "suicide").replace("su!cide", "suicide")
    t = re.sub(r"\bpt\.\s*", "part ", t)
    t = re.sub(r"\bmoney game (\d)\b", r"money game part \1", t)
    t = re.sub(r"\(feat\..*?\)", "", t)
    t = re.sub(r"^vincent.s tale\s*-\s*", "", t)
    t = t.replace("’", "").replace("'", "")
    return re.sub(r"[^a-z0-9]+", " ", t).strip()


def rank(title):
    l = title.lower()
    if "official music video" in l or "4k official video" in l:
        return 0
    if "(official)" in l or l.endswith("official"):
        return 1
    if "lyric" in l:
        return 2
    if "visuali" in l:
        return 3
    if "(" not in l and "[" not in l:
        return 4
    if "live" in l:
        return 6
    return 5


pool = [
    {**v, "ch": ch, "song": norm(song(v["title"])), "rank": rank(v["title"])}
    for ch in ["Ren", "The Big Push", "RenMakesStuff"]
    for v in channels[ch]["videos"]
    if not BAD.search(v["title"])
]


def best(name, exclude_live=True):
    n = norm(name)
    candidates = [p for p in pool if p["song"] == n and (p["rank"] < 6 or not exclude_live)]
    return sorted(candidates, key=lambda p: (p["rank"], p["published"]))


def report():
    for album, a in albums.items():
        print("==", album)
        for t in a["tracks"]:
            c = best(t["title"])
            print(f'   {t["n"]:2} {t["title"]:45} -> ' + (f'{c[0]["id"]} {c[0]["published"][:10]} {c[0]["title"]}' + (f"  (+{len(c) - 1})" if len(c) > 1 else "") if c else "--"))


if __name__ == "__main__":
    report()
