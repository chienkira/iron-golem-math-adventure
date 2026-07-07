import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { GamePhase } from '../../types/game';
import { sounds } from '../../audio/sounds';

const COMBAT_FLOW: ReadonlySet<GamePhase> = new Set([
  'vs-intro',
  'combat',
  'victory',
  'level-up',
]);

export function GameAudio() {
  const phase = useGameStore((s) => s.phase);
  const prevPhase = useRef(phase);

  useEffect(() => {
    const prev = prevPhase.current;
    if (prev === phase) return;
    prevPhase.current = phase;

    if (phase === 'explore' && prev === 'menu') {
      sounds.init();
      sounds.startExploreBgm();
    }

    if (phase === 'menu') {
      sounds.stopCombatBgm();
      sounds.stopExploreBgm();
      return;
    }

    sounds.init();

    if (phase === 'vs-intro' && prev === 'explore') {
      sounds.play('vsIntro');
    }

    if (phase === 'combat' && prev === 'vs-intro') {
      sounds.startCombatBgm();
    }

    if (phase === 'explore' && COMBAT_FLOW.has(prev)) {
      sounds.stopCombatBgm();
    }
  }, [phase]);

  return null;
}
