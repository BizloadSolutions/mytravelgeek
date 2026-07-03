"use client";

import {
  DEFAULT_SILENCE_MS,
  hasTrailingThanks,
  STOP_ON_THANKS_MS,
  stripTrailingThanks,
} from "@/components/utils/helpers";
import { useCallback, useEffect, useRef, useState } from "react";

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

const LANG = "en-US";
const RESTART_DELAY_MS = 120;

function buildTranscript(committed: string, interim: string): string {
  const live = interim.trim();
  if (!live) return committed;
  return committed ? `${committed} ${live}` : live;
}

export type UseVoiceInputOptions = {
  /** Called with each finalized speech chunk. */
  onResult?: (finalText: string) => void;
  /** Called with the full live transcript (committed + interim) on every update. */
  onTranscript?: (text: string) => void;
  /** Fired after `silenceMs` with no new speech while the mic is active. */
  onSilence?: () => void;
  silenceMs?: number;
};

export type UseVoiceInputReturn = {
  interim: string;
  listening: boolean;
  supported: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  toggle: () => void;
};

/** Merge committed text with live interim speech for textarea display. */
export function voiceDisplayText(
  base: string,
  interim: string,
  listening: boolean,
): string {
  if (!listening || !interim.trim()) return base;
  return `${base}${base ? " " : ""}${interim}`;
}

export function useVoiceInput({
  onResult,
  onTranscript,
  onSilence,
  silenceMs = DEFAULT_SILENCE_MS,
}: UseVoiceInputOptions = {}): UseVoiceInputReturn {
  const [interim, setInterim] = useState("");
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recRef = useRef<SpeechRecognition | null>(null);
  const activeRef = useRef(false);
  const hasSpokenRef = useRef(false);
  const committedRef = useRef("");
  const interimLiveRef = useRef("");
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onResultRef = useRef(onResult);
  const onTranscriptRef = useRef(onTranscript);
  const onSilenceRef = useRef(onSilence);
  const silenceMsRef = useRef(silenceMs);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    onSilenceRef.current = onSilence;
  }, [onSilence]);

  useEffect(() => {
    silenceMsRef.current = silenceMs;
  }, [silenceMs]);

  useEffect(() => {
    const speechSupported = !!(
      window.SpeechRecognition || window.webkitSpeechRecognition
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSupported(speechSupported);
  }, []);

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const publishTranscript = useCallback(() => {
    const full = buildTranscript(committedRef.current, interimLiveRef.current);
    onTranscriptRef.current?.(full);
    return full;
  }, []);

  const flushInterim = useCallback(() => {
    const leftover = interimLiveRef.current.trim();
    if (!leftover) return committedRef.current;

    committedRef.current = buildTranscript(committedRef.current, leftover);
    interimLiveRef.current = "";
    setInterim("");
    onResultRef.current?.(leftover);
    onTranscriptRef.current?.(committedRef.current);
    return committedRef.current;
  }, []);

  const scheduleSilenceCheck = useCallback(
    (full: string) => {
      if (!onSilenceRef.current) return;

      clearSilenceTimer();
      const delay = hasTrailingThanks(full)
        ? STOP_ON_THANKS_MS
        : silenceMsRef.current;

      silenceTimerRef.current = setTimeout(() => {
        if (!activeRef.current || !hasSpokenRef.current) return;

        let text = flushInterim();
        if (hasTrailingThanks(text)) {
          text = stripTrailingThanks(text);
          committedRef.current = text;
          onTranscriptRef.current?.(text);
        }

        onSilenceRef.current?.();
      }, delay);
    },
    [clearSilenceTimer, flushInterim],
  );

  const getRecognizer = useCallback((): SpeechRecognitionConstructor => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) throw new Error("Speech recognition not supported");
    return SR;
  }, []);

  const beginRecognition = useCallback(() => {
    const SR = getRecognizer();
    recRef.current?.abort();

    const rec = new SR();
    rec.lang = LANG;
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (e) => {
      if (!activeRef.current) return;

      let finalChunk = "";
      let interimChunk = "";

      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalChunk += transcript;
        else interimChunk += transcript;
      }

      if (finalChunk) {
        const trimmed = finalChunk.trim();
        if (trimmed && !committedRef.current.trim().endsWith(trimmed)) {
          committedRef.current = buildTranscript(committedRef.current, trimmed);
        }
        onResultRef.current?.(finalChunk);
      }

      interimLiveRef.current = interimChunk;
      setInterim(interimChunk);

      const full = publishTranscript();
      if (full.trim()) {
        hasSpokenRef.current = true;
        scheduleSilenceCheck(full);
      }
    };

    rec.onerror = (e) => {
      if (
        e.error === "no-speech" ||
        e.error === "aborted" ||
        e.error === "network"
      )
        return;

      const message =
        e.error === "audio-capture"
          ? "No microphone found. Check your device settings."
          : e.error === "not-allowed"
            ? "Microphone permission denied. Allow access and try again."
            : `Mic error: ${e.error}`;

      setError(message);
      activeRef.current = false;
      setListening(false);
      clearRestartTimer();
      clearSilenceTimer();
      interimLiveRef.current = "";
      setInterim("");
    };

    rec.onend = () => {
      if (!activeRef.current) {
        setListening(false);
        return;
      }

      clearRestartTimer();
      restartTimerRef.current = setTimeout(() => {
        if (!activeRef.current) {
          setListening(false);
          return;
        }
        try {
          beginRecognition();
        } catch {
          activeRef.current = false;
          setListening(false);
          setError("Voice input stopped. Tap the mic to try again.");
        }
      }, RESTART_DELAY_MS);
    };

    recRef.current = rec;
    rec.start();
  }, [
    clearRestartTimer,
    clearSilenceTimer,
    getRecognizer,
    publishTranscript,
    scheduleSilenceCheck,
  ]);

  const resetSession = useCallback(() => {
    committedRef.current = "";
    interimLiveRef.current = "";
    hasSpokenRef.current = false;
    setInterim("");
    onTranscriptRef.current?.("");
  }, []);

  const start = useCallback(async () => {
    try {
      getRecognizer();
    } catch {
      setError("Speech recognition not supported. Use Chrome or Edge.");
      return;
    }

    setError(null);
    clearRestartTimer();
    clearSilenceTimer();
    resetSession();

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access denied. Allow mic access and try again.");
      return;
    }

    activeRef.current = true;
    setListening(true);

    try {
      beginRecognition();
    } catch {
      activeRef.current = false;
      setListening(false);
      setError("Could not start voice input. Tap the mic to try again.");
    }
  }, [
    beginRecognition,
    clearRestartTimer,
    clearSilenceTimer,
    getRecognizer,
    resetSession,
  ]);

  const stop = useCallback(() => {
    activeRef.current = false;
    setListening(false);
    clearRestartTimer();
    clearSilenceTimer();
    committedRef.current = "";
    hasSpokenRef.current = false;
    interimLiveRef.current = "";
    setInterim("");
    onTranscriptRef.current?.("");
    recRef.current?.abort();
    recRef.current = null;
  }, [clearRestartTimer, clearSilenceTimer]);

  const toggle = useCallback(() => {
    if (activeRef.current) stop();
    else void start();
  }, [start, stop]);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      clearRestartTimer();
      clearSilenceTimer();
      recRef.current?.abort();
      recRef.current = null;
    };
  }, [clearRestartTimer, clearSilenceTimer]);

  return { interim, listening, supported, error, start, stop, toggle };
}
