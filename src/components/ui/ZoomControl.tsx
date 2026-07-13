import { useGameStore } from '../../store/gameStore';
import { useT } from '../../i18n';
import styles from './ZoomControl.module.css';

export function ZoomControl() {
  const t = useT();
  const phase = useGameStore((s) => s.phase);
  const mapZoom = useGameStore((s) => s.mapZoom);
  const toggleMapZoom = useGameStore((s) => s.toggleMapZoom);

  if (phase !== 'explore') return null;

  const isOverview = mapZoom === 'overview';

  return (
    <button className={styles.btn} onClick={toggleMapZoom} type="button">
      {isOverview ? t.zoom.normal : t.zoom.overview}
    </button>
  );
}
