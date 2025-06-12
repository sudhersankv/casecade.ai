import React, { useEffect, useRef } from 'react';

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPoints = useRef<Array<{ x: number; y: number; age: number }>>([]);
  const animationRef = useRef<number>();
  const mousePosition = useRef({ x: 0, y: 0 });

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

    // Function to check if cursor is over an interactive element
    const isOverInteractiveElement = (x: number, y: number): boolean => {
      const elements = document.elementsFromPoint(x, y);
      return elements.some(el => {
        const tagName = el.tagName.toLowerCase();
        const hasInteractiveClass = el.classList.contains('group') || 
                                   el.classList.contains('hover:') ||
                                   el.closest('button') ||
                                   el.closest('a') ||
                                   el.closest('input') ||
                                   el.closest('textarea') ||
                                   el.closest('[role="button"]');
        
        return tagName === 'button' || 
               tagName === 'a' || 
               tagName === 'input' || 
               tagName === 'textarea' ||
               tagName === 'select' ||
               hasInteractiveClass ||
               el.getAttribute('role') === 'button' ||
               window.getComputedStyle(el).cursor === 'pointer';
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Check if cursor is over an interactive element
      const isOverElement = isOverInteractiveElement(e.clientX, e.clientY);
      
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        isEclipsed: isOverElement
      } as any);

      // Limit trail length
      if (trailPoints.current.length > 20) {
        trailPoints.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check current mouse position for eclipse effect
      const currentlyOverElement = isOverInteractiveElement(
        mousePosition.current.x, 
        mousePosition.current.y
      );

      // Update and draw trail points
      trailPoints.current = trailPoints.current.filter((point: any) => {
        point.age += 1;
        
        if (point.age < 20) {
          const baseOpacity = (20 - point.age) / 20;
          const size = 8 - (point.age * 0.3);
          
          // Apply eclipse effect - reduce opacity when over elements
          const eclipseMultiplier = (point.isEclipsed || currentlyOverElement) ? 0.2 : 1;
          const opacity = baseOpacity * eclipseMultiplier;
          
          // Draw main glowing circle with eclipse effect
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.6})`;
          ctx.fill();
          
          // Draw outer glow with stronger eclipse effect
          ctx.beginPath();
          ctx.arc(point.x, point.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.1})`;
          ctx.fill();
          
          // Add subtle shadow effect when eclipsed
          if (point.isEclipsed || currentlyOverElement) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${baseOpacity * 0.1})`;
            ctx.fill();
          }
          
          return true;
        }
        return false;
      });

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