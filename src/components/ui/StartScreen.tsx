import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { sounds } from '../../audio/sounds';
import { vi } from '../../i18n/vi';
import styles from './StartScreen.module.css';

export function StartScreen() {
  const phase = useGameStore((s) => s.phase);
  const startGame = useGameStore((s) => s.startGame);
  const [muted, setMuted] = useState(() => sounds.isMuted());

  if (phase !== 'menu') return null;

  const handleStart = () => {
    sounds.init();
    sounds.play('uiClick');
    startGame();
  };

  const toggleMute = () => {
    sounds.init();
    const next = sounds.toggleMute();
    setMuted(next);
    if (!next) sounds.play('uiClick');
  };

  return (
    <div className={styles.overlay}>
      <button className={styles.muteBtn} onClick={toggleMute} type="button">
        {muted ? vi.start.unmute : vi.start.mute}
      </button>

      <div className={styles.panel}>
        <h1 className={styles.title}>{vi.gameTitle}</h1>
        <p className={styles.subtitle}>{vi.gameSubtitle}</p>
        <p className={styles.tagline}>{vi.tagline}</p>

        <button className={styles.playBtn} onClick={handleStart} type="button">
          {vi.start.play}
        </button>

        <div className={styles.features}>
          <span>{vi.start.featureExplore}</span>
          <span>•</span>
          <span>{vi.start.featureCombat}</span>
          <span>•</span>
          <span>{vi.start.featureMath}</span>
        </div>
      </div>
    </div>
  );
}
