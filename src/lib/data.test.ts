import assert from "node:assert/strict";
import { test } from "node:test";
import { DIMENSIONS, buildGalaxies, galaxyRadius, seriesParts, VIDEOS } from "./data.ts";

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
