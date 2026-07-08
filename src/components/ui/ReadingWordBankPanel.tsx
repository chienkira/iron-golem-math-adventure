import { vi } from '../../i18n/vi';
import styles from './CombatUI.module.css';

interface ReadingWordBankPanelProps {
  words: string[];
  selectedWords: string[];
  onWordTap: (word: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export function ReadingWordBankPanel({
  words,
  selectedWords,
  onWordTap,
  onClear,
  onSubmit,
}: ReadingWordBankPanelProps) {
  const usedCounts = selectedWords.reduce<Record<string, number>>((acc, word) => {
    acc[word] = (acc[word] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className={styles.readingPanel}>
      <p className={styles.wordHint}>{vi.combat.tapWordHint}</p>
      <div className={styles.wordBank}>
        {words.map((word, index) => {
          const used = usedCounts[word] ?? 0;
          const disabled = used > 0;
          return (
            <button
              key={`${word}-${index}`}
              className={`${styles.wordChip} ${disabled ? styles.wordChipUsed : ''}`}
              onClick={() => onWordTap(word)}
              disabled={disabled}
              type="button"
            >
              {word}
            </button>
          );
        })}
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
