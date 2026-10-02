import assert from "node:assert/strict";
import { test } from "node:test";
import { ALBUMS, DIMENSIONS, buildGalaxies, galaxyRadius, seriesParts, VIDEOS, versionsOf, videoForTrack } from "./data.ts";

test("series share one orbit, parts evenly spaced in part order", () => {
  const ren = buildGalaxies("collective").find((g) => g.name === "Ren")!;
  const money = ren.orbits.filter((o) => o.series === "Money Game");
  assert.equal(money.length, 1);
  const titles = money[0].planets.map((p) => p.video.title);
  assert.deepEqual(titles, ["Money Game Part 1", "Money Game Part 2", "Money Game Part 3"]);
  const [a, b, c] = money[0].planets.map((p) => p.phase);
  assert.ok(Math.abs(b - a - (2 * Math.PI) / 3) < 1e-9 && Math.abs(c - b - (2 * Math.PI) / 3) < 1e-9);
  assert.equal(ren.orbits.flatMap((o) => o.planets).length, ren.videos.length);
});

test("every dimension lays galaxies out without overlap", () => {
  for (const dim of DIMENSIONS) {
    const galaxies = buildGalaxies(dim);
    assert.ok(galaxies.length > 0, dim);
    for (let i = 0; i < galaxies.length; i++) {
      for (let j = i + 1; j < galaxies.length; j++) {
        const [ax, , az] = galaxies[i].position;
        const [bx, , bz] = galaxies[j].position;
        const dist = Math.hypot(ax - bx, az - bz);
        assert.ok(dist >= galaxyRadius(galaxies[i]) + galaxyRadius(galaxies[j]), `${dim}: ${galaxies[i].name} overlaps ${galaxies[j].name}`);
      }
    }
  }
});

test("seriesParts returns ordered siblings or nothing", () => {
  const jenny = VIDEOS.find((v) => v.id === "jennys-tale")!;
  assert.deepEqual(seriesParts(jenny).map((v) => v.part), [1, 2, 3]);
  assert.deepEqual(seriesParts(VIDEOS.find((v) => v.id === "hi-ren")!), []);
});

test("album tracks match their videos despite title differences", () => {
  const expect = (album: string, n: number, id: string) => assert.equal(videoForTrack(album, ALBUMS[album].tracks[n - 1])?.id, id, `${album} #${n}`);
  expect("Sick Boi", 4, "money-game-part-3");
  expect("Sick Boi", 8, "suicide");
  expect("Asylum", 12, "inpatient-dr-meyers");
  expect("Sick Sick Soul (Vol.1)", 5, "skinner-twos-on-a-cigarette");
  expect("Vincent's Tale", 1, "prologue-sunflowers");
  assert.equal(videoForTrack("Sick Boi", ALBUMS["Sick Boi"].tracks[17]), undefined);
  assert.equal(new Set(VIDEOS.map((v) => v.youtubeId)).size, VIDEOS.length);
  for (const video of VIDEOS) if (video.album) assert.ok(ALBUMS[video.album], `${video.id}: unknown album ${video.album}`);
});

test("versions point at a primary video and stay out of galaxies", () => {
  const ids = new Set(VIDEOS.map((v) => v.id));
  assert.equal(ids.size, VIDEOS.length);
  for (const v of VIDEOS) if (v.versionOf) assert.ok(ids.has(v.versionOf) && !VIDEOS.find((p) => p.id === v.versionOf)?.versionOf, v.id);
  const chalk = VIDEOS.find((v) => v.id === "chinchilla-chalk-outlines")!;
  assert.deepEqual(versionsOf(chalk).map((v) => v.version), ["Lyric Video", "Live"]);
  assert.deepEqual(versionsOf(versionsOf(chalk)[1]).map((v) => v.id), versionsOf(chalk).map((v) => v.id));
  for (const dim of DIMENSIONS) if (dim !== "type") for (const g of buildGalaxies(dim)) for (const v of g.videos) assert.ok(!v.versionOf, `${g.key} contains version ${v.id}`);
});

test("every video has a type, type galaxies include versions, about links resolve", () => {
  for (const v of VIDEOS) assert.ok(v.type, v.id);
  const live = buildGalaxies("type").find((g) => g.name === "Live")!;
  assert.ok(live.videos.some((v) => v.id === "chinchilla-chalk-outlines-live"));
  assert.ok(buildGalaxies("type").some((g) => g.name === "Reaction"));
  for (const v of VIDEOS) if (v.about) assert.ok(VIDEOS.some((p) => p.id === v.about && !p.versionOf), `${v.id} about ${v.about}`);
});
