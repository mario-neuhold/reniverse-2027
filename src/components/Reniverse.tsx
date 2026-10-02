"use client";

import { CameraControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { type PerspectiveCamera, Vector3 } from "three";
import { Galaxy } from "@/components/Galaxy";
import { Hud } from "@/components/Hud";
import { GalaxyModal } from "@/components/GalaxyModal";
import { VideoModal } from "@/components/VideoModal";
import { type Dimension, type Galaxy as GalaxyData, type Video, buildGalaxies, galaxyRadius, overviewExtent } from "@/lib/data";

export type Focus =
  | { kind: "overview" }
  | { kind: "galaxy"; galaxy: GalaxyData }
  | { kind: "info"; galaxy: GalaxyData }
  | { kind: "video"; video: Video; galaxy: GalaxyData };

const FOV = 50;

function eyeFor(center: Vector3, radius: number, elevation: number, aspect: number) {
  const distance = (radius / (Math.tan((FOV * Math.PI) / 360) * Math.min(1, Math.max(aspect, 0.7)))) * 1.1;
  const out = new Vector3(center.x, 0, center.z);
  if (out.lengthSq() === 0) out.set(0, 0, 1);
  const eye = center.clone().addScaledVector(out.normalize(), distance * Math.cos(elevation));
  eye.y += distance * Math.sin(elevation);
  return eye;
}

const homeCenter = (galaxies: GalaxyData[]) => new Vector3(0, 0, overviewExtent(galaxies) * 0.25);

export function Reniverse() {
  const [dimension, setDimension] = useState<Dimension>("collective");
  const [focus, setFocus] = useState<Focus>({ kind: "overview" });
  const controls = useRef<CameraControls>(null);
  const galaxies = useMemo(() => buildGalaxies(dimension), [dimension]);
  const [initialEye] = useState(() => eyeFor(homeCenter(galaxies), overviewExtent(galaxies), 0.7, window.innerWidth / window.innerHeight));

  const fly = (center: Vector3, radius: number, elevation: number) => {
    const cam = controls.current;
    if (!cam) return;
    const eye = eyeFor(center, radius, elevation, (cam.camera as PerspectiveCamera).aspect);
    cam.setLookAt(eye.x, eye.y, eye.z, center.x, center.y, center.z, true);
  };

  const flyOverview = (target = galaxies) => {
    fly(homeCenter(target), overviewExtent(target), 0.7);
    setFocus({ kind: "overview" });
  };

  const flyGalaxy = (galaxy: GalaxyData) => {
    fly(new Vector3(...galaxy.position), galaxyRadius(galaxy), 0.6);
    setFocus({ kind: "galaxy", galaxy });
  };

  const clickSun = (galaxy: GalaxyData) => {
    if (focus.kind === "galaxy" && focus.galaxy.key === galaxy.key) setFocus({ kind: "info", galaxy });
    else flyGalaxy(galaxy);
  };

  const flyPlanet = (video: Video, galaxy: GalaxyData, target: Vector3) => {
    const cam = controls.current;
    if (!cam) return;
    const from = cam.getPosition(new Vector3());
    const offset = from.sub(target).normalize().multiplyScalar(7);
    const eye = target.clone().add(offset);
    cam.setLookAt(eye.x, eye.y + 1.5, eye.z, target.x, target.y, target.z, true);
    setFocus({ kind: "video", video, galaxy });
  };

  const changeDimension = (d: Dimension) => {
    setDimension(d);
    flyOverview(buildGalaxies(d));
  };

  const goToTag = (d: Dimension, name: string) => {
    const galaxy = buildGalaxies(d).find((g) => g.name === name);
    if (!galaxy) return;
    setDimension(d);
    flyGalaxy(galaxy);
  };

  const step = (dir: 1 | -1) => {
    const n = galaxies.length;
    const i = focus.kind === "overview" ? (dir === 1 ? -1 : n) : galaxies.findIndex((g) => g.key === focus.galaxy.key);
    flyGalaxy(galaxies[(i + dir + n) % n]);
  };

  const modalOpen = focus.kind === "video" || focus.kind === "info";

  const closeVideo = () => {
    if (focus.kind === "video") flyGalaxy(focus.galaxy);
  };

  return (
    <div className="fixed inset-0 bg-[#030014]">
      <Canvas dpr={[1, 1.5]} frameloop={modalOpen ? "demand" : "always"} camera={{ position: initialEye, fov: FOV, far: 3000 }} onPointerMissed={() => focus.kind !== "video" && flyOverview()}>
        <color attach="background" args={["#030014"]} />
        <ambientLight intensity={0.6} />
        <Stars radius={600} depth={200} count={2500} factor={6} fade speed={0.5} />
        {galaxies.map((galaxy) => (
          <Galaxy
            key={galaxy.key}
            galaxy={galaxy}
            active={focus.kind !== "overview" && focus.galaxy.key === galaxy.key}
            paused={focus.kind === "video"}
            onSunClick={clickSun}
            onPlanetClick={(planet, g, pos) => flyPlanet(planet.video, g, pos)}
          />
        ))}
        <CameraControls ref={controls} makeDefault minDistance={4} maxDistance={600} smoothTime={0.7} dollySpeed={0.6} />
      </Canvas>
      <Hud dimension={dimension} galaxies={galaxies} focus={focus} onDimension={changeDimension} onOverview={() => flyOverview()} onGalaxy={flyGalaxy} onStep={step} />
      {focus.kind === "info" && (
        <GalaxyModal
          galaxy={focus.galaxy}
          dimension={dimension}
          onClose={() => setFocus({ kind: "galaxy", galaxy: focus.galaxy })}
          onPlay={(video) => setFocus({ kind: "video", video, galaxy: focus.galaxy })}
        />
      )}
      {focus.kind === "video" && (
        <VideoModal video={focus.video} currentGalaxy={focus.galaxy.key} onClose={closeVideo} onSelect={(video) => setFocus({ ...focus, video })} onTag={goToTag} />
      )}
    </div>
  );
}
