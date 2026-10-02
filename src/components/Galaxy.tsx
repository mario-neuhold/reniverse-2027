"use client";

import { Billboard, Image as Sprite } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, type ReactNode, Suspense, useRef, useState } from "react";
import { type Group, Vector3 } from "three";
import { type Galaxy as GalaxyData, type Orbit, type Planet, galaxyImage, placeholderImage, videoThumbnail } from "@/lib/data";

const INFO_BADGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><circle cx="64" cy="64" r="60" fill="#f0abfc"/><text x="64" y="64" dy="0.35em" font-family="serif" font-style="italic" font-weight="bold" font-size="88" fill="#1a0a2e" text-anchor="middle">i</text></svg>',
)}`;

class SpriteBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type PicProps = { url: string; fallback: string; radius: number; scale: number | [number, number] };

function Pic({ fallback, ...props }: PicProps) {
  return (
    <SpriteBoundary fallback={<Sprite {...props} url={fallback} />}>
      <Suspense fallback={null}>
        <Sprite {...props} />
      </Suspense>
    </SpriteBoundary>
  );
}

type Props = {
  galaxy: GalaxyData;
  active: boolean;
  paused: boolean;
  onSunClick: (galaxy: GalaxyData) => void;
  onPlanetClick: (planet: Planet, galaxy: GalaxyData, worldPosition: Vector3) => void;
};

export function Galaxy({ galaxy, active, paused, onSunClick, onPlanetClick }: Props) {
  const sunSize = 3 + Math.min(galaxy.videos.length, 12) * 0.25;
  const image = galaxyImage(galaxy.name);
  const title = placeholderImage(galaxy.name, "text");
  return (
    <group position={galaxy.position}>
      <Billboard>
        <group
          onClick={(e) => {
            e.stopPropagation();
            onSunClick(galaxy);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "";
          }}
        >
          {image && <Pic url={image} fallback={placeholderImage(galaxy.name, "cover")} radius={0.15} scale={sunSize} />}
          <Sprite url={title} transparent scale={[sunSize * 1.6, sunSize * 0.4]} position={[0, image ? -sunSize * 0.75 : 0, 0]} />
          {active && (
            <>
              <mesh position={[0, 0, -0.02]}>
                <ringGeometry args={[sunSize * (image ? 0.76 : 0.86), sunSize * (image ? 0.82 : 0.92), 64]} />
                <meshBasicMaterial color="#f0abfc" transparent opacity={0.9} />
              </mesh>
              <Sprite url={INFO_BADGE} transparent scale={sunSize * 0.3} position={[sunSize * (image ? 0.5 : 0.8), sunSize * (image ? 0.5 : 0.2), 0.02]} />
            </>
          )}
        </group>
      </Billboard>
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
            <Pic url={videoThumbnail(planet.video)} fallback={placeholderImage(planet.video.title, "cover")} radius={0.06} scale={[planet.size * 1.78, planet.size]} />
            <Sprite url={placeholderImage(planet.video.title, "text")} transparent scale={[planet.size * 1.78, planet.size * 0.445]} position={[0, -planet.size * 0.78, 0]} />
            <mesh
              visible={false}
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
            >
              <planeGeometry args={[planet.size * 3.6, planet.size * 2.6]} />
            </mesh>
          </Billboard>
        </group>
      ))}
    </group>
  );
}
