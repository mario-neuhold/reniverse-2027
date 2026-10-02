"use client";

import { Billboard, Html, Image as Sprite } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { type Group, Vector3 } from "three";
import { type Galaxy as GalaxyData, type Orbit, type Planet, galaxyImage, placeholderImage, videoThumbnail } from "@/lib/data";

type Props = {
  galaxy: GalaxyData;
  paused: boolean;
  onSunClick: (galaxy: GalaxyData) => void;
  onPlanetClick: (planet: Planet, galaxy: GalaxyData, worldPosition: Vector3) => void;
};

export function Galaxy({ galaxy, paused, onSunClick, onPlanetClick }: Props) {
  const [hover, setHover] = useState(false);
  const sunSize = 3 + Math.min(galaxy.videos.length, 12) * 0.25;
  const image = galaxyImage(galaxy.name);
  return (
    <group position={galaxy.position}>
      <Billboard>
        <Sprite
          url={image ?? placeholderImage(galaxy.name, "text")}
          transparent
          radius={image ? 0.15 : 0}
          scale={image ? sunSize : [sunSize * 1.6, sunSize * 0.4]}
          onClick={(e) => {
            e.stopPropagation();
            onSunClick(galaxy);
          }}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        />
        {hover && <Label text={galaxy.name} y={sunSize / 2 + 0.5} />}
      </Billboard>
      <pointLight intensity={2} distance={60} decay={1} />
      {galaxy.orbits.map((orbit) => (
        <OrbitRing key={orbit.planets[0].video.id} orbit={orbit} paused={paused} onClick={(planet, pos) => onPlanetClick(planet, galaxy, pos)} />
      ))}
    </group>
  );
}

function OrbitRing({ orbit, paused, onClick }: { orbit: Orbit; paused: boolean; onClick: (planet: Planet, pos: Vector3) => void }) {
  const refs = useRef<(Group | null)[]>([]);
  const angle = useRef(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const r = orbit.radius;

  useFrame((_, delta) => {
    if (!paused && !hovered) angle.current += delta * orbit.speed;
    orbit.planets.forEach((planet, i) => {
      const a = angle.current + planet.phase;
      refs.current[i]?.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    });
  });

  const width = orbit.series ? 0.08 : 0.03;
  const opacity = orbit.series ? (hovered ? 0.9 : 0.55) : hovered ? 0.4 : 0.12;

  return (
    <group rotation-x={orbit.tilt}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[r - width, r + width, 96]} />
        <meshBasicMaterial color={orbit.series ? "#f0abfc" : "white"} transparent opacity={opacity} />
      </mesh>
      {orbit.planets.map((planet, i) => (
        <group
          key={planet.video.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
        >
          <Billboard>
            <Sprite
              url={videoThumbnail(planet.video)}
              radius={0.06}
              scale={[planet.size * 1.78, planet.size]}
              onClick={(e) => {
                e.stopPropagation();
                onClick(planet, e.object.getWorldPosition(new Vector3()));
              }}
              onPointerOver={() => {
                setHovered(planet.video.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = "";
              }}
            />
            {hovered === planet.video.id && <Label text={planet.video.title} y={planet.size / 2 + 0.3} />}
          </Billboard>
        </group>
      ))}
    </group>
  );
}

function Label({ text, y }: { text: string; y: number }) {
  return (
    <Html position={[0, y, 0]} center zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap rounded bg-black/70 px-2 py-1 text-xs text-white">{text}</div>
    </Html>
  );
}
