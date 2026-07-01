"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  isLikelyMp3,
  markdownToSpeechText,
  splitSpeechText,
} from "@/lib/speech-text";

const AUTO_LISTEN_KEY = "travelgeek-auto-listen";

function readAutoListen(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTO_LISTEN_KEY) === "true";
}

export function useSpeechOutput() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(readAutoListen);

  const autoPlayRef = useRef(readAutoListen());
  const sessionRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  const stop = useCallback(() => {
    sessionRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    audioRef.current?.pause();
    audioRef.current = null;
    setSpeakingId(null);
  }, []);

  const speak = useCallback(async (markdown: string, id: string) => {
    const text = markdownToSpeechText(markdown);
    if (!text) return;

    sessionRef.current += 1;
    const session = sessionRef.current;
    abortRef.current?.abort();
    audioRef.current?.pause();

    setSpeakingId(id);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      for (const chunk of splitSpeechText(text)) {
        if (sessionRef.current !== session) return;

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chunk }),
          signal: controller.signal,
        });

        const buffer = await res.arrayBuffer();
        if (!res.ok || !isLikelyMp3(buffer)) continue;

        const url = URL.createObjectURL(
          new Blob([buffer], { type: "audio/mpeg" }),
        );
        const audio = new Audio(url);
        audioRef.current = audio;

        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("Playback failed"));
          };
          void audio.play().catch(reject);
        });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") stop();
    } finally {
      if (sessionRef.current === session) {
        abortRef.current = null;
        setSpeakingId(null);
      }
    }
  }, [stop]);

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
