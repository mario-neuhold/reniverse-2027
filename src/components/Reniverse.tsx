"use client";

import { CameraControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type PerspectiveCamera, Vector3 } from "three";
import { Galaxy } from "@/components/Galaxy";
import { Hud } from "@/components/Hud";
import { VideoModal } from "@/components/VideoModal";
import { type Dimension, type Galaxy as GalaxyData, type Video, buildGalaxies, galaxyRadius, overviewExtent } from "@/lib/data";

export type Focus = { kind: "overview" } | { kind: "galaxy"; galaxy: GalaxyData } | { kind: "video"; video: Video; galaxy: GalaxyData };

export function Reniverse() {
  const [dimension, setDimension] = useState<Dimension>("collective");
  const [focus, setFocus] = useState<Focus>({ kind: "overview" });
  const controls = useRef<CameraControls>(null);
  const galaxies = useMemo(() => buildGalaxies(dimension), [dimension]);
  const extent = useMemo(() => overviewExtent(galaxies), [galaxies]);

  const fly = useCallback((center: Vector3, radius: number, elevation: number) => {
    const cam = controls.current;
    if (!cam) return;
    const { fov, aspect } = cam.camera as PerspectiveCamera;
    const distance = (radius / (Math.tan((fov * Math.PI) / 360) * Math.min(1, Math.max(aspect, 0.7)))) * 1.1;
    const out = new Vector3(center.x, 0, center.z);
    if (out.lengthSq() === 0) out.set(0, 0, 1);
    const eye = center.clone().addScaledVector(out.normalize(), distance * Math.cos(elevation));
    eye.y += distance * Math.sin(elevation);
    cam.setLookAt(eye.x, eye.y, eye.z, center.x, center.y, center.z, true);
  }, []);

  const flyHome = useCallback(() => fly(new Vector3(0, 0, extent * 0.25), extent, 0.7), [fly, extent]);

  useEffect(() => {
    flyHome();
  }, [flyHome]);

  const flyOverview = () => {
    flyHome();
    setFocus({ kind: "overview" });
  };

  const flyGalaxy = (galaxy: GalaxyData) => {
    fly(new Vector3(...galaxy.position), galaxyRadius(galaxy), 0.6);
    setFocus({ kind: "galaxy", galaxy });
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
    setFocus({ kind: "overview" });
  };

  const step = (dir: 1 | -1) => {
    const n = galaxies.length;
    const i = focus.kind === "overview" ? (dir === 1 ? -1 : n) : galaxies.findIndex((g) => g.key === focus.galaxy.key);
    flyGalaxy(galaxies[(i + dir + n) % n]);
  };

  const closeVideo = () => {
    if (focus.kind === "video") flyGalaxy(focus.galaxy);
  };

  return (
    <div className="fixed inset-0 bg-[#030014]">
      <Canvas camera={{ position: [0, extent * 0.9, extent * 1.6], fov: 50, far: 3000 }} onPointerMissed={() => focus.kind !== "video" && flyOverview()}>
        <color attach="background" args={["#030014"]} />
        <ambientLight intensity={0.6} />
        <Stars radius={600} depth={200} count={6000} factor={6} fade speed={0.5} />
        {galaxies.map((galaxy) => (
          <Galaxy
            key={galaxy.key}
            galaxy={galaxy}
            paused={focus.kind === "video"}
            onSunClick={flyGalaxy}
            onPlanetClick={(planet, g, pos) => flyPlanet(planet.video, g, pos)}
          />
        ))}
        <CameraControls ref={controls} makeDefault minDistance={4} maxDistance={600} smoothTime={0.7} dollySpeed={0.6} />
      </Canvas>
      <Hud dimension={dimension} galaxies={galaxies} focus={focus} onDimension={changeDimension} onOverview={flyOverview} onGalaxy={flyGalaxy} onStep={step} />
      {focus.kind === "video" && <VideoModal video={focus.video} onClose={closeVideo} onSelect={(video) => setFocus({ ...focus, video })} />}
    </div>
  );
}
