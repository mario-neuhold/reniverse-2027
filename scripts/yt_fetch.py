import json
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = Path(__file__).resolve().parent / "cache"
KEY = dict(line.strip().split("=", 1) for line in open(ROOT / ".env") if "=" in line)["YOUTUBE_API_KEY"]

CHANNELS = {
    "Ren": {"id": "UCqq3VcwPGseErHUa0-xLInQ"},
    "RenMakesStuff": {"forHandle": "RenMakesStuff"},
    "The Big Push": {"id": "UCLuR_dea3ed8KbIoyvHUB0w"},
    "The Skinner Brothers": {"id": "UCIp5TPlRAWLEIyA969K2V3A"},
    "CHINCHILLA": {"id": "UCO60azVR9BSu6szZKHx9WZg"},
    "CHINCHILLA 2": {"id": "UCZc7gfR6BH-mGJh0_EgHAIQ"},
    "Sam Tompkins": {"id": "UCN-lWv8IwDNljiJA6oDCERA"},
}


def api(resource, **params):
    params["key"] = KEY
    return json.load(urllib.request.urlopen("https://www.googleapis.com/youtube/v3/" + resource + "?" + urllib.parse.urlencode(params), timeout=30))


out = {}
for name, selector in CHANNELS.items():
    r = api("channels", part="contentDetails,snippet", **selector)
    if not r.get("items"):
        print("no channel for", name)
        continue
    channel = r["items"][0]
    uploads = channel["contentDetails"]["relatedPlaylists"]["uploads"]
    videos, token = [], None
    while True:
        page = api("playlistItems", part="snippet,contentDetails", playlistId=uploads, maxResults=50, **({"pageToken": token} if token else {}))
        videos += [{"id": i["contentDetails"]["videoId"], "title": i["snippet"]["title"], "published": i["contentDetails"].get("videoPublishedAt", "")} for i in page["items"]]
        token = page.get("nextPageToken")
        if not token:
            break
    out[name] = {"channelId": channel["id"], "title": channel["snippet"]["title"], "videos": videos}
    print(f"{name}: {len(videos)} videos")
json.dump(out, open(CACHE / "yt_channels.json", "w"), indent=1)
