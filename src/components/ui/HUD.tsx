import { useGameStore } from '../../store/gameStore';
import { COINS_PER_LEVEL } from '../../types/game';
import { useT } from '../../i18n';
import styles from './HUD.module.css';

export function HUD() {
  const t = useT();
  const phase = useGameStore((s) => s.phase);
  const coinsInLevel = useGameStore((s) => s.coinsInLevel);
  const level = useGameStore((s) => s.level);

  if (phase !== 'explore') return null;

  const progress = (coinsInLevel / COINS_PER_LEVEL) * 100;

  return (
    <div className={styles.hud}>
      <div className={styles.hudLeft}>
        <div className={styles.statBox}>
          <span className={styles.label}>{t.hud.level(level)}</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          <span className={styles.progressText}>
            {t.hud.coinsProgress(coinsInLevel, COINS_PER_LEVEL)}
          </span>
        </div>
      </div>
    </div>
  );
}
