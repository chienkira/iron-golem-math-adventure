import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';
import styles from './MoveHint.module.css';

export function MoveHint() {
  const t = useT();
  const phase = useGameStore((s) => s.phase);

  if (phase !== 'explore') return null;

  return (
    <div className={styles.hint}>
      {t.moveHint}
    </div>
  );
}
