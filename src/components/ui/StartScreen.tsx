import { useGameStore } from '../../store/gameStore';
import { COINS_PER_LEVEL } from '../../types/game';
import type { GameSubject } from '../../types/reading';
import { sounds } from '../../audio/sounds';
import { requestGameFullscreen } from '../../utils/fullscreen';
import { getSubtitle, getTagline, vi } from '../../i18n/vi';
import styles from './StartScreen.module.css';

const SUBJECTS: GameSubject[] = ['math', 'reading'];

export function StartScreen() {
  const phase = useGameStore((s) => s.phase);
  const level = useGameStore((s) => s.level);
  const coinsInLevel = useGameStore((s) => s.coinsInLevel);
  const subject = useGameStore((s) => s.subject);
  const startGame = useGameStore((s) => s.startGame);
  const resetProgress = useGameStore((s) => s.resetProgress);
  const setSubject = useGameStore((s) => s.setSubject);

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
        <p className={styles.subtitle}>{getSubtitle(subject)}</p>
        <p className={styles.tagline}>{getTagline(subject)}</p>

        <div className={styles.subjectToggle}>
          {SUBJECTS.map((value) => (
            <button
              key={value}
              className={`${styles.subjectBtn} ${subject === value ? styles.subjectBtnActive : ''}`}
              onClick={() => setSubject(value)}
              type="button"
            >
              {vi.subjects[value]}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.playBtn} onClick={handleStart} type="button">
            {vi.start.play}
          </button>

          <div className={styles.footerRow}>
            <span className={styles.progressLabel}>
              {vi.start.progress(level, coinsInLevel, COINS_PER_LEVEL)}
            </span>
            <button className={styles.resetBtn} onClick={handleReset} type="button">
              {vi.start.reset}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
