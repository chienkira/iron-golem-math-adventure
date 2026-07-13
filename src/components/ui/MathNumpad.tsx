import { useT } from '../../i18n';
import styles from './CombatUI.module.css';

interface MathNumpadProps {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export function MathNumpad({ onDigit, onClear, onSubmit }: MathNumpadProps) {
  const t = useT();
  const digits: { key: string; label: string }[] = [
    ...['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((key) => ({ key, label: key })),
    { key: 'C', label: t.combat.clear },
    { key: '0', label: '0' },
    { key: '✓', label: t.combat.submit },
  ];

  return (
    <div className={styles.numpad}>
      {digits.map(({ key, label }) => (
        <button
          key={key}
          className={`${styles.numpadBtn} ${key === '✓' ? styles.submitBtn : ''} ${key === 'C' ? styles.clearBtn : ''} ${key === 'C' ? styles.clearLabel : ''}`}
          onClick={() => {
            if (key === 'C') {
              onClear();
            } else if (key === '✓') {
              onSubmit();
            } else {
              onDigit(key);
            }
          }}
          type="button"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
