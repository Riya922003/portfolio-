"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import JSZip from "jszip";
import defaultAnimation from "@/assets/connect-animation.json";

type Props = {
  src?: string; // public path to animation JSON or .lottie file
  className?: string;
};

const LottiePlayer: React.FC<Props> = ({ src, className }) => {
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!src) {
        setData(defaultAnimation);
        return;
      }

      // If it's an mp4 video, we don't need to fetch JSON — handled in render
      if (src.endsWith('.mp4')) {
        // don't attempt JSON parsing
        setData(null);
        setError(null);
        return;
      }

      try {
        const res = await fetch(src);
        const contentType = res.headers.get("content-type") || "";

        // If it's JSON, parse directly
        if (contentType.includes("application/json") || contentType.includes("application/ld+json") || src.endsWith('.json')) {
          const json = await res.json();
          if (mounted) setData(json);
          return;
        }

        // Attempt to read as text and parse JSON
        const text = await res.text();
        try {
          const json = JSON.parse(text);
          if (mounted) setData(json);
          return;
        } catch (e) {
          // Not raw JSON — try unzip (binary .lottie)
        }

        // Try unzip as a .lottie zip bundle and find data.json
        const arrayBuffer = await res.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        // prefer data.json or animation.json
        const candidates = ['data.json', 'animation.json', 'data/animation.json'];
        for (const name of candidates) {
          const file = zip.file(name);
          if (file) {
            const content = await file.async('string');
            const json = JSON.parse(content);
            if (mounted) setData(json);
            return;
          }
        }
        // fallback: pick first .json file in zip
        const jsonFile = Object.keys(zip.files).find(f => f.endsWith('.json'));
        if (jsonFile) {
          const content = await zip.file(jsonFile)!.async('string');
          const json = JSON.parse(content);
          if (mounted) setData(json);
          return;
        }
        throw new Error('no json inside lottie bundle');
      } catch (err: any) {
        console.warn("Failed to load Lottie from", src, err?.message || err);
        if (mounted) {
          setError("Animation unavailable");
          setData(defaultAnimation);
        }
      }
    }

    load();

    return () => { mounted = false; };
  }, [src]);

  const animation = data;
  const hasAnimation = animation && animation.layers && animation.layers.length > 0;

  return (
    <div className={(className ? className + " " : "") + "lottie-viewport"} role="img" aria-label="animation">
      {src && src.endsWith('.mp4') ? (
        <video src={src} autoPlay muted loop playsInline className="w-full h-full object-contain" />
      ) : hasAnimation ? (
        <Lottie animationData={animation} loop autoplay style={{ width: "100%", height: "100%" }} />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-sm text-neutral-400">{error ?? "Animation unavailable"}</div>
      )}
    </div>
  );
};

export default LottiePlayer;
