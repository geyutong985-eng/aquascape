"use client";

import { useEffect, useRef } from "react";

interface Bubble {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobble: number;
  wobbleSpeed: number;
  opacity: number;
}

export function BubbleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const bubblesRef = useRef<Bubble[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    // Initialize scattered bubbles - all over the screen initially
    const initBubbles = () => {
      const count = 14;
      bubblesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height, // Scattered everywhere
        size: Math.random() * 20 + 6,
        speed: Math.random() * 0.3 + 0.1, // Faster: 0.1-0.4
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.008 + 0.002,
        opacity: Math.random() * 0.05 + 0.015,
      }));
    };

    initBubbles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bubblesRef.current.forEach((bubble) => {
        bubble.y -= bubble.speed;
        bubble.x += Math.sin(bubble.wobble) * 0.3;
        bubble.wobble += bubble.wobbleSpeed;

        // Reset when off screen - to random position
        if (bubble.y < -bubble.size * 2) {
          bubble.y = canvas.height + bubble.size;
          bubble.x = Math.random() * canvas.width;
          bubble.size = Math.random() * 20 + 6;
          bubble.opacity = Math.random() * 0.05 + 0.015;
        }

        // Subtle fill
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(11, 94, 97, ${bubble.opacity})`;
        ctx.fill();

        // Highlight
        ctx.beginPath();
        ctx.arc(
          bubble.x - bubble.size * 0.3,
          bubble.y - bubble.size * 0.3,
          bubble.size * 0.15,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = `rgba(255, 255, 255, ${bubble.opacity * 1.5})`;
        ctx.fill();

        // Thin ring
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(11, 94, 97, ${bubble.opacity * 2})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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