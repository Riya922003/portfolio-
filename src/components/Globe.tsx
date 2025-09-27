"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

const Globe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [, setReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [{ location: [20.5937, 78.9629], size: 0.1 }],
      onRender: (state: any) => {
        // increment local phi and update the globe state to create a slow spin
        phi += 0.005;
        state.phi = phi;
        return state;
      },
    });

    setReady(true);

    return () => {
      // cleanup
      if (globe && typeof (globe as any).destroy === "function") {
        (globe as any).destroy();
      }
    };
  }, []);

  return (
    <div style={{ width: 600, maxWidth: "100%" }}>
      <canvas ref={canvasRef} style={{ width: 600, height: 600, maxWidth: "100%" }} />
    </div>
  );
};

export default Globe;
