import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../../store/gameStore';
import { MONSTER_CONFIGS, type MonsterType } from '../../types/game';
import { IronGolem } from '../models/IronGolem';
import { MonsterModel } from '../models/Monsters';
import { ArenaEnvironment } from '../world/Environment';
import { Explosion } from '../effects/Particles';
import { StormSky, LightningFlash } from '../effects/StormEffects';
import { CinematicFrame } from './CinematicFrame';
import { sounds } from '../../audio/sounds';
import { vi } from '../../i18n/vi';
import styles from './CombatUI.module.css';

const VICTORY_DISPLAY_MS = 3500;
const FIGHTER_X = 6;

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

    const targetZ = attacking ? 14 : 16;
    const baseZ = THREE.MathUtils.lerp(28, targetZ, introEase);
    const baseY = THREE.MathUtils.lerp(5.8, 4.8, introEase);
    const fov = THREE.MathUtils.lerp(44, 38, introEase);
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

function AnimatedFighter({
  side,
  type,
  level,
  attacking,
}: {
  side: 'left' | 'right';
  type?: MonsterType;
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
      ref.current.position.x = -FIGHTER_X + Math.sin(Date.now() * 0.012) * 0.6;
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

  return (
    <group ref={ref} position={[side === 'left' ? -FIGHTER_X : FIGHTER_X, 0, 0]}>
      {side === 'left' ? (
        <IronGolem level={level} scale={1} useLevelScale={false} animated rotation={0.35} />
      ) : type ? (
        <MonsterModel
          type={type}
          animated
          scale={(MONSTER_CONFIGS[type]?.scale ?? 1) * 1.4}
        />
      ) : null}
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
  const finishRewardScreen = useGameStore((s) => s.finishRewardScreen);

  const [attacking, setAttacking] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [wrongShake, setWrongShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const [combatIntroKey, setCombatIntroKey] = useState(0);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (phase === 'combat') {
      setCombatIntroKey((k) => k + 1);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'victory' || phase === 'level-up') {
      setAttacking(true);
      setShowExplosion(true);
      setFlash(true);
      setShowReward(false);

      const rewardTimer = window.setTimeout(() => setShowReward(true), 450);
      const finishTimer = window.setTimeout(() => {
        finishRewardScreen();
        setAttacking(false);
        setShowExplosion(false);
        setFlash(false);
        setShowReward(false);
      }, VICTORY_DISPLAY_MS);

      return () => {
        window.clearTimeout(rewardTimer);
        window.clearTimeout(finishTimer);
      };
    }

    setShowReward(false);
  }, [phase, finishRewardScreen]);

  const handleSubmit = () => {
    const correct = submitAnswer();
    if (correct) {
      sounds.play('answerCorrect');
    } else if (userAnswer !== '') {
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
    }
  };

  if (phase !== 'combat' && phase !== 'victory' && phase !== 'level-up') return null;
  if (!activeMonster || !question) return null;

  const opSymbol = question.operator === '+' ? '+' : '−';
  const digits: { key: string; label: string }[] = [
    ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => ({ key, label: key })),
    { key: 'C', label: vi.combat.clear },
    { key: '0', label: '0' },
    { key: '✓', label: vi.combat.submit },
  ];

  return (
    <CinematicFrame flash={flash && (phase === 'victory' || phase === 'level-up')}>
      <div className={styles.overlay}>
        <div className={`${styles.sceneBg} ${phase === 'combat' ? styles.sceneEnter : ''}`} key={combatIntroKey}>
          <Canvas shadows camera={{ position: [0, 5.8, 28], fov: 44 }}>
            <color attach="background" args={['#526580']} />
            <fog attach="fog" args={['#607892', 26, 58]} />
            <CombatCamera introKey={combatIntroKey} attacking={attacking} />
            <ambientLight intensity={0.58} />
            <directionalLight position={[5, 12, 8]} intensity={0.78} color="#c8d8ea" castShadow />
            <hemisphereLight args={['#7a92aa', '#3d5a42', 0.65]} />
            <LightningFlash />
            <StormSky />

            <ArenaEnvironment dark />
            <AnimatedFighter
              side="left"
              level={level}
              attacking={attacking}
            />
            <AnimatedFighter
              side="right"
              type={activeMonster.type}
              level={level}
              attacking={attacking}
            />

            {showExplosion && (
              <Explosion position={[FIGHTER_X, 0, 0]} onComplete={() => setShowExplosion(false)} />
            )}
          </Canvas>
        </div>

        <div className={styles.topHud}>
          <span className={styles.vsBadge}>{vi.combat.battle}</span>
        </div>

        {phase === 'combat' && (
          <>
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
                        clearAnswer();
                      } else if (key === '✓') {
                        handleSubmit();
                      } else {
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
          </>
        )}

        {showReward && (phase === 'victory' || phase === 'level-up') && (
          <div className={styles.rewardOverlay}>
            <div className={styles.rewardCenter}>{vi.combat.reward(lastReward)}</div>
            {phase === 'level-up' && (
              <div className={styles.levelUpSub}>{vi.combat.levelUp(level)}</div>
            )}
          </div>
        )}
      </div>
    </CinematicFrame>
  );
}
