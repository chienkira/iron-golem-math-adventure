import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { MONSTER_CONFIGS, type MonsterType } from '../../types/game';
import { IronGolem } from '../models/IronGolem';
import { MonsterModel } from '../models/Monsters';
import { ArenaEnvironment } from '../world/Environment';
import { Explosion } from '../effects/Particles';
import { StormSky, LightningFlash } from '../effects/StormEffects';
import { CinematicFrame } from './CinematicFrame';
import { vi } from '../../i18n/vi';
import { sounds } from '../../audio/sounds';
import styles from './CombatUI.module.css';

const VICTORY_DISPLAY_MS = 5200;

function CombatCamera({ attacking, introKey }: { attacking: boolean; introKey: number }) {
  const startTime = useRef(Date.now());
  const introStart = useRef(Date.now());

  useEffect(() => {
    introStart.current = Date.now();
    startTime.current = Date.now();
  }, [introKey]);

  useFrame(({ camera }) => {
    const t = (Date.now() - startTime.current) / 1000;
    const introElapsed = (Date.now() - introStart.current) / 1000;
    const introT = Math.min(introElapsed / 0.85, 1);
    const introEase = 1 - Math.pow(1 - introT, 3);

    const targetZ = attacking ? 17 : 20;
    const baseZ = THREE.MathUtils.lerp(32, targetZ, introEase);
    const baseY = THREE.MathUtils.lerp(6.5, 5.5, introEase);
    const fov = THREE.MathUtils.lerp(48, 42, introEase);
    const sway = introT >= 1 ? Math.sin(t * 0.4) * 0.12 : 0;

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    camera.position.set(sway, baseY, baseZ);
    camera.lookAt(0, 1.5, 0);
  });

  return null;
}

function getPlayerLabelY(level: number): number {
  const levelScale = 1 + (level - 1) * 0.08;
  return 2.85 * 1.4 * levelScale + 0.25;
}

function getMonsterLabelY(type: MonsterType): number {
  const scale = (MONSTER_CONFIGS[type]?.scale ?? 1) * 1.4;
  const modelTop: Record<MonsterType, number> = {
    creeper: 1.5,
    bee: 1.35,
    zombie: 1.5,
    enderman: 2.75,
  };
  return modelTop[type] * scale + 0.25;
}

function FighterNameLabel({
  name,
  y,
  variant,
}: {
  name: string;
  y: number;
  variant: 'player' | 'monster';
}) {
  return (
    <Html
      position={[0, y, 0]}
      center
      distanceFactor={10}
      zIndexRange={[50, 0]}
      style={{ pointerEvents: 'none', userSelect: 'none' }}
    >
      <div className={`${styles.headName} ${variant === 'player' ? styles.headNamePlayer : styles.headNameMonster}`}>
        {name}
      </div>
    </Html>
  );
}

function AnimatedFighter({
  side,
  type,
  name,
  level,
  attacking,
}: {
  side: 'left' | 'right';
  type?: MonsterType;
  name: string;
  level: number;
  attacking: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  const defeatStart = useRef<number | null>(null);
  const goneRef = useRef(false);
  const [monsterGone, setMonsterGone] = useState(false);

  useEffect(() => {
    if (attacking && side === 'right') {
      defeatStart.current = Date.now();
      goneRef.current = false;
      setMonsterGone(false);
      return;
    }
    defeatStart.current = null;
    goneRef.current = false;
    setMonsterGone(false);
  }, [attacking, side]);

  useFrame(() => {
    if (!ref.current) return;
    const t = Date.now() * 0.002;
    ref.current.position.y = Math.sin(t) * 0.06;

    if (attacking && side === 'left') {
      ref.current.rotation.z = Math.sin(Date.now() * 0.018) * 0.2;
      ref.current.position.x = -4.5 + Math.sin(Date.now() * 0.012) * 0.6;
    } else if (attacking && side === 'right') {
      if (monsterGone) return;
      const start = defeatStart.current ?? Date.now();
      defeatStart.current = start;
      const elapsed = Date.now() - start;
      const duration = 650;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      ref.current.scale.setScalar(Math.max(0, 1 - eased));
      ref.current.position.y = Math.sin(t) * 0.06 - eased * 0.4;
      if (progress >= 1 && !goneRef.current) {
        goneRef.current = true;
        setMonsterGone(true);
      }
    } else {
      ref.current.scale.setScalar(1);
      ref.current.rotation.y = Math.sin(t * 0.5) * 0.12 * (side === 'left' ? 1 : -1);
    }
  });

  if (side === 'right' && monsterGone) return null;

  const labelY =
    side === 'left' ? getPlayerLabelY(level) : type ? getMonsterLabelY(type) : 2.5;

  return (
    <group ref={ref} position={[side === 'left' ? -4.5 : 4.5, 0, 0]}>
      {side === 'left' ? (
        <IronGolem level={level} scale={1.4} animated rotation={0.35} />
      ) : type ? (
        <MonsterModel
          type={type}
          animated
          scale={(MONSTER_CONFIGS[type]?.scale ?? 1) * 1.4}
        />
      ) : null}
      <FighterNameLabel
        name={name}
        y={labelY}
        variant={side === 'left' ? 'player' : 'monster'}
      />
    </group>
  );
}

export function CombatOverlay() {
  const phase = useGameStore((s) => s.phase);
  const activeMonster = useGameStore((s) => s.activeMonster);
  const question = useGameStore((s) => s.question);
  const userAnswer = useGameStore((s) => s.userAnswer);
  const level = useGameStore((s) => s.level);
  const lastReward = useGameStore((s) => s.lastReward);
  const appendDigit = useGameStore((s) => s.appendDigit);
  const clearAnswer = useGameStore((s) => s.clearAnswer);
  const submitAnswer = useGameStore((s) => s.submitAnswer);
  const finishVictory = useGameStore((s) => s.finishVictory);
  const finishLevelUp = useGameStore((s) => s.finishLevelUp);
  const exitCombat = useGameStore((s) => s.exitCombat);
  const addFloatingText = useGameStore((s) => s.addFloatingText);

  const [attacking, setAttacking] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [lightning, setLightning] = useState(false);
  const [combatIntroKey, setCombatIntroKey] = useState(0);

  useEffect(() => {
    if (phase === 'combat') {
      setCombatIntroKey((k) => k + 1);
    }
  }, [phase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLightning(true);
      setTimeout(() => setLightning(false), 150);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'victory' || phase === 'level-up') {
      setAttacking(true);
      setShowExplosion(true);
      setFlash(true);
      addFloatingText(vi.combat.reward(lastReward));
      const timer = setTimeout(() => {
        if (phase === 'level-up') finishLevelUp();
        else finishVictory();
        setAttacking(false);
        setShowExplosion(false);
        setFlash(false);
      }, VICTORY_DISPLAY_MS);
      return () => clearTimeout(timer);
    }
  }, [phase, lastReward, finishVictory, finishLevelUp, addFloatingText]);

  const handleSubmit = () => {
    const correct = submitAnswer();
    if (!correct && userAnswer !== '') {
      sounds.play('wrong');
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
    }
  };

  if (phase !== 'combat' && phase !== 'victory' && phase !== 'level-up') return null;
  if (!activeMonster || !question) return null;

  const config = MONSTER_CONFIGS[activeMonster.type];
  const opSymbol = question.operator === '+' ? '+' : '−';
  const digits: { key: string; label: string }[] = [
    ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => ({ key, label: key })),
    { key: 'C', label: vi.combat.clear },
    { key: '0', label: '0' },
    { key: '✓', label: vi.combat.submit },
  ];

  return (
    <CinematicFrame flash={flash && (phase === 'victory' || phase === 'level-up')} letterbox={false} vignette={false} grain={false}>
      <div className={styles.overlay}>
        {lightning && <div className={styles.lightningFlash} />}

        {phase === 'combat' && (
          <button
            className={styles.skipBtn}
            onClick={() => {
              sounds.play('uiClick');
              exitCombat();
            }}
            type="button"
          >
            ✕ {vi.combat.exit}
          </button>
        )}

        <div className={`${styles.sceneBg} ${phase === 'combat' ? styles.sceneEnter : ''}`} key={combatIntroKey}>
          <Canvas shadows camera={{ position: [0, 6.5, 32], fov: 48 }}>
            <color attach="background" args={['#3d4f63']} />
            <fog attach="fog" args={['#4a5d72', 18, 45]} />
            <CombatCamera introKey={combatIntroKey} attacking={attacking} />
            <ambientLight intensity={0.48} />
            <directionalLight position={[5, 12, 8]} intensity={0.65} color="#b0c4d8" castShadow />
            <hemisphereLight args={['#6a8098', '#2d4530', 0.55]} />
            <LightningFlash />
            <StormSky />

            <ArenaEnvironment dark />
            <AnimatedFighter
              side="left"
              name={vi.combat.playerName}
              level={level}
              attacking={attacking}
            />
            <AnimatedFighter
              side="right"
              name={config.name}
              type={activeMonster.type}
              level={level}
              attacking={attacking}
            />

            {showExplosion && (
              <Explosion position={[5, 0, 0]} onComplete={() => setShowExplosion(false)} />
            )}
          </Canvas>
        </div>

        <div className={styles.topHud}>
          <span className={styles.vsBadge}>{vi.combat.battle}</span>
        </div>

        <div className={styles.questionZone}>
          <div className={`${styles.question} ${wrongShake ? styles.shake : ''}`}>
            {question.a} {opSymbol} {question.b} ={' '}
            <span className={styles.answerInline}>{userAnswer || vi.combat.answerPlaceholder}</span>
          </div>
        </div>

        <div className={styles.combatPanel}>
          <div className={styles.numpad}>
            {digits.map(({ key, label }) => (
              <button
                key={key}
                className={`${styles.numpadBtn} ${key === '✓' ? styles.submitBtn : ''} ${key === 'C' ? styles.clearBtn : ''} ${key === 'C' ? styles.clearLabel : ''}`}
                onClick={() => {
                  if (key === 'C') {
                    sounds.play('uiClick');
                    clearAnswer();
                  } else if (key === '✓') {
                    sounds.play('uiClick');
                    handleSubmit();
                  } else {
                    sounds.play('digit');
                    appendDigit(key);
                  }
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {phase === 'victory' && (
          <div className={styles.victoryBanner}>{vi.combat.reward(lastReward)}</div>
        )}

        {phase === 'level-up' && (
          <div className={styles.levelUpBanner}>{vi.combat.levelUp(level)}</div>
        )}
      </div>
    </CinematicFrame>
  );
}
