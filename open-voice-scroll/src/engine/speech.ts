/**
 * Real-time Speech-to-Text & Microphone Audio Engine
 * Encapsulates Web Speech API with auto-reconnection and Web Audio API level monitoring.
 */

// Extend window for WebKit prefixed SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechCallbacks {
  onTranscript: (transcript: string, isFinal: boolean) => void;
  onAudioLevel?: (level: number) => void;
  onError?: (error: string) => void;
  onStatusChange?: (isListening: boolean) => void;
}

export class SpeechEngine {
  private recognition: any = null;
  private isListening: boolean = false;
  private shouldKeepListening: boolean = false;
  private callbacks: SpeechCallbacks;
  private language: string = 'fr-FR';
  private isTauriEnv: boolean = false;
  private unlistenTauriMic: (() => void) | null = null;

  // Web Audio Context for VU meter
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;

  constructor(callbacks: SpeechCallbacks, initialLang = 'fr-FR') {
    this.callbacks = callbacks;
    this.language = initialLang;
    this.isTauriEnv = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
    this.initRecognition();
    this.initTauriListener();
  }

  private async initTauriListener() {
    if (this.isTauriEnv) {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        this.unlistenTauriMic = await listen<number>('native_mic_level', (event) => {
          this.callbacks.onAudioLevel?.(event.payload);
        });
      } catch (err) {
        console.warn("Tauri event listener init:", err);
      }
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 
      (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);
  }

  private initRecognition() {
    if (!this.isSupported()) {
      this.callbacks.onError?.("La reconnaissance vocale n'est pas supportée par ce navigateur (utilisez Chrome, Edge ou Brave).");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.language;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript + ' ';
        } else {
          interimTranscript += item[0].transcript + ' ';
        }
      }

      // Send the freshest combined stream to eliminate lag
      const combined = (finalTranscript + interimTranscript).trim();
      if (combined) {
        this.callbacks.onTranscript(combined, finalTranscript.length > 0);
      }
    };

    this.recognition.onerror = (event: any) => {
      // Don't report silent dropouts as fatal errors
      if (event.error !== 'no-speech') {
        this.callbacks.onError?.(`Erreur micro: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onStatusChange?.(false);

      // Auto-restart if user did not explicitly stop listening
      if (this.shouldKeepListening) {
        try {
          this.recognition.start();
          this.isListening = true;
          this.callbacks.onStatusChange?.(true);
        } catch {
          // Retry slightly delayed if browser throttle
          setTimeout(() => {
            if (this.shouldKeepListening) {
              try {
                this.recognition.start();
                this.isListening = true;
                this.callbacks.onStatusChange?.(true);
              } catch (_) {}
            }
          }, 250);
        }
      }
    };
  }

  public setLanguage(lang: string) {
    this.language = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
      if (this.isListening) {
        this.stop();
        setTimeout(() => this.start(), 150);
      }
    }
  }

  public async start(): Promise<void> {
    if (!this.recognition) {
      this.initRecognition();
    }
    this.shouldKeepListening = true;

    if (this.isTauriEnv) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('start_native_audio');
      } catch (err) {
        console.warn("Native Rust audio start:", err);
      }
    }

    try {
      this.recognition.start();
      this.isListening = true;
      this.callbacks.onStatusChange?.(true);
      if (!this.isTauriEnv) {
        await this.startAudioMonitoring();
      }
    } catch (e: any) {
      if (!this.isListening) {
        this.callbacks.onError?.("Impossible de démarrer la capture audio.");
      }
    }
  }

  public async stop(): Promise<void> {
    this.shouldKeepListening = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (_) {}
    }

    if (this.isTauriEnv) {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('stop_native_audio');
      } catch (err) {
        console.warn("Native Rust audio stop:", err);
      }
    }

    this.isListening = false;
    this.callbacks.onStatusChange?.(false);
    this.stopAudioMonitoring();
    if (this.unlistenTauriMic) {
      this.unlistenTauriMic();
      this.unlistenTauriMic = null;
    }
  }

  private async startAudioMonitoring() {
    try {
      if (!this.mediaStream) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!this.analyser || !this.shouldKeepListening) return;
        this.analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalizedLevel = Math.min(100, Math.round((average / 128) * 100));

        this.callbacks.onAudioLevel?.(normalizedLevel);
        this.animFrameId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err) {
      console.warn("Audio monitoring unavailable:", err);
    }
  }

  private stopAudioMonitoring() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.callbacks.onAudioLevel?.(0);
  }
}
