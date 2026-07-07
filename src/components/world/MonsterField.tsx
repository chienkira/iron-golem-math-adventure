import { ThreeEvent } from '@react-three/fiber';
import { useGameStore } from '../../store/gameStore';
import type { Monster, MonsterType } from '../../types/game';
import { MonsterModel } from '../models/Monsters';
import { MonsterCoinLabel } from './WorldFeatures';
import { WanderGroup } from './WanderGroup';

interface MapMonsterProps {
  monster: Monster;
}

const MONSTER_WANDER: Record<
  MonsterType,
  { speed: number; radius: number; hop?: boolean }
> = {
  creeper: { speed: 1.0, radius: 5 },
  bee: { speed: 1.3, radius: 4, hop: true },
  zombie: { speed: 0.85, radius: 5 },
  enderman: { speed: 1.2, radius: 6 },
};

const FIGHT_PHASES = new Set(['vs-intro', 'combat', 'victory', 'level-up']);

function MapMonster({ monster }: MapMonsterProps) {
  const phase = useGameStore((s) => s.phase);
  const startCombat = useGameStore((s) => s.startCombat);
  const paused = phase !== 'explore';
  const wander = MONSTER_WANDER[monster.type];

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (phase === 'explore') {
      startCombat(monster);
    }
  };

  return (
    <WanderGroup
      spawn={monster.position}
      speed={wander.speed}
      radius={wander.radius}
      hop={wander.hop}
      paused={paused}
    >
      <group
        onPointerDown={handlePointerDown}
        onPointerOver={() => {
          if (phase === 'explore') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <MonsterModel type={monster.type} animated={false} />
        <MonsterCoinLabel type={monster.type} />
        <mesh visible={false}>
          <cylinderGeometry args={[1.4, 1.4, 3.5, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </WanderGroup>
  );
}

export function MonsterField() {
  const monsters = useGameStore((s) => s.monsters);
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'explore' && phase !== 'menu' && !FIGHT_PHASES.has(phase)) return null;

  return (
    <group>
      {monsters.map((m) => (
        <MapMonster key={m.id} monster={m} />
      ))}
    </group>
  );
}
