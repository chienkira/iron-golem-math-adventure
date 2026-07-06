import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { sounds } from '../../audio/sounds';

export function GameAudio() {
  const phase = useGameStore((s) => s.phase);
  const prevPhase = useRef(phase);

  useEffect(() => {
    const prev = prevPhase.current;
    if (prev === phase) return;
    prevPhase.current = phase;

    if (phase === 'explore' && prev === 'menu') {
      sounds.play('gameStart');
    } else if (phase === 'vs-intro') {
      sounds.play('vs');
    } else if (phase === 'combat' && prev === 'vs-intro') {
      sounds.play('combatStart');
    } else if (phase === 'victory') {
      sounds.play('victory');
      sounds.play('coin');
    } else if (phase === 'level-up') {
      sounds.play('levelUp');
      sounds.play('coin');
    }
  }, [phase]);

  return null;
}
