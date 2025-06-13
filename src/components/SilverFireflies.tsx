import React, { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  life: number;
  maxLife: number;
}

const SilverFireflies: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firefliesRef = useRef<Firefly[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize fireflies
    const initFireflies = () => {
      firefliesRef.current = [];
      const numFireflies = Math.floor((window.innerWidth * window.innerHeight) / 15000); // Density based on screen size
      
      for (let i = 0; i < numFireflies; i++) {
        firefliesRef.current.push(createFirefly());
      }
    };

    const createFirefly = (): Firefly => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, // Very slow movement
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5, // Small sizes
      opacity: Math.random() * 0.6 + 0.2,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.01, // Slow twinkle
      life: 0,
      maxLife: Math.random() * 1000 + 500 // Random lifespan
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      firefliesRef.current.forEach((firefly, index) => {
        // Update position
        firefly.x += firefly.vx;
        firefly.y += firefly.vy;
        firefly.life++;

        // Wrap around screen edges
        if (firefly.x < 0) firefly.x = canvas.width;
        if (firefly.x > canvas.width) firefly.x = 0;
        if (firefly.y < 0) firefly.y = canvas.height;
        if (firefly.y > canvas.height) firefly.y = 0;

        // Update twinkle
        firefly.twinklePhase += firefly.twinkleSpeed;
        const twinkleIntensity = (Math.sin(firefly.twinklePhase) + 1) / 2;

        // Calculate opacity with twinkle and life fade
        const lifeFade = firefly.life > firefly.maxLife * 0.8 
          ? 1 - ((firefly.life - firefly.maxLife * 0.8) / (firefly.maxLife * 0.2))
          : 1;
        
        const currentOpacity = firefly.opacity * twinkleIntensity * lifeFade * 0.8;

        // Draw firefly with silver glow
        const gradient = ctx.createRadialGradient(
          firefly.x, firefly.y, 0,
          firefly.x, firefly.y, firefly.size * 4
        );
        
        // Silver color palette
        gradient.addColorStop(0, `rgba(220, 220, 220, ${currentOpacity})`); // Bright silver center
        gradient.addColorStop(0.3, `rgba(192, 192, 192, ${currentOpacity * 0.8})`); // Medium silver
        gradient.addColorStop(0.6, `rgba(169, 169, 169, ${currentOpacity * 0.4})`); // Darker silver
        gradient.addColorStop(1, `rgba(169, 169, 169, 0)`); // Transparent edge

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.size * 4, 0, Math.PI * 2);
        ctx.fill();

        // Draw bright center dot
        ctx.fillStyle = `rgba(240, 240, 240, ${currentOpacity * 1.2})`;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.size * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Rare bright twinkle effect
        if (twinkleIntensity > 0.95 && Math.random() < 0.01) {
          const sparkleGradient = ctx.createRadialGradient(
            firefly.x, firefly.y, 0,
            firefly.x, firefly.y, firefly.size * 8
          );
          
          sparkleGradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity * 0.8})`);
          sparkleGradient.addColorStop(0.5, `rgba(220, 220, 220, ${currentOpacity * 0.4})`);
          sparkleGradient.addColorStop(1, `rgba(192, 192, 192, 0)`);

          ctx.fillStyle = sparkleGradient;
          ctx.beginPath();
          ctx.arc(firefly.x, firefly.y, firefly.size * 8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Remove dead fireflies and create new ones
        if (firefly.life > firefly.maxLife) {
          firefliesRef.current[index] = createFirefly();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    initFireflies();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default SilverFireflies;