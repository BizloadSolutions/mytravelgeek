"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { markdownToSpeechText } from "@/lib/speech-text";

const AUTO_LISTEN_KEY = "travelgeek-auto-listen";

function readAutoListen(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTO_LISTEN_KEY) === "true";
}

export function useSpeechOutput() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const autoPlayRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urlRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const stored = readAutoListen();
    autoPlayRef.current = stored;
    setAutoPlay(stored);
  }, []);

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    async (markdown: string, id: string) => {
      const text = markdownToSpeechText(markdown);
      if (!text) return;

      stop();
      setSpeakingId(id);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("TTS request failed");

        const blob = await res.blob();
        if (abortRef.current !== controller) return;

        const url = URL.createObjectURL(blob);
        urlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => stop();
        audio.onerror = () => stop();

        await audio.play();
      } catch (err) {
        if ((err as Error).name !== "AbortError") stop();
      }
    },
    [stop],
  );

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((on) => {
      const next = !on;
      localStorage.setItem(AUTO_LISTEN_KEY, String(next));
      autoPlayRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => () => stop(), [stop]);

  return {
    speakingId,
    autoPlay,
    autoPlayRef,
    speak,
    stop,
    toggleAutoPlay,
  };
}
