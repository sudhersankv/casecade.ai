import React, { useEffect, useRef } from 'react';

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPoints = useRef<Array<{ x: number; y: number; age: number }>>([]);
  const eclipsePoints = useRef<Array<{ x: number; y: number; age: number; angle: number; radius: number }>>([]);
  const animationRef = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });

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

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      // Add main trail point
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0
      });

      // Add eclipse/orbital points
      for (let i = 0; i < 3; i++) {
        eclipsePoints.current.push({
          x: e.clientX,
          y: e.clientY,
          age: 0,
          angle: Math.random() * Math.PI * 2,
          radius: 20 + Math.random() * 40
        });
      }

      // Limit trail length
      if (trailPoints.current.length > 25) {
        trailPoints.current.shift();
      }
      
      if (eclipsePoints.current.length > 60) {
        eclipsePoints.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw main trail points
      trailPoints.current = trailPoints.current.filter(point => {
        point.age += 1;
        
        if (point.age < 25) {
          const opacity = (25 - point.age) / 25;
          const size = 8 - (point.age * 0.25);
          
          // Draw main glowing circle
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
          ctx.fill();
          
          // Draw outer glow
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
          ctx.fill();
          
          // Draw inner bright core
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.fill();
          
          return true;
        }
        return false;
      });

      // Update and draw eclipse/orbital points
      eclipsePoints.current = eclipsePoints.current.filter(point => {
        point.age += 1;
        point.angle += 0.1;
        
        if (point.age < 60) {
          const opacity = (60 - point.age) / 60;
          const size = 3 - (point.age * 0.04);
          
          // Calculate orbital position
          const orbitX = point.x + Math.cos(point.angle) * point.radius * (1 - point.age / 60);
          const orbitY = point.y + Math.sin(point.angle) * point.radius * (1 - point.age / 60);
          
          // Draw orbital point
          ctx.beginPath();
          ctx.arc(orbitX, orbitY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.fill();
          
          // Draw orbital glow
          ctx.beginPath();
          ctx.arc(orbitX, orbitY, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
          ctx.fill();
          
          // Draw connection line to center (eclipse effect)
          if (point.age < 30) {
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(orbitX, orbitY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          
          return true;
        }
        return false;
      });

      // Draw connecting lines between recent trail points
      if (trailPoints.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailPoints.current[0].x, trailPoints.current[0].y);
        
        for (let i = 1; i < Math.min(trailPoints.current.length, 8); i++) {
          const point = trailPoints.current[i];
          const opacity = (8 - i) / 8 * 0.3;
          ctx.lineTo(point.x, point.y);
        }
        
        ctx.strokeStyle = `rgba(255, 255, 255, 0.2)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default CursorTrail;