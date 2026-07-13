import { useEffect, useRef, useState } from 'react';
import { LOCALES, LOCALE_META, useLocaleStore, useT } from '../../i18n';
import styles from './LanguagePicker.module.css';

export function LanguagePicker() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        type="button"
        aria-label={t.language.label}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        🌐
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label={t.language.label}>
          {LOCALES.map((code) => {
            const meta = LOCALE_META[code];
            const active = code === locale;
            return (
              <li key={code} role="option" aria-selected={active}>
                <button
                  className={`${styles.option} ${active ? styles.optionActive : ''}`}
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span className={styles.flag} aria-hidden>
                    {meta.flag}
                  </span>
                  <span>{t.language[code]}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
