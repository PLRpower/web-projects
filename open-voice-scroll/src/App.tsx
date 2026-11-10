import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SAMPLE_SCRIPTS } from './data/sampleScripts';
import { ScriptAligner, type CardDensity } from './engine/aligner';
import { SpeechEngine } from './engine/speech';
import { PrompterView } from './components/PrompterView';
import { Controls } from './components/Controls';
import { ScriptModal } from './components/ScriptModal';

export function App() {
  // Script and language state
  const [currentScriptIndex] = useState(0);
  const [scriptText, setScriptText] = useState(SAMPLE_SCRIPTS[currentScriptIndex].text);
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const speechLang = lang === 'fr' ? 'fr-FR' : 'en-US';

  // Aligner engine
  const [sensitivity, setSensitivity] = useState<'strict' | 'normal' | 'tolerant'>('normal');
  const [cardDensity, setCardDensity] = useState<CardDensity>('balanced');
  const aligner = useMemo(() => new ScriptAligner(scriptText, lang, sensitivity, cardDensity), [scriptText, lang, sensitivity, cardDensity]);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [words, setWords] = useState(aligner.words);
  const [sentences, setSentences] = useState(aligner.sentences);
  const [displayMode, setDisplayMode] = useState<'cards' | 'continuous'>('cards');

  // Audio / Speech state
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const speechEngineRef = useRef<SpeechEngine | null>(null);

  // Prompter display parameters - Maximized space defaults
  const [fontSize, setFontSize] = useState(34);
  const [lineHeight, setLineHeight] = useState(1.38);
  const [containerWidth, setContainerWidth] = useState(94);
  const [theme, setTheme] = useState<'oled' | 'studio' | 'light'>('oled');
  const [fontFamily, setFontFamily] = useState<'jakarta' | 'outfit' | 'system'>('jakarta');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);

  // Manual fallback auto-scroll
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(0); // 0 = off, else words per minute
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Synchronize words & sentences when script changes
  useEffect(() => {
    aligner.loadScript(scriptText);
    aligner.setLanguage(lang);
    setWords([...aligner.words]);
    setSentences([...aligner.sentences]);
    setCursorIndex(0);
  }, [aligner, scriptText, lang]);

  const handleCardDensityChange = (density: CardDensity) => {
    setCardDensity(density);
    aligner.setCardDensity(density);
    setSentences([...aligner.sentences]);
  };

  // Handle spoken words matching & anti-block tracking
  const lastProgressTimeRef = useRef(Date.now());

  const handleTranscript = useCallback((text: string) => {
    const result = aligner.matchSpoken(text);
    if (result) {
      lastProgressTimeRef.current = Date.now();
      setCursorIndex(result.cursorIndex);
    }
  }, [aligner]);

  // Voice Flow Pacing Assistance (Anti-Block):
  // If voice energy is active (speaking into mic) but recognition pauses/drops,
  // gently progress to ensure the speaker is never blocked.
  useEffect(() => {
    if (!isListening) return;

    const interval = setInterval(() => {
      if (audioLevel > 18 && Date.now() - lastProgressTimeRef.current > 1700) {
        lastProgressTimeRef.current = Date.now();
        setCursorIndex(prev => {
          const next = Math.min(words.length - 1, prev + 1);
          aligner.setCursor(next);
          return next;
        });
      }
    }, 350);

    return () => clearInterval(interval);
  }, [isListening, audioLevel, words.length, aligner]);

  // Initialize Speech Engine
  useEffect(() => {
    const engine = new SpeechEngine(
      {
        onTranscript: (t) => handleTranscript(t),
        onAudioLevel: (lvl) => setAudioLevel(lvl),
        onStatusChange: (status) => setIsListening(status),
        onError: (err) => console.warn(err),
      },
      speechLang
    );
    speechEngineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, [handleTranscript, speechLang]);

  // Update speech engine language when selected
  const handleLanguageChange = (newLang: 'fr' | 'en') => {
    setLang(newLang);
    const targetCode = newLang === 'fr' ? 'fr-FR' : 'en-US';
    speechEngineRef.current?.setLanguage(targetCode);
  };

  const toggleMic = () => {
    if (!speechEngineRef.current) return;
    if (isListening) {
      speechEngineRef.current.stop();
    } else {
      speechEngineRef.current.start();
    }
  };

  const handleResetCursor = () => {
    aligner.reset();
    setCursorIndex(0);
  };

  const handleWordClick = (index: number) => {
    aligner.setCursor(index);
    setCursorIndex(index);
  };

  const handleApplyScript = (newText: string, newLang?: 'fr' | 'en') => {
    setScriptText(newText);
    if (newLang) {
      handleLanguageChange(newLang);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal textarea is focused
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        toggleMic();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleResetCursor();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setCursorIndex(prev => {
          const next = Math.min(words.length - 1, prev + 1);
          aligner.setCursor(next);
          return next;
        });
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setCursorIndex(prev => {
          const next = Math.max(0, prev - 1);
          aligner.setCursor(next);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [words.length, isListening, aligner]);

  // Fallback Auto-scrolling timer loop
  useEffect(() => {
    if (!isAutoScrolling || autoScrollSpeed <= 0) return;

    const intervalMs = (60 / autoScrollSpeed) * 1000;

    const timer = setInterval(() => {
      setCursorIndex(prev => {
        if (prev >= words.length - 1) {
          setIsAutoScrolling(false);
          return prev;
        }
        const next = prev + 1;
        aligner.setCursor(next);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isAutoScrolling, autoScrollSpeed, words.length, aligner]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Main Clean Teleprompter Canvas */}
      <PrompterView
        words={words}
        sentences={sentences}
        cursorIndex={cursorIndex}
        fontSize={fontSize}
        lineHeight={lineHeight}
        containerWidth={containerWidth}
        theme={theme}
        displayMode={displayMode}
        fontFamily={fontFamily}
        onWordClick={handleWordClick}
      />

      {/* Floating Bottom Control Bar */}
      <Controls
        fontSize={fontSize}
        setFontSize={setFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        containerWidth={containerWidth}
        setContainerWidth={setContainerWidth}
        theme={theme}
        setTheme={setTheme}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        cardDensity={cardDensity}
        setCardDensity={handleCardDensityChange}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        onResetCursor={handleResetCursor}
        autoScrollSpeed={autoScrollSpeed}
        setAutoScrollSpeed={setAutoScrollSpeed}
        isAutoScrolling={isAutoScrolling}
        setIsAutoScrolling={setIsAutoScrolling}
        isListening={isListening}
        onToggleMic={toggleMic}
        audioLevel={audioLevel}
        selectedLang={lang}
        onLangChange={handleLanguageChange}
        onOpenScriptModal={() => setIsScriptModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Text Editor & Script Presets Modal */}
      <ScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        currentScriptText={scriptText}
        onApplyScript={handleApplyScript}
      />
    </div>
  );
}

export default App;
