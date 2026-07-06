import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { sounds } from '../../audio/sounds';
import { vi } from '../../i18n/vi';
import styles from './SoundToggle.module.css';

export function SoundToggle() {
  const phase = useGameStore((s) => s.phase);
  const [muted, setMuted] = useState(() => sounds.isMuted());

  if (phase === 'menu') return null;

  const toggle = () => {
    sounds.init();
    const next = sounds.toggleMute();
    setMuted(next);
    if (!next) sounds.play('uiClick');
  };

  return (
    <button
      className={styles.btn}
      onClick={toggle}
      type="button"
      aria-label={muted ? vi.start.unmute : vi.start.mute}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
