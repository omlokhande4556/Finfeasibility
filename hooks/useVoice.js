// hooks/useVoice.js
"use client";
import { useState, useRef, useCallback } from "react";

export function useVoice() {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = useCallback((lang, onResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input isn't supported in this browser. Try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("Recognition started, listening for:", lang);
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log("Heard:", text);
      onResult(text);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error); // NEW — actually log it
      setListening(false);

      if (event.error === "not-allowed") {
        alert("Microphone access was blocked. Please allow mic permission in your browser settings.");
      } else if (event.error === "no-speech") {
        alert("No speech detected. Try again.");
      } else if (event.error === "language-not-supported") {
        alert("This language isn't supported by your browser's speech engine.");
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, []);

  const speak = useCallback((text, lang) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { listening, startListening, speak };
}