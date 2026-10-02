# Data pipeline

`src/lib/data.ts` is partly generated. Run from the repo root with Python 3, no packages needed.

1. `python3 scripts/yt_fetch.py` — every upload of the relevant channels via the YouTube Data API (`YOUTUBE_API_KEY` in `.env`, ~30 quota units) into `scripts/cache/yt_channels.json`.
2. `python3 scripts/mb_fetch.py` — tracklists and artist links from MusicBrainz into `scripts/cache/albums.json` and `artists.json`. `mb_fetch.py search 'artist:"Name"'` and `mb_fetch.py release-groups Ren` help when adding artists or albums to the id maps at the top of the file.
3. `python3 scripts/gen_albums.py` — rewrites the `ALBUMS` block in `data.ts` from the cache. Album notes live in `META` inside the script.
4. `python3 scripts/gen_videos.py` — rewrites the `VIDEOS` block: album tracks and known singles matched to channel uploads by title, alternate versions per song, plus behind-the-scenes, streams, documentaries and reaction compilations. Manual id fixes and the singles list live in the script. Genre, mood and topic tags are carried over from the committed `data.ts` (`git show HEAD:src/lib/data.ts`), so commit tag edits before regenerating.

`python3 scripts/match.py` prints the track-to-upload matching report without writing anything.

`ARTISTS` in `data.ts` is hand-written; `scripts/cache/artists.json` holds the MusicBrainz URL relations it was built from.
