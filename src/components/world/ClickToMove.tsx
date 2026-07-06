import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { GROUND_SIZE, MAP_BOUND } from '../../constants/map';
import { sounds } from '../../audio/sounds';

function DestinationMarker({ x, z }: { x: number; z: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 2;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
    }
    if (pulseRef.current) {
      const s = 1 + (t % 1) * 0.5;
      pulseRef.current.scale.setScalar(s);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 1 - (t % 1);
    }
  });

  return (
    <group position={[x, 0.05, z]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.65, 24]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.55, 24]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export function ClickToMove() {
  const phase = useGameStore((s) => s.phase);
  const moveTarget = useGameStore((s) => s.moveTarget);
  const setMoveTarget = useGameStore((s) => s.setMoveTarget);

  if (phase !== 'explore') return null;

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          const x = THREE.MathUtils.clamp(e.point.x, -MAP_BOUND, MAP_BOUND);
          const z = THREE.MathUtils.clamp(e.point.z, -MAP_BOUND, MAP_BOUND);
          sounds.play('move');
          setMoveTarget([x, z]);
        }}
      >
        <planeGeometry args={[GROUND_SIZE, GROUND_SIZE]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {moveTarget && <DestinationMarker x={moveTarget[0]} z={moveTarget[1]} />}
    </group>
  );
}
