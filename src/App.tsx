import { ExploreScene } from './components/scenes/GameScenes';
import { HUD } from './components/ui/HUD';
import { MoveHint } from './components/ui/MoveHint';
import { ZoomControl } from './components/ui/ZoomControl';
import { StartScreen } from './components/ui/StartScreen';
import { VSIntroOverlay } from './components/ui/VSIntro';
import { CombatOverlay } from './components/ui/CombatUI';
import { GameAudio } from './components/audio/GameAudio';
import { SoundToggle } from './components/ui/SoundToggle';
import styles from './App.module.css';
import { useGameStore } from './store/gameStore';
import { vi } from './i18n/vi';

function TitleScreen() {
  const phase = useGameStore((s) => s.phase);

  if (phase === 'menu') return null;

  return (
    <div className={styles.titleOverlay}>
      <h1 className={styles.title}>{vi.gameTitle}</h1>
      <p className={styles.subtitle}>{vi.gameSubtitle}</p>
      <p className={styles.tagline}>{vi.tagline}</p>
    </div>
  );
}

export default function App() {
  return (
    <div className={styles.app}>
      <ExploreScene />
      <StartScreen />
      <TitleScreen />
      <HUD />
      <MoveHint />
      <ZoomControl />
      <SoundToggle />
      <GameAudio />
      <VSIntroOverlay />
      <CombatOverlay />
    </div>
  );
}
