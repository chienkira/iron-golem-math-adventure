import { useGameStore } from '../../store/gameStore';
import { ExitButton } from './ExitButton';

export function GameExitButton() {
  const phase = useGameStore((s) => s.phase);
  const exitToMenu = useGameStore((s) => s.exitToMenu);
  const exitCombat = useGameStore((s) => s.exitCombat);

  if (phase === 'explore') {
    return <ExitButton onClick={exitToMenu} />;
  }

  if (phase === 'combat') {
    return <ExitButton onClick={exitCombat} />;
  }

  return null;
}
