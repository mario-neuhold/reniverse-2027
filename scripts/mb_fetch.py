import json
import sys
from pathlib import Path

from mb import get

CACHE = Path(__file__).resolve().parent / "cache"

ARTISTS = {
    "Ren": "81250ee6-a008-4007-8cfd-dddc22176cac",
    "Inpatient": "5d88f23e-2cbc-44a5-926d-1bea7bba46c4",
    "The Big Push": "f683189d-aa34-4e77-9ee2-483c276aa910",
    "The Skinner Brothers": "ae1b32a2-107d-4093-a00b-ac6acf838632",
    "Sam Tompkins": "0bd1d730-f49b-4661-bf8e-60f30af9f7f5",
    "Chris Webby": "4771b7f6-f4e8-4d5d-81c4-4fd3c6accc7c",
    "CHINCHILLA": "4407ef33-e8c2-4749-9a80-a9db9337e4c7",
}

RELEASE_GROUPS = {
    "Freckled Angels": "d6d00508-1b97-4f60-ae60-56f9ad9978da",
    "The Tale of Jenny & Screech": "8d72bfdb-5b2e-438f-a064-54f9c4eedae0",
    "Sick Boi": "48ef3eb3-05a7-46ae-8979-1df069d27658",
    "Vincent's Tale": "d3dc13b0-2c89-4721-a228-0ea9b97c587d",
    "Sick Sick Soul (Vol.1)": "142aa304-1d04-4d6e-a039-cd7a0155f5c5",
    "Asylum": "f85dc0fe-4966-4360-aa15-9dbdf027f008",
    "Busking Sessions": "a826482d-b612-47f1-87e1-a59caa5fcdb8",
    "Can Do Will Do": "c3c846dc-149e-4c87-b4d2-b45c5c8db10f",
    "Love Music": "e126aeb4-7485-477c-8a1e-a31204941d2b",
}


def search(query):
    for a in get("artist", query=query, limit=5)["artists"]:
        print(f'{a["id"]}  {a["name"]!r:40} score={a["score"]} {a.get("disambiguation", "")} {a.get("country", "")} {a.get("type", "")}')


def release_groups(name):
    offset, rgs = 0, []
    while True:
        r = get("release-group", artist=ARTISTS[name], limit=100, offset=offset, inc="artist-credits")
        rgs += r["release-groups"]
        offset += 100
        if offset >= r["release-group-count"]:
            break
    for rg in sorted(rgs, key=lambda x: x.get("first-release-date", "")):
        credit = "".join(c.get("name", "") + c.get("joinphrase", "") for c in rg.get("artist-credit", []))
        print(f'{rg["id"]}  {rg.get("first-release-date", ""):10}  {rg.get("primary-type")!s:7} {rg.get("secondary-types")}  {rg["title"]!r}  [{credit}]')


def fetch():
    albums = {}
    for name, rg in RELEASE_GROUPS.items():
        releases = get("release", **{"release-group": rg, "inc": "recordings+artist-credits", "limit": 5})["releases"]
        rel = sorted(releases, key=lambda x: (len(x.get("media", [])) == 0, x.get("date", "9999")))[0]
        tracks = [t for m in rel.get("media", []) for t in m.get("tracks", [])]
        albums[name] = {"rg": rg, "release": rel["id"], "date": rel.get("date"), "tracks": [{"n": t["position"], "title": t["title"], "ms": t.get("length")} for t in tracks]}
        print(f"{name}: {len(tracks)} tracks, {rel.get('date')}")
    json.dump(albums, open(CACHE / "albums.json", "w"), indent=1)
    artists = {name: get(f"artist/{mbid}", inc="url-rels+artist-rels") for name, mbid in ARTISTS.items()}
    json.dump(artists, open(CACHE / "artists.json", "w"), indent=1)


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "search":
        search(sys.argv[2])
    elif len(sys.argv) > 2 and sys.argv[1] == "release-groups":
        release_groups(sys.argv[2])
    else:
        fetch()
