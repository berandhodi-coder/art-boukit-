"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
} from "react";
import * as THREE from "three";
import { BouquetPoster } from "@/components/home/bouquet-poster";
import { RotateIcon } from "@/components/ui/icons";
import { buildBouquet, disposeBouquet } from "./bouquet-geometry";

type Interaction = {
  dragging: boolean;
  lastX: number;
  lastY: number;
  targetSpin: number;
  targetTilt: number;
  intro: number;
  time: number;
};

const BASE_TILT = 0.34;
const BASE_Y = 0.72;
const AUTO_SPIN = 0.2;

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function Bouquet({
  interactionRef,
  reducedMotion,
}: {
  interactionRef: RefObject<Interaction>;
  reducedMotion: boolean;
}) {
  const tiltRef = useRef<THREE.Group>(null);
  const spinRef = useRef<THREE.Group>(null);
  const parts = useMemo(() => buildBouquet(), []);

  useEffect(() => () => disposeBouquet(parts), [parts]);

  useFrame((_, delta) => {
    const tilt = tiltRef.current;
    const spin = spinRef.current;
    const interaction = interactionRef.current;
    if (!tilt || !spin || !interaction) return;

    const dt = Math.min(delta, 0.05);
    interaction.time += dt;

    if (!interaction.dragging) {
      if (!reducedMotion) interaction.targetSpin += dt * AUTO_SPIN;
      interaction.targetTilt *= Math.exp(-1.6 * dt);
    }

    spin.rotation.y +=
      (interaction.targetSpin - spin.rotation.y) * (1 - Math.exp(-7 * dt));
    tilt.rotation.x +=
      (BASE_TILT + interaction.targetTilt - tilt.rotation.x) *
      (1 - Math.exp(-6 * dt));

    interaction.intro = Math.min(1, interaction.intro + dt / 1.8);
    const eased = 1 - Math.pow(1 - interaction.intro, 3);
    tilt.scale.setScalar(0.88 + 0.12 * eased);
    tilt.position.y =
      BASE_Y + (reducedMotion ? 0 : Math.sin(interaction.time * 0.7) * 0.06);
  });

  return (
    <group ref={tiltRef} position={[0, BASE_Y, 0]} rotation={[BASE_TILT, 0, 0]}>
      <group ref={spinRef} rotation={[0, -1.1, 0]}>
        <mesh geometry={parts.blooms} castShadow receiveShadow>
          <meshPhysicalMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.62}
            sheen={1}
            sheenRoughness={0.5}
            sheenColor="#f7d3da"
            envMapIntensity={0.9}
          />
        </mesh>
        <mesh geometry={parts.greens} castShadow receiveShadow>
          <meshStandardMaterial
            vertexColors
            side={THREE.DoubleSide}
            roughness={0.78}
            envMapIntensity={0.7}
          />
        </mesh>
        <mesh geometry={parts.berries} castShadow>
          <meshStandardMaterial vertexColors roughness={0.45} metalness={0.25} />
        </mesh>
        <mesh geometry={parts.core}>
          <meshStandardMaterial color="#34432f" roughness={1} />
        </mesh>
        <mesh geometry={parts.paperInner} receiveShadow>
          <meshStandardMaterial
            color="#eec3ca"
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
        <mesh geometry={parts.paperOuter} castShadow receiveShadow>
          <meshStandardMaterial
            color="#f8f0e1"
            side={THREE.DoubleSide}
            roughness={0.94}
          />
        </mesh>
        <mesh geometry={parts.ribbon} castShadow>
          <meshPhysicalMaterial
            color="#c9a86e"
            side={THREE.DoubleSide}
            roughness={0.36}
            metalness={0.3}
            sheen={0.8}
            sheenColor="#f3dfb6"
          />
        </mesh>
        <mesh geometry={parts.stems} castShadow>
          <meshStandardMaterial color="#5f7651" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

export default function BouquetExperience() {
  const [supported] = useState(isWebGLAvailable);
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [grabbing, setGrabbing] = useState(false);
  const [explored, setExplored] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<Interaction>({
    dragging: false,
    lastX: 0,
    lastY: 0,
    targetSpin: 0,
    targetTilt: 0,
    intro: 0,
    time: 0,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "160px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (!supported) return <BouquetPoster />;

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    interaction.dragging = true;
    interaction.lastX = event.clientX;
    interaction.lastY = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    setGrabbing(true);
    setExplored(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const interaction = interactionRef.current;
    if (!interaction.dragging) return;
    interaction.targetSpin += (event.clientX - interaction.lastX) * 0.011;
    if (event.pointerType !== "touch") {
      interaction.targetTilt = THREE.MathUtils.clamp(
        interaction.targetTilt + (event.clientY - interaction.lastY) * 0.004,
        -0.3,
        0.4,
      );
    }
    interaction.lastX = event.clientX;
    interaction.lastY = event.clientY;
  };

  const handlePointerEnd = () => {
    interactionRef.current.dragging = false;
    setGrabbing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    interactionRef.current.targetSpin += event.key === "ArrowLeft" ? -0.45 : 0.45;
    setExplored(true);
  };

  return (
    <div
      ref={containerRef}
      role="img"
      tabIndex={0}
      aria-label="Bouquet de roses en trois dimensions. Faites glisser, ou utilisez les flèches gauche et droite, pour le faire pivoter."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
      className={`relative h-full w-full touch-pan-y select-none ${
        grabbing ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      <Canvas
        shadows
        dpr={[1, 1.75]}
        frameloop={inView ? "always" : "never"}
        camera={{ position: [0, 1.4, 17.5], fov: 28, near: 1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => setReady(true)}
        className={`transition-opacity duration-1000 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <ambientLight intensity={0.35} color="#fff4ea" />
        <directionalLight
          castShadow
          position={[-5, 9, 7]}
          intensity={2.1}
          color="#fff3e6"
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0004}
          shadow-normalBias={0.04}
          shadow-camera-left={-5}
          shadow-camera-right={5}
          shadow-camera-top={5}
          shadow-camera-bottom={-5}
          shadow-camera-near={1}
          shadow-camera-far={30}
        />
        <directionalLight position={[6, 2, 4]} intensity={0.5} color="#f6d6dc" />
        <Environment resolution={256} frames={1}>
          <color attach="background" args={["#e9dfd0"]} />
          <Lightformer
            form="rect"
            intensity={2.6}
            color="#fff7ec"
            position={[-5, 7, 6]}
            scale={[9, 9, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.3}
            color="#f8dbe0"
            position={[8, 1, 3]}
            scale={[5, 9, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.6}
            color="#ffffff"
            position={[0, 5, -9]}
            scale={[12, 6, 1]}
          />
          <Lightformer
            form="circle"
            intensity={0.9}
            color="#d9bd8a"
            position={[-6, -4, 2]}
            scale={5}
          />
        </Environment>
        <Bouquet interactionRef={interactionRef} reducedMotion={reducedMotion} />
      </Canvas>

      <p
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-[9%] left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-burgundy/15 bg-ivory/85 px-4 py-2 text-[0.625rem] tracking-[0.24em] whitespace-nowrap text-burgundy uppercase backdrop-blur-sm transition-opacity duration-700 ${
          ready && !explored ? "opacity-100" : "opacity-0"
        }`}
      >
        <RotateIcon className="h-3.5 w-3.5" />
        Faites pivoter
      </p>
    </div>
  );
}
