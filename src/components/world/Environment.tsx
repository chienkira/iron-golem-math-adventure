import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { GROUND_SIZE } from '../../constants/map';
import { WanderGroup } from './WanderGroup';
import {
  Cloud,
  RainField,
  WaterPatch,
  LavaPatch,
  cloudPositions,
  waterPatches,
  lavaPatches,
} from './WorldFeatures';

const LOG_OAK = '#6d4c41';
const LOG_BIRCH = '#d7ccc8';
const LEAF_PALETTE = ['#48b518', '#3d9e14', '#59a018', '#2e7d32'];

type TreeVariant = 'medium' | 'short';

function hash01(x: number, z: number): number {
  const h = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

function getTreeVariant(x: number, z: number): TreeVariant {
  return hash01(x, z) < 0.5 ? 'short' : 'medium';
}

function TreeBlock({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.94} />
    </mesh>
  );
}

function addCrossLayer(blocks: [number, number, number][], y: number) {
  blocks.push([0, y, 0], [-1, y, 0], [1, y, 0], [0, y, -1], [0, y, 1]);
}

function addSquareLayer(blocks: [number, number, number][], y: number, radius: number) {
  for (let x = -radius; x <= radius; x++) {
    for (let z = -radius; z <= radius; z++) {
      blocks.push([x, y, z]);
    }
  }
}

function buildTreeBlocks(variant: TreeVariant): {
  trunk: [number, number, number][];
  leaves: [number, number, number][];
} {
  const trunk: [number, number, number][] = [];
  const leaves: [number, number, number][] = [];

  if (variant === 'short') {
    for (let y = 0; y < 3; y++) trunk.push([0, y, 0]);
    addSquareLayer(leaves, 3, 1);
    addCrossLayer(leaves, 4);
    return { trunk, leaves };
  }

  if (variant === 'medium') {
    for (let y = 0; y < 5; y++) trunk.push([0, y, 0]);
    addCrossLayer(leaves, 4);
    addCrossLayer(leaves, 5);
    leaves.push([0, 6, 0]);
  }

  return { trunk, leaves };
}

function Tree({ position }: { position: [number, number, number] }) {
  const variant = useMemo(
    () => getTreeVariant(position[0], position[2]),
    [position],
  );
  const leafColor = useMemo(
    () => LEAF_PALETTE[Math.floor(hash01(position[0] + 50, position[2]) * LEAF_PALETTE.length)],
    [position],
  );
  const logColor = useMemo(
    () => (hash01(position[2], position[0]) > 0.82 ? LOG_BIRCH : LOG_OAK),
    [position],
  );
  const { trunk, leaves } = useMemo(() => buildTreeBlocks(variant), [variant]);

  return (
    <group position={position}>
      {trunk.map(([x, y, z], i) => (
        <TreeBlock key={`t-${i}`} position={[x, y + 0.5, z]} color={logColor} />
      ))}
      {leaves.map(([x, y, z], i) => (
        <TreeBlock key={`l-${i}`} position={[x, y + 0.5, z]} color={leafColor} />
      ))}
    </group>
  );
}

function Dog({ position }: { position: [number, number, number] }) {
  const fur = '#8d6e63';
  const furDark = '#6d4c41';

  return (
    <WanderGroup spawn={position} speed={1.6} radius={7}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.55, 0.35, 0.85]} />
        <meshStandardMaterial color={fur} />
      </mesh>
      <mesh position={[0, 0.45, 0.45]}>
        <boxGeometry args={[0.4, 0.38, 0.4]} />
        <meshStandardMaterial color={fur} />
      </mesh>
      <mesh position={[-0.12, 0.62, 0.55]}>
        <boxGeometry args={[0.12, 0.18, 0.1]} />
        <meshStandardMaterial color={furDark} />
      </mesh>
      <mesh position={[0.12, 0.62, 0.55]}>
        <boxGeometry args={[0.12, 0.18, 0.1]} />
        <meshStandardMaterial color={furDark} />
      </mesh>
      <mesh position={[0, 0.48, 0.68]}>
        <boxGeometry args={[0.12, 0.1, 0.08]} />
        <meshStandardMaterial color={furDark} />
      </mesh>
      {[[-0.2, 0.12, 0.25], [0.2, 0.12, 0.25], [-0.2, 0.12, -0.25], [0.2, 0.12, -0.25]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.12, 0.24, 0.12]} />
          <meshStandardMaterial color={furDark} />
        </mesh>
      ))}
      <mesh position={[0, 0.35, -0.5]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[0.1, 0.35, 0.1]} />
        <meshStandardMaterial color={fur} />
      </mesh>
    </WanderGroup>
  );
}

function Pig({ position }: { position: [number, number, number] }) {
  const pink = '#f8bbd0';
  const pinkDark = '#f48fb1';

  return (
    <WanderGroup spawn={position} speed={1.0} radius={5}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.65, 0.45, 0.9]} />
        <meshStandardMaterial color={pink} />
      </mesh>
      <mesh position={[0, 0.38, 0.5]}>
        <boxGeometry args={[0.45, 0.4, 0.35]} />
        <meshStandardMaterial color={pink} />
      </mesh>
      <mesh position={[0, 0.35, 0.72]}>
        <boxGeometry args={[0.2, 0.15, 0.12]} />
        <meshStandardMaterial color={pinkDark} />
      </mesh>
      <mesh position={[-0.08, 0.38, 0.76]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="#880e4f" />
      </mesh>
      <mesh position={[0.08, 0.38, 0.76]}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshStandardMaterial color="#880e4f" />
      </mesh>
      {[[-0.22, 0.1, 0.2], [0.22, 0.1, 0.2], [-0.22, 0.1, -0.2], [0.22, 0.1, -0.2]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.14, 0.2, 0.14]} />
          <meshStandardMaterial color={pinkDark} />
        </mesh>
      ))}
      <mesh position={[0, 0.42, -0.52]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color={pinkDark} />
      </mesh>
    </WanderGroup>
  );
}

function Bunny({ position }: { position: [number, number, number] }) {
  return (
    <WanderGroup spawn={position} speed={1.3} radius={5} hop>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.35, 0.3, 0.5]} />
        <meshStandardMaterial color="#efebe9" />
      </mesh>
      <mesh position={[0, 0.45, 0.15]}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#efebe9" />
      </mesh>
      <mesh position={[-0.08, 0.65, 0.15]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#efebe9" />
      </mesh>
      <mesh position={[0.08, 0.65, 0.15]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#efebe9" />
      </mesh>
    </WanderGroup>
  );
}

const treePositions: [number, number, number][] = [
  [-16, 0, -12], [20, 0, -16], [-24, 0, 10], [12, 0, 20], [-10, 0, 24],
  [28, 0, 6], [-30, 0, -20], [16, 0, -28], [-20, 0, 16], [24, 0, 24],
  [-36, 0, 0], [36, 0, -10], [0, 0, -36], [-6, 0, 32], [32, 0, 16],
  [-28, 0, -28], [28, 0, 28], [-14, 0, 30], [18, 0, -22], [-22, 0, 18],
  [8, 0, 34], [-34, 0, 14], [22, 0, -30], [-8, 0, -32], [34, 0, -18],
  [-18, 0, -34], [14, 0, 14], [-32, 0, 28], [30, 0, 22], [-12, 0, -24],
];

export function Environment() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE, 48, 48]} />
        <meshStandardMaterial color="#5d8a3c" roughness={0.95} />
      </mesh>

      {Array.from({ length: 50 }, (_, i) => (
        <mesh
          key={`grass-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[(Math.random() - 0.5) * 90, 0.01, (Math.random() - 0.5) * 90]}
        >
          <circleGeometry args={[1 + Math.random() * 2.5, 8]} />
          <meshStandardMaterial color="#6b9b4a" roughness={0.9} />
        </mesh>
      ))}

      {waterPatches.map(({ pos, size }, i) => (
        <WaterPatch key={`water-${i}`} position={pos} size={size} />
      ))}

      {lavaPatches.map(({ pos, size }, i) => (
        <LavaPatch key={`lava-${i}`} position={pos} size={size} />
      ))}

      {treePositions.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}

      <Dog position={[12, 0, -14]} />
      <Dog position={[-28, 0, 8]} />
      <Dog position={[20, 0, 22]} />

      <Pig position={[-18, 0, 16]} />
      <Pig position={[24, 0, -20]} />
      <Pig position={[-10, 0, -28]} />
      <Pig position={[30, 0, 10]} />

      <Bunny position={[-8, 0, 10]} />
      <Bunny position={[20, 0, -8]} />
      <Bunny position={[-22, 0, -12]} />

      <RainField />

      {cloudPositions.map((pos, i) => (
        <Cloud key={`cloud-${i}`} position={pos} />
      ))}
    </group>
  );
}

const COMBAT_TORCH_COUNT = 6;
const COMBAT_TORCH_ARC_RADIUS = 6.5;
const COMBAT_TORCH_ARC_CENTER_Z = -1.5;

function getCombatTorchPositions(): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let i = 0; i < COMBAT_TORCH_COUNT; i++) {
    const t = i / (COMBAT_TORCH_COUNT - 1);
    const angle = Math.PI * 0.22 + t * Math.PI * 0.56;
    positions.push([
      Math.cos(angle) * COMBAT_TORCH_ARC_RADIUS,
      0,
      COMBAT_TORCH_ARC_CENTER_Z + Math.sin(angle) * COMBAT_TORCH_ARC_RADIUS,
    ]);
  }
  return positions;
}

const COMBAT_TORCH_POSITIONS = getCombatTorchPositions();

export function ArenaEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#3a6644" roughness={0.95} />
      </mesh>
      {COMBAT_TORCH_POSITIONS.map((pos, i) => (
        <CombatTorch key={`combat-torch-${i}`} position={pos} />
      ))}
    </group>
  );
}

function CombatTorch({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    if (!lightRef.current) return;
    const t = Date.now() * 0.009;
    lightRef.current.intensity = 4.2 + Math.sin(t) * 0.45 + Math.sin(t * 2.7) * 0.2;
  });

  return (
    <group position={position}>
      {/* Minecraft ground torch: short stick + blocky flame */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.4, 0.14]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color="#ff8f00"
          emissive="#e65100"
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial
          color="#ffca28"
          emissive="#ff6f00"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 0.55, 0]}
        color="#ff9a56"
        intensity={3.8}
        distance={14}
        decay={2}
        castShadow
        shadow-mapSize={[512, 512]}
      />
    </group>
  );
}
