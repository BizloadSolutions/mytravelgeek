"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The Web Speech API is not part of the standard TypeScript DOM lib, so we
// declare the minimal surface we rely on here.
interface SpeechRecognitionAlternative {
  readonly transcript: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type UseVoiceInputOptions = {
  /** BCP-47 language tag, e.g. "en-US". */
  lang?: string;
  /** Called with each finalized transcript chunk as the user speaks. */
  onResult?: (finalText: string) => void;
};

export type UseVoiceInputReturn = {
  /** Interim (not-yet-finalized) transcript for live preview. */
  interim: string;
  listening: boolean;
  supported: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  toggle: () => void;
};

export function useVoiceInput({
  lang = "en-US",
  onResult,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SpeechRecognition | null>(null);

  // Keep the latest callback without re-creating `start`.
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    // Feature detection is client-only (window/navigator are unavailable during
    // SSR), so support must be resolved after mount to avoid a hydration
    // mismatch. The one-time setState here is intentional.
    const speechSupported = !!(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
    const micSupported = !!navigator.mediaDevices?.getUserMedia;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(speechSupported && micSupported);
  }, []);

  const start = useCallback(async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setError("Speech recognition not supported. Use Chrome or Edge.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Microphone capture not supported in this browser.");
      return;
    }

    setError(null);

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError(
        "Microphone access denied or unavailable. Please allow mic access and refresh the page.",
      );
      return;
    }

    const rec = new SR();
    rec.lang = lang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onstart = () => setListening(true);
    rec.onend = () => {
      setListening(false);
      setInterim("");
    };
    rec.onerror = (e) => {
      const message =
        e.error === "audio-capture"
          ? "No microphone found or microphone access is blocked. Check your device and browser privacy settings."
          : e.error === "not-allowed"
            ? "Microphone permission denied. Please allow microphone access and refresh."
            : e.error === "no-speech"
              ? "Didn't catch that — please try speaking again."
              : `Mic error: ${e.error}`;
      setError(message);
      setListening(false);
    };
    rec.onresult = (e) => {
      let fin = "";
      let int = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += t;
        else int += t;
      }
      if (fin) onResultRef.current?.(fin);
      setInterim(int);
    };
    recRef.current = rec;
    rec.start();
  }, [lang]);

  const stop = useCallback(() => {
    recRef.current?.stop();
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else void start();
  }, [listening, start, stop]);

  // Stop recognition if the component using the hook unmounts.
  useEffect(() => {
    return () => recRef.current?.abort();
  }, []);

  return { interim, listening, supported, error, start, stop, toggle };
}

export default useVoiceInput;
