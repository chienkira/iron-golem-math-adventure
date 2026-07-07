import { useRef } from 'react';
import type { ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MonsterType } from '../../types/game';
import { MONSTER_CONFIGS } from '../../types/game';
import { VoxelBox } from './IronGolem';

interface MonsterModelProps {
  type: MonsterType;
  animated?: boolean;
  position?: [number, number, number];
  scale?: number;
}

const MC = {
  creeper: { light: '#6fa050', dark: '#3f6b30', face: '#1a1a1a' },
  bee: { yellow: '#f8c627', black: '#1a1a1a', wing: '#eef2f8' },
  zombie: { skin: '#71987a', shirt: '#3a8eb2', pants: '#4b2e85', hair: '#2a2a2a', eye: '#1a1a1a' },
  enderman: { body: '#161616', eye: '#e040fb' },
} as const;

function CreeperModel({ animated, scale = 1 }: { animated?: boolean; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const { light, dark, face } = MC.creeper;

  useFrame(() => {
    if (!ref.current || !animated) return;
    ref.current.position.y = Math.sin(Date.now() * 0.003) * 0.05;
  });

  return (
    <group ref={ref} scale={scale}>
      <VoxelBox position={[0, 0.55, 0]} size={[0.6, 1.0, 0.35]} color={light} />
      <VoxelBox position={[0, 0.55, 0.01]} size={[0.35, 0.55, 0.02]} color={dark} />
      <VoxelBox position={[0, 1.35, 0]} size={[0.6, 0.6, 0.6]} color={light} />
      <VoxelBox position={[0, 1.35, 0.01]} size={[0.35, 0.35, 0.02]} color={dark} />
      {/* Classic creeper face */}
      <VoxelBox position={[-0.12, 1.45, 0.31]} size={[0.12, 0.14, 0.02]} color={face} />
      <VoxelBox position={[0.12, 1.45, 0.31]} size={[0.12, 0.14, 0.02]} color={face} />
      <VoxelBox position={[0, 1.28, 0.31]} size={[0.1, 0.12, 0.02]} color={face} />
      <VoxelBox position={[0, 1.38, 0.31]} size={[0.08, 0.08, 0.02]} color={face} />
      {/* Four legs */}
      <VoxelBox position={[-0.22, 0.15, 0.12]} size={[0.24, 0.3, 0.24]} color={dark} />
      <VoxelBox position={[0.22, 0.15, 0.12]} size={[0.24, 0.3, 0.24]} color={dark} />
      <VoxelBox position={[-0.22, 0.15, -0.12]} size={[0.24, 0.3, 0.24]} color={dark} />
      <VoxelBox position={[0.22, 0.15, -0.12]} size={[0.24, 0.3, 0.24]} color={dark} />
    </group>
  );
}

function BeeModel({ animated, scale = 1 }: { animated?: boolean; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const { yellow, black, wing } = MC.bee;

  useFrame(() => {
    if (!ref.current || !animated) return;
    const t = Date.now() * 0.004;
    ref.current.position.y = 0.32 + Math.sin(t * 2) * 0.07;
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.1;
  });

  const wingMat = (
    <meshStandardMaterial
      color={wing}
      transparent
      opacity={0.62}
      roughness={0.25}
      metalness={0}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );

  return (
    <group ref={ref} scale={scale}>
      <VoxelBox position={[0, 0.38, 0.2]} size={[0.36, 0.36, 0.36]} color={yellow} />
      <VoxelBox position={[-0.1, 0.4, 0.39]} size={[0.08, 0.08, 0.02]} color={black} />
      <VoxelBox position={[0.1, 0.4, 0.39]} size={[0.08, 0.08, 0.02]} color={black} />
      <VoxelBox position={[-0.09, 0.6, 0.16]} size={[0.05, 0.16, 0.05]} color={black} />
      <VoxelBox position={[0.09, 0.6, 0.16]} size={[0.05, 0.16, 0.05]} color={black} />
      <VoxelBox position={[0, 0.34, -0.02]} size={[0.34, 0.3, 0.34]} color={yellow} />
      <VoxelBox position={[0, 0.34, -0.02]} size={[0.36, 0.1, 0.36]} color={black} />
      <VoxelBox position={[0, 0.32, -0.24]} size={[0.32, 0.28, 0.2]} color={yellow} />
      <VoxelBox position={[0, 0.32, -0.34]} size={[0.32, 0.1, 0.22]} color={black} />
      <VoxelBox position={[0, 0.32, -0.44]} size={[0.3, 0.24, 0.18]} color={yellow} />
      <VoxelBox position={[0, 0.32, -0.52]} size={[0.3, 0.1, 0.18]} color={black} />
      <VoxelBox position={[0, 0.3, -0.6]} size={[0.26, 0.2, 0.14]} color={yellow} />
      <VoxelBox position={[0, 0.28, -0.66]} size={[0.22, 0.1, 0.12]} color={black} />
      <VoxelBox position={[0, 0.26, -0.74]} size={[0.06, 0.06, 0.1]} color={black} />
      <group position={[0, 0.38, -0.02]}>
        <mesh position={[-0.34, 0, 0.02]} rotation={[0.15, 0.1, 0.35]}>
          <boxGeometry args={[0.58, 0.025, 0.46]} />
          {wingMat}
        </mesh>
        <mesh position={[0.34, 0, 0.02]} rotation={[0.15, -0.1, -0.35]}>
          <boxGeometry args={[0.58, 0.025, 0.46]} />
          {wingMat}
        </mesh>
      </group>
    </group>
  );
}

function ZombieModel({ animated, scale = 1 }: { animated?: boolean; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const { skin, shirt, pants, hair, eye } = MC.zombie;

  useFrame(() => {
    if (!ref.current || !animated) return;
    ref.current.rotation.z = Math.sin(Date.now() * 0.002) * 0.05;
    ref.current.position.y = Math.abs(Math.sin(Date.now() * 0.004)) * 0.08;
  });

  return (
    <group ref={ref} scale={scale}>
      <VoxelBox position={[0, 1.35, 0]} size={[0.55, 0.55, 0.55]} color={skin} />
      <VoxelBox position={[0, 1.52, 0]} size={[0.57, 0.12, 0.57]} color={hair} />
      <VoxelBox position={[-0.12, 1.38, 0.28]} size={[0.1, 0.08, 0.02]} color={eye} />
      <VoxelBox position={[0.12, 1.38, 0.28]} size={[0.1, 0.08, 0.02]} color={eye} />
      <VoxelBox position={[0, 1.22, 0.28]} size={[0.08, 0.06, 0.02]} color={skin} />
      <VoxelBox position={[0, 0.65, 0]} size={[0.55, 0.7, 0.3]} color={shirt} />
      <VoxelBox position={[-0.42, 0.65, 0]} size={[0.22, 0.65, 0.22]} color={shirt} />
      <VoxelBox position={[0.42, 0.65, 0]} size={[0.22, 0.65, 0.22]} color={shirt} />
      <VoxelBox position={[-0.14, 0.22, 0]} size={[0.22, 0.44, 0.22]} color={pants} />
      <VoxelBox position={[0.14, 0.22, 0]} size={[0.22, 0.44, 0.22]} color={pants} />
    </group>
  );
}

function EndermanModel({ animated, scale = 1 }: { animated?: boolean; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const { body, eye } = MC.enderman;

  useFrame(() => {
    if (!ref.current || !animated) return;
    ref.current.position.y = Math.sin(Date.now() * 0.002) * 0.12;
  });

  return (
    <group ref={ref} scale={scale}>
      <VoxelBox position={[0, 1.25, 0]} size={[0.42, 2.2, 0.28]} color={body} />
      <VoxelBox position={[-0.55, 1.05, 0]} size={[0.18, 2.6, 0.18]} color={body} />
      <VoxelBox position={[0.55, 1.05, 0]} size={[0.18, 2.6, 0.18]} color={body} />
      <VoxelBox position={[-0.14, 0.35, 0]} size={[0.18, 0.7, 0.18]} color={body} />
      <VoxelBox position={[0.14, 0.35, 0]} size={[0.18, 0.7, 0.18]} color={body} />
      <VoxelBox position={[0, 2.55, 0]} size={[0.5, 0.5, 0.5]} color={body} />
      <VoxelBox
        position={[-0.12, 2.58, 0.26]}
        size={[0.14, 0.06, 0.02]}
        color={eye}
        emissive={eye}
        emissiveIntensity={1.2}
      />
      <VoxelBox
        position={[0.12, 2.58, 0.26]}
        size={[0.14, 0.06, 0.02]}
        color={eye}
        emissive={eye}
        emissiveIntensity={1.2}
      />
    </group>
  );
}

export function MonsterModel({ type, animated = true, position = [0, 0, 0], scale }: MonsterModelProps) {
  const resolvedType = ((type as string) === 'skeleton' ? 'bee' : type) as MonsterType;
  const config = MONSTER_CONFIGS[resolvedType];
  const s = scale ?? config.scale;

  const models: Record<MonsterType, ReactNode> = {
    creeper: <CreeperModel animated={animated} scale={s} />,
    bee: <BeeModel animated={animated} scale={s} />,
    zombie: <ZombieModel animated={animated} scale={s} />,
    enderman: <EndermanModel animated={animated} scale={s} />,
  };

  return <group position={position}>{models[resolvedType]}</group>;
}
