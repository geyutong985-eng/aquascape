"use client";

import { useEffect, useRef } from "react";

export function WaveDecoration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Draw gentle wave lines across the full screen
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // More spacing between waves
      const waveCount = 6;
      const spacing = canvas.height / (waveCount + 1);

      const waves = Array.from({ length: waveCount }, (_, i) => ({
        y: spacing * (i + 1) - 20,
        amplitude: 14,
        frequency: 0.008 + i * 0.002,
        opacity: 0.08,
      }));

      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);

        for (let x = 0; x <= canvas.width; x++) {
          const y = wave.y + Math.sin(x * wave.frequency) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(11, 94, 97, ${wave.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}