import { useGameStore } from '../../store/gameStore';
import { sounds } from '../../audio/sounds';
import { vi } from '../../i18n/vi';
import styles from './ZoomControl.module.css';

export function ZoomControl() {
  const phase = useGameStore((s) => s.phase);
  const mapZoom = useGameStore((s) => s.mapZoom);
  const toggleMapZoom = useGameStore((s) => s.toggleMapZoom);

  if (phase !== 'explore') return null;

  const isOverview = mapZoom === 'overview';

  return (
    <button
      className={styles.btn}
      onClick={() => {
        sounds.play('uiClick');
        toggleMapZoom();
      }}
      type="button"
      aria-label={isOverview ? vi.zoom.ariaNormal : vi.zoom.ariaOverview}
      title={isOverview ? vi.zoom.ariaNormal : vi.zoom.ariaOverview}
    >
      <span className={styles.icon}>{isOverview ? '⊕' : '⊖'}</span>
      <span className={styles.label}>{isOverview ? vi.zoom.normal : vi.zoom.overview}</span>
    </button>
  );
}
