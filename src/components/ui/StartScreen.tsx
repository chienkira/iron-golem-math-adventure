import { useGameStore } from '../../store/gameStore';
import { COINS_PER_LEVEL } from '../../types/game';
import { sounds } from '../../audio/sounds';
import { requestGameFullscreen } from '../../utils/fullscreen';
import { vi } from '../../i18n/vi';
import styles from './StartScreen.module.css';

export function StartScreen() {
  const phase = useGameStore((s) => s.phase);
  const level = useGameStore((s) => s.level);
  const coinsInLevel = useGameStore((s) => s.coinsInLevel);
  const startGame = useGameStore((s) => s.startGame);
  const resetProgress = useGameStore((s) => s.resetProgress);

  if (phase !== 'menu') return null;

  const handleStart = () => {
    requestGameFullscreen();
    sounds.init();
    startGame();
  };

  const handleReset = () => {
    resetProgress();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h1 className={styles.title}>{vi.gameTitle}</h1>
        <p className={styles.subtitle}>{vi.gameSubtitle}</p>
        <p className={styles.tagline}>{vi.tagline}</p>

        <div className={styles.actions}>
          <button className={styles.playBtn} onClick={handleStart} type="button">
            {vi.start.play}
          </button>

          <p className={styles.progress}>
            {vi.start.progress(level, coinsInLevel, COINS_PER_LEVEL)}
          </p>

          <button className={styles.resetBtn} onClick={handleReset} type="button">
            {vi.start.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
