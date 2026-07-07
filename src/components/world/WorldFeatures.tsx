import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { MONSTER_CONFIGS, type MonsterType } from '../../types/game';
import { vi } from '../../i18n/vi';

interface MonsterCoinLabelProps {
  type: MonsterType;
}

export function MonsterCoinLabel({ type }: MonsterCoinLabelProps) {
  const reward = MONSTER_CONFIGS[type].reward;
  const height =
    type === 'ghast' ? 4.6 : type === 'enderman' ? 5.4 : type === 'zombie' ? 2.8 : type === 'bee' ? 1.4 : 2.2;

  return (
    <Html
      position={[0, height, 0]}
      center
      distanceFactor={14}
      zIndexRange={[50, 0]}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          border: '2px solid #ffd700',
          borderRadius: '10px',
          padding: '3px 10px',
          color: '#ffd700',
          fontWeight: 700,
          fontSize: 'clamp(11px, 2.5vw, 15px)',
          whiteSpace: 'nowrap',
          fontFamily: "'Fredoka', sans-serif",
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)',
        }}
      >
        {vi.coinLabel(reward)}
      </div>
    </Html>
  );
}

/** Seeded hash 0–1 for stable procedural placement */
function hash2(x: number, z: number): number {
  const h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

function generateGridPositions(
  coverage: number,
  step: number,
  half: number,
  y: number,
  skipCenter = 0,
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let x = -half + step * 0.5; x < half; x += step) {
    for (let z = -half + step * 0.5; z < half; z += step) {
      if (Math.hypot(x, z) < skipCenter) continue;
      if (hash2(x, z) < coverage) {
        positions.push([x, y, z]);
      }
    }
  }
  return positions;
}

const RAIN_COUNT = 3000;
const RAIN_HEIGHT = 14;
const MAP_HALF = 48;

export function RainField() {
  const ref = useRef<THREE.Points>(null);
  const speeds = useRef<Float32Array | null>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(RAIN_COUNT * 3);
    const spd = new Float32Array(RAIN_COUNT);
    const span = MAP_HALF * 2;
    for (let i = 0; i < RAIN_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * span;
      arr[i * 3 + 1] = Math.random() * RAIN_HEIGHT;
      arr[i * 3 + 2] = (Math.random() - 0.5) * span;
      spd[i] = 10 + Math.random() * 8;
    }
    speeds.current = spd;
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current || !speeds.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const spd = speeds.current;
    const span = MAP_HALF * 2;

    for (let i = 0; i < RAIN_COUNT; i++) {
      const idx = i * 3;
      pos[idx + 1] -= spd[i] * delta;
      pos[idx] += delta * 1.2;

      if (pos[idx + 1] < 0) {
        pos[idx + 1] += RAIN_HEIGHT;
      }
      if (pos[idx] > MAP_HALF) pos[idx] -= span;
      if (pos[idx] < -MAP_HALF) pos[idx] += span;
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={RAIN_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color="#8ecff5"
        size={0.09}
        transparent
        opacity={0.42}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const startX = position[0];

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.x += delta * (0.25 + hash2(startX, position[2]) * 0.35);
    if (ref.current.position.x > 55) ref.current.position.x = -55;
  });

  return (
    <group ref={ref} position={position}>
      {[0, 1.2, -1, 0.6].map((x, i) => (
        <mesh key={i} position={[x, i * 0.2, 0]}>
          <sphereGeometry args={[0.9 + i * 0.12, 8, 8]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.88} />
        </mesh>
      ))}
    </group>
  );
}

function WaterPatch({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.08 + Math.sin(clock.getElapsedTime() * 1.5) * 0.04;
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color="#2196f3"
        emissive="#1565c0"
        emissiveIntensity={0.1}
        roughness={0.15}
        metalness={0.35}
        transparent
        opacity={0.82}
      />
    </mesh>
  );
}

function LavaPatch({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.45 + Math.sin(clock.getElapsedTime() * 2.5 + position[0]) * 0.15;
  });

  return (
    <group position={position}>
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color="#e65100"
          emissive="#ff5722"
          emissiveIntensity={0.5}
          roughness={0.85}
        />
      </mesh>
      <pointLight position={[0, 1.5, 0]} color="#ff5722" intensity={0.4} distance={size[0] * 0.8} />
    </group>
  );
}

const cloudPositions = generateGridPositions(0.4, 18, MAP_HALF, 0, 3).map(
  ([x, , z]) => [x, 13 + hash2(x + 50, z) * 5, z] as [number, number, number],
);

const waterPatches: { pos: [number, number, number]; size: [number, number] }[] = [
  { pos: [18, 0.02, 12], size: [10, 8] },
  { pos: [-22, 0.02, -18], size: [12, 9] },
  { pos: [30, 0.02, -25], size: [8, 7] },
  { pos: [-35, 0.02, 20], size: [9, 10] },
  { pos: [8, 0.02, -32], size: [11, 6] },
  { pos: [-12, 0.02, 32], size: [7, 8] },
  { pos: [38, 0.02, 8], size: [6, 9] },
];

const lavaPatches: { pos: [number, number, number]; size: [number, number] }[] = [
  { pos: [-28, 0, 28], size: [7, 6] },
  { pos: [25, 0, 28], size: [8, 5] },
  { pos: [-38, 0, -12], size: [6, 7] },
  { pos: [15, 0, -28], size: [9, 6] },
  { pos: [32, 0, -8], size: [5, 5] },
];

export { WaterPatch, LavaPatch, waterPatches, lavaPatches, cloudPositions };
