import React, { useEffect, useRef } from 'react';
import type { WordToken, SentenceCard } from '../engine/aligner';

interface PrompterViewProps {
  words: WordToken[];
  sentences: SentenceCard[];
  cursorIndex: number;
  fontSize: number;
  lineHeight: number;
  containerWidth: number; // percentage, e.g. 70
  theme: 'oled' | 'studio' | 'light';
  displayMode: 'cards' | 'continuous';
  fontFamily?: 'jakarta' | 'outfit' | 'system';
  onWordClick: (index: number) => void;
}

export const PrompterView: React.FC<PrompterViewProps> = ({
  words,
  sentences,
  cursorIndex,
  fontSize,
  lineHeight,
  containerWidth,
  theme,
  displayMode,
  fontFamily = 'jakarta',
  onWordClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Smooth interpolated scrolling state
  const currentScrollY = useRef(0);
  const targetScrollY = useRef(0);
  const animFrameId = useRef<number | null>(null);

  // Compute active sentence index with early cadence anticipation
  const targetFocalSentenceIndex = (() => {
    let currIdx = 0;
    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      if (cursorIndex >= s.startIndex && cursorIndex <= s.endIndex) {
        currIdx = i;
        break;
      }
    }

    const currentCard = sentences[currIdx];
    let targetIdx = currIdx;

    if (currentCard && currIdx < sentences.length - 1) {
      const remainingWords = currentCard.endIndex - cursorIndex;
      // Anticipate switch to next card when 2 words left (or 1 word left for very short sentences)
      const anticipationThreshold = currentCard.words.length >= 5 ? 2 : 1;
      if (remainingWords <= anticipationThreshold) {
        targetIdx = currIdx + 1;
      }
    }

    return targetIdx;
  })();

  // Update target scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerHeight = container.clientHeight;

    if (displayMode === 'cards') {
      // CARD MODE with Cadence Anticipation:
      // Focus on the anticipated card in upper third, leaving maximum space below
      const focalCardEl = cardRefs.current.get(targetFocalSentenceIndex);
      if (focalCardEl) {
        const cardTop = focalCardEl.offsetTop;
        const targetOffset = containerHeight * 0.16;
        targetScrollY.current = Math.max(0, cardTop - targetOffset);
      }
    } else {
      // CONTINUOUS MODE: Continuous smooth word tracking
      const activeWordEl = wordRefs.current.get(cursorIndex);
      if (activeWordEl) {
        const wordTop = activeWordEl.offsetTop;
        const eyeLineOffset = containerHeight * 0.25;
        targetScrollY.current = Math.max(0, wordTop - eyeLineOffset);
      }
    }
  }, [cursorIndex, targetFocalSentenceIndex, displayMode, fontSize, lineHeight]);

  // Butter smooth upward scroll transition loop (60-120 FPS)
  useEffect(() => {
    let active = true;

    const smoothScrollLoop = () => {
      if (!active) return;

      const diff = targetScrollY.current - currentScrollY.current;
      if (Math.abs(diff) > 0.5) {
        // Dynamic slide-up momentum: fast fluid glide when switching cases
        const baseLerp = displayMode === 'cards' ? 0.20 : 0.28;
        const lerpFactor = Math.min(0.40, baseLerp + Math.abs(diff) * 0.002);
        currentScrollY.current += diff * lerpFactor;
      } else {
        currentScrollY.current = targetScrollY.current;
      }

      if (wordsContainerRef.current) {
        wordsContainerRef.current.style.transform = `translate3d(0, -${currentScrollY.current}px, 0)`;
      }

      animFrameId.current = requestAnimationFrame(smoothScrollLoop);
    };

    animFrameId.current = requestAnimationFrame(smoothScrollLoop);

    return () => {
      active = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [displayMode]);

  // Mouse Wheel & Trackpad scroll support to move backward / forward anywhere
  const wheelAccumulator = useRef(0);
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // Don't intercept if scrolling inside a modal dialog or form controls
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, [role="dialog"]')) {
        return;
      }
      e.preventDefault();
      wheelAccumulator.current += e.deltaY;

      if (displayMode === 'cards') {
        // Card mode: scroll up moves to previous card, scroll down moves to next card
        if (wheelAccumulator.current <= -25) {
          wheelAccumulator.current = 0;
          const prevIdx = Math.max(0, targetFocalSentenceIndex - 1);
          const prevCard = sentences[prevIdx];
          if (prevCard) {
            onWordClick(prevCard.startIndex);
          }
        } else if (wheelAccumulator.current >= 25) {
          wheelAccumulator.current = 0;
          const nextIdx = Math.min(sentences.length - 1, targetFocalSentenceIndex + 1);
          const nextCard = sentences[nextIdx];
          if (nextCard) {
            onWordClick(nextCard.startIndex);
          }
        }
      } else {
        // Continuous mode: scrolls by 3 words forward / backward
        if (wheelAccumulator.current <= -20) {
          wheelAccumulator.current = 0;
          onWordClick(Math.max(0, cursorIndex - 3));
        } else if (wheelAccumulator.current >= 20) {
          wheelAccumulator.current = 0;
          onWordClick(Math.min(words.length - 1, cursorIndex + 3));
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [displayMode, targetFocalSentenceIndex, cursorIndex, sentences, words, onWordClick]);

  const themeClasses = {
    oled: 'bg-black text-zinc-100',
    studio: 'bg-[#0f1117] text-zinc-100',
    light: 'bg-zinc-50 text-zinc-900',
  }[theme];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-pointer transition-colors duration-300 ${themeClasses}`}
    >
      {/* Subtle Top & Bottom gradient fades */}
      <div className={`absolute top-0 left-0 right-0 h-14 pointer-events-none z-10 bg-gradient-to-b to-transparent ${
        theme === 'light' 
          ? 'from-zinc-50 via-zinc-50/80' 
          : 'from-black via-black/80'
      }`} />
      <div className={`absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-10 bg-gradient-to-t to-transparent ${
        theme === 'light' 
          ? 'from-zinc-50 via-zinc-50/80' 
          : 'from-black via-black/80'
      }`} />

      {/* Prompter Scrolling Canvas - Maximized Space */}
      <div
        ref={wordsContainerRef}
        className={`mx-auto will-change-transform pt-[12vh] pb-[45vh] px-3 sm:px-6 font-${fontFamily}`}
        style={{
          maxWidth: `${containerWidth}%`,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}`,
        }}
      >
        {displayMode === 'cards' ? (
          /* ========================================================== */
          /* CARD MODE: Sentence boxes with anticipated slide-up        */
          /* ========================================================== */
          <div className="flex flex-col gap-4">
            {sentences.map((card, sIdx) => {
              const isCardPassed = sIdx < targetFocalSentenceIndex;
              const isCardTarget = sIdx === targetFocalSentenceIndex;

              let cardClasses: string;
              if (isCardTarget) {
                cardClasses = theme === 'light'
                  ? 'bg-white border-2 border-amber-500 shadow-xl ring-2 ring-amber-400/20 translate-y-0 scale-100 opacity-100'
                  : 'bg-zinc-900/90 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.18)] ring-2 ring-amber-400/20 translate-y-0 scale-100 opacity-100';
              } else if (isCardPassed) {
                cardClasses = theme === 'light'
                  ? 'bg-zinc-100/60 border border-zinc-200 opacity-25 -translate-y-1 scale-[0.99]'
                  : 'bg-zinc-950/40 border border-zinc-800/60 opacity-20 -translate-y-1 scale-[0.99]';
              } else {
                cardClasses = theme === 'light'
                  ? 'bg-zinc-50 border border-zinc-200 opacity-60 translate-y-1'
                  : 'bg-zinc-900/40 border border-zinc-800/80 opacity-50 translate-y-1';
              }

              const cardTextClasses = isCardTarget
                ? (theme === 'light' ? 'text-zinc-950 font-semibold' : 'text-white font-semibold')
                : (theme === 'light' ? 'text-zinc-700 font-medium' : 'text-zinc-300 font-medium');

              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    if (el) cardRefs.current.set(sIdx, el);
                    else cardRefs.current.delete(sIdx);
                  }}
                  className={`p-4 sm:p-5 rounded-2xl transition-all duration-500 ease-out relative ${cardClasses}`}
                >
                  {/* Words within sentence card - Uniform natural text without word highlight */}
                  <div className={`flex flex-wrap items-baseline gap-x-[0.3em] tracking-normal ${cardTextClasses}`}>
                    {card.words.map((word) => {
                      const idx = word.id;
                      return (
                        <span
                          key={word.id}
                          ref={(el) => {
                            if (el) wordRefs.current.set(idx, el);
                            else wordRefs.current.delete(idx);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onWordClick(idx);
                          }}
                          className="inline-block py-0.5 rounded cursor-pointer hover:underline"
                        >
                          {word.text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ========================================================== */
          /* CONTINUOUS MODE: Smooth continuous scrolling               */
          /* ========================================================== */
          <div className="flex flex-wrap items-baseline gap-x-[0.35em] font-medium tracking-wide">
            {words.map((word, idx) => {
              const isPassed = idx < cursorIndex;
              const isCurrent = idx === cursorIndex;
              const isNext = idx > cursorIndex && idx <= cursorIndex + 3;

              let statusClasses: string;
              if (isCurrent) {
                statusClasses = theme === 'light' 
                  ? 'bg-amber-300 text-black shadow-sm font-semibold' 
                  : 'bg-amber-400 text-black shadow-[0_0_16px_rgba(251,191,36,0.5)] font-semibold';
              } else if (isPassed) {
                statusClasses = theme === 'light' ? 'text-zinc-400/60' : 'text-zinc-600/60';
              } else if (isNext) {
                statusClasses = theme === 'light' ? 'text-zinc-950 font-medium' : 'text-zinc-100 font-medium';
              } else {
                statusClasses = theme === 'light' ? 'text-zinc-800' : 'text-zinc-300';
              }

              return (
                <React.Fragment key={word.id}>
                  {word.isParagraphBreak && <div className="w-full h-8" />}
                  <span
                    ref={(el) => {
                      if (el) wordRefs.current.set(idx, el);
                      else wordRefs.current.delete(idx);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onWordClick(idx);
                    }}
                    className={`inline-block px-1.5 py-0.5 -mx-1 rounded transition-colors duration-100 cursor-pointer ${statusClasses}`}
                  >
                    {word.text}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
