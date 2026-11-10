# OpenVoiceScroll

Real-time open-source teleprompter with voice tracking and accent-tolerant phonetic alignment (French / English).

## Key Features

- **Low-latency voice tracking**: Adapts to natural speech cadence. Pauses when you pause, resumes instantly when you speak.
- **French-accent tolerance for English**: Phonetic engine with dental fricative normalization (*think* <-> *sink*, *this* <-> *zis/dis*, *happy* <-> *appy*, etc.) and asymmetric sliding window search.
- **Hardware-accelerated 60-120 FPS scrolling**: Smooth linear interpolation (*lerp*) keeping the active reading line locked to the eye-line target (upper third).
- **Integrated mirror mode**: One-click horizontal flip for professional beam splitter glass setups.
- **Studio keyboard shortcuts**:
  - `Space`: Toggle voice tracking
  - `R`: Reset to beginning of script
  - `M`: Toggle mirror mode
  - `Up` / `Down`: Manually adjust cursor word by word
  - `Direct word click`: Jump immediately to target word
  - `F11`: Toggle fullscreen

## Quick Start

```bash
cd open-voice-scroll
pnpm install
pnpm dev
```

Open in Chrome, Edge, or Brave (browsers with Web Speech & Web Audio API support).

## Project Structure

```
src/
├── engine/
│   ├── phonetics.ts      # Normalization, Levenshtein distance, and FR/EN phonetic rules
│   ├── aligner.ts        # Tokenization and sliding window matching
│   └── speech.ts         # Web Audio capture and continuous speech recognition API
├── components/
│   ├── Header.tsx        # Status bar, real-time audio VU meter, and language selector
│   ├── PrompterView.tsx  # Smooth-scrolling canvas with 120 FPS interpolation
│   ├── Controls.tsx      # Settings drawer (font size, line height, line width, mirror)
│   └── ScriptModal.tsx   # Script editor and presets
└── data/
    └── sampleScripts.ts  # Demo scripts in French and English
```

## Native Desktop Binary (Tauri / macOS / Windows / Linux)

The application core is decoupled:
1. Ensure Rust and platform build tools are installed, then run `pnpm tauri init` (or use existing `src-tauri` configuration).
2. The frontend integrates directly without modifications.
3. Cross-platform binaries (`.exe`, `.dmg`, `.AppImage`) can be built locally or via GitHub Actions.
