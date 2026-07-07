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

function Tree({ position }: { position: [number, number, number] }) {
  const leavesRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (leavesRef.current) {
      leavesRef.current.rotation.z = Math.sin(Date.now() * 0.001 + position[0]) * 0.03;
    }
  });

  const trunkColor = '#6d4c41';
  const leafColor = useMemo(() => {
    const colors = ['#2e7d32', '#388e3c', '#43a047', '#1b5e20'];
    return colors[Math.floor(Math.abs(position[0] * position[2]) % colors.length)];
  }, [position]);

  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[0.6, 2, 0.6]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      <group ref={leavesRef} position={[0, 2.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.2, 1.8, 2.2]} />
          <meshStandardMaterial color={leafColor} roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.6, 1.2, 1.6]} />
          <meshStandardMaterial color={leafColor} roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function Flower({ position }: { position: [number, number, number] }) {
  const colors = ['#e91e63', '#ff9800', '#ffeb3b', '#9c27b0', '#03a9f4'];
  const color = colors[Math.floor(Math.abs(position[0] * 7 + position[2] * 3) % colors.length)];

  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.2]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function Rock({ position }: { position: [number, number, number] }) {
  const scale = 0.3 + Math.abs(position[0] % 1) * 0.5;
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#78909c" roughness={0.95} />
    </mesh>
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

const flowerPositions: [number, number, number][] = Array.from({ length: 40 }, (_, i) => [
  Math.sin(i * 2.1) * 36,
  0,
  Math.cos(i * 1.7) * 36,
] as [number, number, number]);

const rockPositions: [number, number, number][] = [
  [-8, 0.2, -6], [14, 0.2, 10], [-18, 0.2, -4], [6, 0.2, -20], [22, 0.2, -8],
  [-14, 0.2, 16], [10, 0.2, 22], [-26, 0.2, 8], [18, 0.2, -14], [-6, 0.2, 28],
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

      {flowerPositions.map((pos, i) => (
        <Flower key={`flower-${i}`} position={pos} />
      ))}

      {rockPositions.map((pos, i) => (
        <Rock key={`rock-${i}`} position={pos} />
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

export function ArenaEnvironment({ dark = false }: { dark?: boolean }) {
  const groundColor = dark ? '#3a6644' : '#6b9b4a';

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={groundColor} roughness={0.95} />
      </mesh>
      {dark &&
        COMBAT_TORCH_POSITIONS.map((pos, i) => (
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
