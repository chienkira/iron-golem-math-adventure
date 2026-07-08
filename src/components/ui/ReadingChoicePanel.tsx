import { vi } from '../../i18n/vi';
import styles from './CombatUI.module.css';

interface ReadingChoicePanelProps {
  choices: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export function ReadingChoicePanel({
  choices,
  selectedIndex,
  onSelect,
  onClear,
  onSubmit,
}: ReadingChoicePanelProps) {
  return (
    <div className={styles.readingPanel}>
      <div className={styles.choiceGrid}>
        {choices.map((choice, index) => (
          <button
            key={`${choice}-${index}`}
            className={`${styles.choiceBtn} ${selectedIndex === index ? styles.choiceBtnActive : ''}`}
            onClick={() => onSelect(index)}
            type="button"
          >
            {choice}
          </button>
        ))}
      </div>
      <div className={styles.readingActions}>
        <button className={`${styles.actionBtn} ${styles.clearBtn}`} onClick={onClear} type="button">
          {vi.combat.clear}
        </button>
        <button className={`${styles.actionBtn} ${styles.submitBtn}`} onClick={onSubmit} type="button">
          {vi.combat.submit}
        </button>
      </div>
    </div>
  );
}
