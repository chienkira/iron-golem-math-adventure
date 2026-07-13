import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';
import styles from './ExitButton.module.css';

export function ExitButton() {
  const t = useT();
  const phase = useGameStore((s) => s.phase);
  const exitToMenu = useGameStore((s) => s.exitToMenu);
  const exitCombat = useGameStore((s) => s.exitCombat);

  if (phase === 'explore') {
    return (
      <button className={styles.btn} onClick={exitToMenu} type="button">
        ✕ {t.common.exit}
      </button>
    );
  }

  if (phase === 'combat') {
    return (
      <button className={styles.btn} onClick={exitCombat} type="button">
        ✕ {t.common.exit}
      </button>
    );
  }

  return null;
}
