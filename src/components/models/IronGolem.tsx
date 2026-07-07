import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface VoxelBoxProps {
  position?: [number, number, number];
  size?: [number, number, number];
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  metalness?: number;
  roughness?: number;
}

export function VoxelBox({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color,
  emissive,
  emissiveIntensity = 0,
  metalness,
  roughness = 0.82,
}: VoxelBoxProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? color}
        emissiveIntensity={emissiveIntensity}
        roughness={roughness}
        metalness={metalness ?? (emissive ? 0.55 : 0.12)}
      />
    </mesh>
  );
}

const IRON = {
  light: '#ddd9cc',
  mid: '#c4c0b4',
  dark: '#9a968a',
  rust: '#7a7568',
};

const VINE = '#3f6e2a';
const VINE_LIGHT = '#5a8f3c';
const FLOWER = '#e8d44d';

function Weathering({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return <VoxelBox position={position} size={size} color={IRON.rust} roughness={0.95} />;
}

function VineWithFlowers({
  segments,
}: {
  segments: { pos: [number, number, number]; size?: [number, number, number] }[];
}) {
  return (
    <>
      {segments.map(({ pos, size = [0.1, 0.22, 0.1] }, i) => (
        <group key={i}>
          <VoxelBox position={pos} size={size} color={i % 2 === 0 ? VINE : VINE_LIGHT} roughness={0.9} />
          {i % 3 === 1 && (
            <VoxelBox
              position={[pos[0] + 0.06, pos[1] + 0.04, pos[2] + 0.05]}
              size={[0.07, 0.07, 0.05]}
              color={FLOWER}
              emissive="#fff59d"
              emissiveIntensity={0.15}
            />
          )}
        </group>
      ))}
    </>
  );
}

function BodyVines() {
  return (
    <>
      {/* Chest vines — like Minecraft texture */}
      <VineWithFlowers
        segments={[
          { pos: [-0.15, 1.55, 0.44], size: [0.12, 0.28, 0.08] },
          { pos: [0.05, 1.38, 0.44], size: [0.1, 0.24, 0.08] },
          { pos: [0.22, 1.22, 0.43], size: [0.1, 0.22, 0.08] },
          { pos: [-0.08, 1.18, 0.43], size: [0.11, 0.2, 0.08] },
        ]}
      />
      {/* Back/side moss */}
      <VoxelBox position={[0.55, 1.45, -0.2]} size={[0.18, 0.35, 0.14]} color={VINE_LIGHT} roughness={0.92} />
      <VoxelBox position={[-0.5, 1.35, -0.15]} size={[0.15, 0.28, 0.12]} color={VINE} roughness={0.92} />
    </>
  );
}

function ArmVines({ side }: { side: 'left' | 'right' }) {
  const x = side === 'left' ? 0.12 : -0.12;
  return (
    <VineWithFlowers
      segments={[
        { pos: [x, -0.35, 0.14], size: [0.1, 0.25, 0.08] },
        { pos: [x * 0.8, -0.75, 0.12], size: [0.09, 0.22, 0.08] },
        { pos: [x * 0.6, -1.15, 0.1], size: [0.08, 0.2, 0.07] },
      ]}
    />
  );
}

function LegVines({ side }: { side: 'left' | 'right' }) {
  const x = side === 'left' ? 0.1 : -0.1;
  return (
    <VineWithFlowers
      segments={[
        { pos: [x, -0.25, 0.14], size: [0.09, 0.2, 0.08] },
        { pos: [x, -0.55, 0.12], size: [0.08, 0.18, 0.07] },
      ]}
    />
  );
}

function GolemFace() {
  const fz = 0.34;

  return (
    <group position={[0, 2.38, 0]}>
      {/* Small head — MC proportion */}
      <VoxelBox position={[0, 0, 0]} size={[0.68, 0.68, 0.68]} color={IRON.mid} />
      {/* Lighter forehead cap */}
      <VoxelBox position={[0, 0.28, 0.02]} size={[0.7, 0.18, 0.7]} color={IRON.light} />
      <Weathering position={[-0.28, -0.28, 0.28]} size={[0.12, 0.12, 0.08]} />
      <Weathering position={[0.28, -0.28, 0.28]} size={[0.12, 0.12, 0.08]} />

      {/* Unibrow */}
      <VoxelBox position={[0, 0.12, fz]} size={[0.52, 0.07, 0.06]} color={IRON.dark} />

      {/* Small red eyes */}
      <VoxelBox position={[-0.13, 0, fz]} size={[0.11, 0.07, 0.04]} color="#8b0000" emissive="#ff2222" emissiveIntensity={0.65} />
      <VoxelBox position={[0.13, 0, fz]} size={[0.11, 0.07, 0.04]} color="#8b0000" emissive="#ff2222" emissiveIntensity={0.65} />

      {/* Villager-style big nose */}
      <VoxelBox position={[0, -0.1, fz + 0.06]} size={[0.14, 0.22, 0.16]} color={IRON.dark} />
      <VoxelBox position={[0, -0.1, fz + 0.14]} size={[0.12, 0.18, 0.08]} color={IRON.rust} />
    </group>
  );
}

function LevelGear({ level }: { level: number }) {
  const gold = '#ffd700';
  const goldDark = '#f9a825';
  const emerald = '#43a047';
  const diamond = '#b9f2ff';

  return (
    <>
      {level >= 2 && (
        <>
          <VoxelBox position={[0, 0.95, 0.1]} size={[1.55, 0.14, 0.78]} color={gold} emissive={goldDark} emissiveIntensity={0.18} metalness={0.75} />
          <VoxelBox position={[0, 1.45, 0.4]} size={[0.12, 0.12, 0.06]} color="#e53935" emissive="#ff5252" emissiveIntensity={0.4} />
        </>
      )}
      {level >= 3 && (
        <>
          <VoxelBox position={[-1.02, 1.95, -0.02]} size={[0.22, 0.28, 0.55]} color={gold} emissive={goldDark} emissiveIntensity={0.2} metalness={0.8} />
          <VoxelBox position={[1.02, 1.95, -0.02]} size={[0.22, 0.28, 0.55]} color={gold} emissive={goldDark} emissiveIntensity={0.2} metalness={0.8} />
          <VoxelBox position={[-1.02, 1.95, 0.2]} size={[0.14, 0.14, 0.08]} color={emerald} emissive="#69f0ae" emissiveIntensity={0.4} />
          <VoxelBox position={[1.02, 1.95, 0.2]} size={[0.14, 0.14, 0.08]} color={emerald} emissive="#69f0ae" emissiveIntensity={0.4} />
        </>
      )}
      {level >= 4 && (
        <>
          <VoxelBox position={[0, 1.35, 0.36]} size={[1.1, 0.85, 0.1]} color={gold} emissive={goldDark} emissiveIntensity={0.15} metalness={0.7} />
          <VoxelBox position={[-0.22, 1.48, 0.42]} size={[0.12, 0.12, 0.05]} color={emerald} emissive="#69f0ae" emissiveIntensity={0.45} />
          <VoxelBox position={[0.22, 1.48, 0.42]} size={[0.12, 0.12, 0.05]} color={emerald} emissive="#69f0ae" emissiveIntensity={0.45} />
          <VoxelBox position={[0, 1.28, 0.42]} size={[0.14, 0.14, 0.06]} color={diamond} emissive="#e1f5fe" emissiveIntensity={0.6} metalness={0.9} />
        </>
      )}
      {level >= 5 && (
        <>
          <VoxelBox position={[0, 2.82, 0]} size={[0.82, 0.08, 0.82]} color={gold} emissive={goldDark} emissiveIntensity={0.28} metalness={0.85} />
          <VoxelBox position={[0, 2.86, 0.36]} size={[0.12, 0.14, 0.12]} color={diamond} emissive="#e1f5fe" emissiveIntensity={0.65} />
          <VoxelBox position={[-0.34, 2.86, 0]} size={[0.12, 0.14, 0.12]} color={diamond} emissive="#e1f5fe" emissiveIntensity={0.65} />
          <VoxelBox position={[0.34, 2.86, 0]} size={[0.12, 0.14, 0.12]} color={diamond} emissive="#e1f5fe" emissiveIntensity={0.65} />
        </>
      )}
    </>
  );
}

interface IronGolemProps {
  level?: number;
  scale?: number;
  useLevelScale?: boolean;
  animated?: boolean;
  walking?: boolean;
  position?: [number, number, number];
  rotation?: number;
}

export function IronGolem({
  level = 1,
  scale = 1,
  useLevelScale = true,
  animated = true,
  walking = false,
  position = [0, 0, 0],
  rotation = 0,
}: IronGolemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  const walkRef = useRef(false);

  walkRef.current = walking;

  const levelScale = useLevelScale ? 1 + (level - 1) * 0.1 : 1.5;
  const totalScale = scale * levelScale;

  const gold = '#ffd700';
  const diamond = '#b9f2ff';

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const isWalking = walkRef.current;

    if (groupRef.current && animated) {
      const bob = isWalking ? Math.abs(Math.sin(t * 10)) * 0.035 : Math.sin(t * 1.8) * 0.02;
      groupRef.current.position.y = position[1] + bob;
      groupRef.current.rotation.y = rotation;
    }

    const swing = isWalking ? Math.sin(t * 10) * 0.38 : 0;
    const armSwing = isWalking ? Math.sin(t * 10) * 0.28 : 0;

    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = level >= 5 && !isWalking ? -0.25 : armSwing;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={totalScale} rotation={[0, rotation, 0]}>
      {/* Wide flat torso — MC iron golem body */}
      <VoxelBox position={[0, 1.38, 0]} size={[1.75, 1.15, 0.82]} color={IRON.mid} />
      <VoxelBox position={[0, 1.42, 0.02]} size={[1.55, 0.95, 0.72]} color={IRON.light} />
      <Weathering position={[-0.78, 1.85, 0.32]} size={[0.14, 0.14, 0.1]} />
      <Weathering position={[0.78, 1.85, 0.32]} size={[0.14, 0.14, 0.1]} />
      <Weathering position={[-0.78, 0.95, 0.32]} size={[0.14, 0.14, 0.1]} />
      <Weathering position={[0.78, 0.95, 0.32]} size={[0.14, 0.14, 0.1]} />
      <BodyVines />
      <LevelGear level={level} />

      {/* Short thick legs */}
      <group ref={leftLegRef} position={[-0.42, 0.82, 0]}>
        <VoxelBox position={[0, -0.38, 0]} size={[0.48, 0.76, 0.48]} color={IRON.dark} />
        <VoxelBox position={[0, -0.72, 0.02]} size={[0.52, 0.18, 0.52]} color={IRON.rust} />
        <LegVines side="left" />
        {level >= 5 && (
          <VoxelBox position={[0, -0.72, 0]} size={[0.56, 0.22, 0.56]} color={gold} emissive="#f9a825" emissiveIntensity={0.15} metalness={0.75} />
        )}
      </group>

      <group ref={rightLegRef} position={[0.42, 0.82, 0]}>
        <VoxelBox position={[0, -0.38, 0]} size={[0.48, 0.76, 0.48]} color={IRON.dark} />
        <VoxelBox position={[0, -0.72, 0.02]} size={[0.52, 0.18, 0.52]} color={IRON.rust} />
        <LegVines side="right" />
        {level >= 5 && (
          <VoxelBox position={[0, -0.72, 0]} size={[0.56, 0.22, 0.56]} color={gold} emissive="#f9a825" emissiveIntensity={0.15} metalness={0.75} />
        )}
      </group>

      {/* Long hanging arms — reach past knees like MC */}
      <group ref={leftArmRef} position={[-0.98, 1.98, 0]}>
        <VoxelBox position={[0, -0.92, 0]} size={[0.38, 1.85, 0.38]} color={IRON.mid} />
        <VoxelBox position={[0, -0.5, 0.02]} size={[0.34, 1.0, 0.34]} color={IRON.light} />
        <Weathering position={[0, -1.65, 0.12]} size={[0.12, 0.12, 0.1]} />
        <ArmVines side="left" />
        {level >= 5 && (
          <VoxelBox position={[0, -1.7, 0]} size={[0.44, 0.22, 0.44]} color={gold} emissive="#f9a825" emissiveIntensity={0.15} metalness={0.75} />
        )}
      </group>

      <group ref={rightArmRef} position={[0.98, 1.98, 0]}>
        <VoxelBox position={[0, -0.92, 0]} size={[0.38, 1.85, 0.38]} color={IRON.mid} />
        <VoxelBox position={[0, -0.5, 0.02]} size={[0.34, 1.0, 0.34]} color={IRON.light} />
        <Weathering position={[0, -1.65, 0.12]} size={[0.12, 0.12, 0.1]} />
        <ArmVines side="right" />
        {level >= 5 && (
          <>
            <VoxelBox position={[0, -1.7, 0]} size={[0.44, 0.22, 0.44]} color={gold} emissive="#f9a825" emissiveIntensity={0.15} metalness={0.75} />
            <VoxelBox position={[0.08, -1.55, 0.12]} size={[0.1, 0.65, 0.1]} color="#cfd8dc" emissive="#eceff1" emissiveIntensity={0.12} metalness={0.85} />
            <VoxelBox position={[0.08, -1.15, 0.12]} size={[0.18, 0.1, 0.12]} color={gold} emissive="#f9a825" emissiveIntensity={0.22} metalness={0.8} />
            <VoxelBox position={[0.08, -1.05, 0.12]} size={[0.08, 0.08, 0.08]} color={diamond} emissive="#e1f5fe" emissiveIntensity={0.55} />
          </>
        )}
      </group>

      <GolemFace />
    </group>
  );
}
