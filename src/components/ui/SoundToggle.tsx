import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { sounds } from '../../audio/sounds';
import styles from './SoundToggle.module.css';

export function SoundToggle() {
  const phase = useGameStore((s) => s.phase);
  const [muted, setMuted] = useState(() => sounds.isMuted());

  if (phase === 'menu') return null;

  const toggle = () => {
    sounds.init();
    const next = sounds.toggleMute();
    setMuted(next);
  };

  return (
    <button
      className={styles.btn}
      onClick={toggle}
      type="button"
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
