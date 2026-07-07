import { vi } from '../../i18n/vi';
import styles from './ExitButton.module.css';

interface ExitButtonProps {
  onClick: () => void;
}

export function ExitButton({ onClick }: ExitButtonProps) {
  return (
    <button className={styles.btn} onClick={onClick} type="button">
      ✕ {vi.common.exit}
    </button>
  );
}
