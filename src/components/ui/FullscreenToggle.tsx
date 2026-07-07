import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import {
  isGameFullscreen,
  subscribeFullscreenChange,
  toggleGameFullscreen,
} from '../../utils/fullscreen';
import styles from './FullscreenToggle.module.css';

export function FullscreenToggle() {
  const phase = useGameStore((s) => s.phase);
  const [active, setActive] = useState(isGameFullscreen);

  useEffect(() => {
    return subscribeFullscreenChange(() => setActive(isGameFullscreen()));
  }, []);

  if (phase === 'menu') return null;

  const handleToggle = () => {
    toggleGameFullscreen();
    setActive(isGameFullscreen());
  };

  return (
    <button
      className={styles.btn}
      onClick={handleToggle}
      type="button"
    >
      {active ? '⤡' : '⛶'}
    </button>
  );
}
