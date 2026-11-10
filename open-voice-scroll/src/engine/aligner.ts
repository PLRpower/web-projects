import { cleanWord, phoneticCode, matchWordsFast } from './phonetics.ts';

export interface WordToken {
  id: number;
  text: string;
  clean: string;
  phonetic: string;
  lineIndex: number;
  wordIndex: number;
  isParagraphBreak: boolean;
  sentenceId: number;
}

export interface SentenceCard {
  id: number;
  words: WordToken[];
  startIndex: number;
  endIndex: number;
}

export interface MatchResult {
  cursorIndex: number;
  matchedWordId: number;
  score: number;
  spokenToken: string;
  activeSentenceId: number;
}

export type Sensitivity = 'strict' | 'normal' | 'tolerant';
export type CardDensity = 'compact' | 'balanced' | 'spacious';

export class ScriptAligner {
  public words: WordToken[] = [];
  public sentences: SentenceCard[] = [];
  public cursorIndex: number = 0;
  private lang: 'fr' | 'en' = 'fr';
  private sensitivity: Sensitivity = 'normal';
  private cardDensity: CardDensity = 'balanced';

  constructor(
    scriptText: string,
    lang: 'fr' | 'en' = 'fr',
    sensitivity: Sensitivity = 'normal',
    cardDensity: CardDensity = 'balanced'
  ) {
    this.lang = lang;
    this.sensitivity = sensitivity;
    this.cardDensity = cardDensity;
    this.loadScript(scriptText);
  }

  public setLanguage(lang: 'fr' | 'en') {
    if (this.lang !== lang) {
      this.lang = lang;
      for (const w of this.words) {
        w.phonetic = phoneticCode(w.clean, this.lang);
      }
    }
  }

  public setSensitivity(sensitivity: Sensitivity) {
    this.sensitivity = sensitivity;
  }

  public setCardDensity(density: CardDensity) {
    if (this.cardDensity === density) return;
    this.cardDensity = density;
    this.buildSentences();
  }

  public loadScript(text: string) {
    this.words = [];
    this.cursorIndex = 0;

    const lines = text.split(/\r?\n/);
    let globalId = 0;
    let pendingParagraphBreak = false;

    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        pendingParagraphBreak = true;
        return;
      }

      const rawWords = trimmed.split(/\s+/).filter(w => w.length > 0);
      rawWords.forEach((raw, wordIndex) => {
        const clean = cleanWord(raw);
        const phonetic = phoneticCode(clean, this.lang);

        const token: WordToken = {
          id: globalId++,
          text: raw,
          clean,
          phonetic,
          lineIndex,
          wordIndex,
          isParagraphBreak: wordIndex === 0 && pendingParagraphBreak,
          sentenceId: 0,
        };

        pendingParagraphBreak = false;
        this.words.push(token);
      });
    });

    this.buildSentences();
  }

  private getBreakScore(token: WordToken, nextToken?: WordToken): number {
    if (!nextToken) return 0;
    if (nextToken.isParagraphBreak) return 100;

    const text = token.text;
    if (/[.!?]+['"»”)]?$/.test(text)) {
      if (/^(M\.|Mme\.|Mlle\.|Dr\.|Prof\.|etc\.|ex\.|vs\.|e\.g\.|i\.e\.|\d+\.)$/i.test(text)) {
        return 15;
      }
      return 80;
    }

    if (/[:;—–]+$/.test(text)) return 60;
    if (/[,)»”]+$/.test(text)) return 40;

    const nextText = nextToken.text;
    if (/^(et|ou|mais|car|donc|or|ni|que|qui|quand|lorsque|puisque|parce|si|pour|and|but|so|that|which|when|because|while|if)$/i.test(nextText)) {
      return 30;
    }

    return 10;
  }

  private buildSentences() {
    this.sentences = [];
    if (this.words.length === 0) return;

    const densityConfig: Record<CardDensity, { target: number; min: number; max: number }> = {
      compact: { target: 11, min: 7, max: 15 },
      balanced: { target: 15, min: 9, max: 21 },
      spacious: { target: 20, min: 12, max: 26 },
    };

    const { target, min, max } = densityConfig[this.cardDensity];
    let start = 0;
    let cardId = 0;

    while (start < this.words.length) {
      const remaining = this.words.length - start;

      // Fit remainder into single card
      if (remaining <= max) {
        if (this.sentences.length > 0 && remaining < min && (this.sentences[this.sentences.length - 1].words.length + remaining) <= max + 4) {
          const prevCard = this.sentences[this.sentences.length - 1];
          const extra = this.words.slice(start);
          prevCard.words.push(...extra);
          prevCard.endIndex = start + extra.length - 1;
          for (const w of extra) w.sentenceId = prevCard.id;
        } else {
          const cardWords = this.words.slice(start);
          for (const w of cardWords) w.sentenceId = cardId;
          this.sentences.push({
            id: cardId++,
            words: cardWords,
            startIndex: start,
            endIndex: start + cardWords.length - 1,
          });
        }
        break;
      }

      // Check for natural paragraph break within candidate range
      let paragraphBreakCut = -1;
      const scanLimit = Math.min(this.words.length - 1, start + max);
      for (let i = start + min; i <= scanLimit; i++) {
        if (this.words[i].isParagraphBreak) {
          paragraphBreakCut = i - 1;
          break;
        }
      }

      let bestCut = paragraphBreakCut;
      if (bestCut < start + min) {
        const minCut = start + min;
        const maxCut = scanLimit;
        let bestScore = -Infinity;

        for (let cut = minCut; cut <= maxCut; cut++) {
          const remAfterCut = this.words.length - (cut + 1);
          if (remAfterCut > 0 && remAfterCut < min) continue;

          const breakScore = this.getBreakScore(this.words[cut], this.words[cut + 1]);
          const distance = Math.abs((cut - start + 1) - target);
          const score = breakScore * 2 - distance * 3;

          if (score > bestScore) {
            bestScore = score;
            bestCut = cut;
          }
        }

        if (bestCut === -1) {
          bestCut = remaining < max * 2 ? start + Math.floor(remaining / 2) - 1 : start + target - 1;
        }
      }

      const cardWords = this.words.slice(start, bestCut + 1);
      for (const w of cardWords) w.sentenceId = cardId;
      this.sentences.push({
        id: cardId++,
        words: cardWords,
        startIndex: start,
        endIndex: bestCut,
      });

      start = bestCut + 1;
    }
  }

  public setCursor(index: number) {
    if (index >= 0 && index < this.words.length) {
      this.cursorIndex = index;
    }
  }

  public reset() {
    this.cursorIndex = 0;
  }

  public getActiveSentenceIndex(): number {
    for (let i = 0; i < this.sentences.length; i++) {
      const s = this.sentences[i];
      if (this.cursorIndex >= s.startIndex && this.cursorIndex <= s.endIndex) {
        return i;
      }
    }
    return Math.max(0, this.sentences.length - 1);
  }

  /**
   * Monotonic Pacing Alignment Engine
   * Eliminates skips and prevents blocking:
   * 1. Short/common words (length <= 4) CANNOT jump forward by more than 1 word.
   * 2. Jumps >= 2 words strictly require either a long unique keyword (>= 6 chars) or solid confirmation.
   * 3. Seamless sequential progression.
   */
  public matchSpoken(spokenText: string): MatchResult | null {
    if (this.words.length === 0) return null;

    const rawTokens = spokenText.trim().split(/\s+/);
    if (rawTokens.length === 0) return null;

    // Inspect last 1-3 spoken tokens
    const recentRaw = rawTokens.slice(-3);
    const recentTokens = recentRaw.map(raw => {
      const clean = cleanWord(raw);
      return {
        clean,
        phonetic: phoneticCode(clean, this.lang),
      };
    }).filter(t => t.clean.length > 0);

    if (recentTokens.length === 0) return null;

    const params = {
      strict: { rawThreshold: 0.78, effectiveThreshold: 0.74, lookahead: 4, distancePenalty: 0.10 },
      normal: { rawThreshold: 0.68, effectiveThreshold: 0.64, lookahead: 5, distancePenalty: 0.08 },
      tolerant: { rawThreshold: 0.62, effectiveThreshold: 0.58, lookahead: 6, distancePenalty: 0.06 },
    }[this.sensitivity];

    let currentSearchIndex = this.cursorIndex;
    let lastMatch: { index: number; score: number; spoken: string } | null = null;

    for (const spoken of recentTokens) {
      // Primary Window: [currentSearchIndex - 1, currentSearchIndex + lookahead]
      const windowStart = Math.max(0, currentSearchIndex - 1);
      const windowEnd = Math.min(this.words.length, currentSearchIndex + params.lookahead);

      let stepBest: { index: number; score: number; effectiveScore: number; spoken: string } | null = null;

      for (let i = windowStart; i < windowEnd; i++) {
        const candidate = this.words[i];
        if (!candidate || !candidate.clean) continue;

        const distance = i - currentSearchIndex;

        // ANTI-SKIP RULE #1: Short words (<= 4 chars like le, la, de, du, un, et, en, pour, avec, dans, vous)
        // are NEVER allowed to skip forward (max distance = +1).
        if ((candidate.clean.length <= 4 || spoken.clean.length <= 4) && distance > 1) {
          continue;
        }

        const rawScore = matchWordsFast(spoken.clean, spoken.phonetic, candidate.clean, candidate.phonetic);
        if (rawScore < params.rawThreshold) continue;

        // Immediate next word has 0 penalty
        const forwardDistance = Math.max(0, distance);
        const penalty = Math.max(0, forwardDistance - 1) * params.distancePenalty;
        const effectiveScore = rawScore - penalty;

        if (effectiveScore >= params.effectiveThreshold) {
          if (!stepBest || effectiveScore > stepBest.effectiveScore) {
            stepBest = { index: i, score: rawScore, effectiveScore, spoken: spoken.clean };
          }
        }
      }

      // ANTI-SKIP RULE #2: Secondary rescue scan for skipped words
      // ONLY long unique words (>= 6 chars) with score >= 0.85 can unlock a forward jump!
      // This prevents common small words from causing large jumps.
      if (!stepBest && spoken.clean.length >= 5) {
        const rescueStart = windowEnd;
        const rescueEnd = Math.min(this.words.length, currentSearchIndex + 10);

        for (let i = rescueStart; i < rescueEnd; i++) {
          const candidate = this.words[i];
          if (!candidate || candidate.clean.length < 6) continue;

          const rawScore = matchWordsFast(spoken.clean, spoken.phonetic, candidate.clean, candidate.phonetic);
          if (rawScore >= 0.85) {
            stepBest = { index: i, score: rawScore, effectiveScore: rawScore, spoken: spoken.clean };
            break;
          }
        }
      }

      if (stepBest) {
        currentSearchIndex = stepBest.index;
        lastMatch = { index: stepBest.index, score: stepBest.score, spoken: stepBest.spoken };
      }
    }

    if (lastMatch && lastMatch.index !== this.cursorIndex) {
      this.cursorIndex = lastMatch.index;
      return {
        cursorIndex: this.cursorIndex,
        matchedWordId: this.words[this.cursorIndex].id,
        score: lastMatch.score,
        spokenToken: lastMatch.spoken,
        activeSentenceId: this.words[this.cursorIndex].sentenceId,
      };
    }

    return null;
  }
}
