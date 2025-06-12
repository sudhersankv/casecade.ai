import React, { useEffect, useRef } from 'react';

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPoints = useRef<Array<{ x: number; y: number; age: number; isEclipsed?: boolean }>>([]);
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

    // Function to check if cursor is over any visible element (including text)
    const isOverAnyElement = (x: number, y: number): boolean => {
      const elements = document.elementsFromPoint(x, y);
      return elements.some(el => {
        // Skip the canvas itself and body/html
        if (el.tagName.toLowerCase() === 'canvas' || 
            el.tagName.toLowerCase() === 'body' || 
            el.tagName.toLowerCase() === 'html') {
          return false;
        }

        // Check for any element with content
        const hasContent = el.textContent && el.textContent.trim().length > 0;
        const hasBackground = window.getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)';
        const hasBorder = window.getComputedStyle(el).borderWidth !== '0px';
        const isInteractive = el.tagName.toLowerCase() === 'button' || 
                             el.tagName.toLowerCase() === 'a' || 
                             el.tagName.toLowerCase() === 'input' || 
                             el.tagName.toLowerCase() === 'textarea' ||
                             el.tagName.toLowerCase() === 'select' ||
                             el.classList.contains('group') || 
                             el.closest('button') ||
                             el.closest('a') ||
                             el.closest('input') ||
                             el.closest('textarea') ||
                             el.closest('[role="button"]') ||
                             el.getAttribute('role') === 'button' ||
                             window.getComputedStyle(el).cursor === 'pointer';

        // Eclipse if element has text content, background, border, or is interactive
        return hasContent || hasBackground || hasBorder || isInteractive;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      
      // Check if cursor is over any element
      const isOverElement = isOverAnyElement(e.clientX, e.clientY);
      
      trailPoints.current.push({
        x: e.clientX,
        y: e.clientY,
        age: 0,
        isEclipsed: isOverElement
      });

      // Limit trail length
      if (trailPoints.current.length > 20) {
        trailPoints.current.shift();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Check current mouse position for eclipse effect
      const currentlyOverElement = isOverAnyElement(
        mousePosition.current.x, 
        mousePosition.current.y
      );

      // Update and draw trail points
      trailPoints.current = trailPoints.current.filter((point) => {
        point.age += 1;
        
        if (point.age < 20) {
          const baseOpacity = (20 - point.age) / 20;
          const size = 8 - (point.age * 0.3);
          
          // Apply eclipse effect - reduce opacity when over any elements
          const eclipseMultiplier = (point.isEclipsed || currentlyOverElement) ? 0.15 : 1;
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