import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X, User, LogOut } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import CursorTrail from './CursorTrail';
import AuthModal from './AuthModal';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        if (event === 'SIGNED_IN') {
          setIsAuthModalOpen(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Handle page transitions
  useEffect(() => {
    if (displayChildren !== children) {
      setIsTransitioning(true);
      
      // Start fade out
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        window.scrollTo(0, 0);
        
        // Start fade in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [children, displayChildren]);

  // Initialize display children
  useEffect(() => {
    setDisplayChildren(children);
  }, []);

  // Scroll to top when location changes (backup)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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

    let animationId: number;
    const gridSize = 40;
    let mouseX = 0;
    let mouseY = 0;

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

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw base grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Check if cursor is over any element for eclipse effect
      const isOverElement = isOverAnyElement(mouseX, mouseY);

      // Draw interactive grid around cursor with eclipse effect
      const radius = 150;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        for (let y = 0; y <= canvas.height; y += gridSize) {
          const distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
          if (distance < radius) {
            const baseOpacity = (1 - distance / radius) * 0.4;
            
            // Apply eclipse effect - reduce opacity when over any elements
            const eclipseMultiplier = isOverElement ? 0.1 : 1;
            const opacity = baseOpacity * eclipseMultiplier;
            
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(x - gridSize/2, y - gridSize/2, gridSize, gridSize);
            
            // Add subtle shadow effect when eclipsed
            if (isOverElement && distance < radius * 0.6) {
              ctx.strokeStyle = `rgba(0, 0, 0, ${baseOpacity * 0.15})`;
              ctx.lineWidth = 1;
              ctx.strokeRect(x - gridSize/2 + 1, y - gridSize/2 + 1, gridSize, gridSize);
            }
          }
        }
      }

      animationId = requestAnimationFrame(drawGrid);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    drawGrid();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Demo', href: '/demo' },
    { name: 'Features', href: '/features' },
    { name: 'Examples', href: '/examples' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Animated Grid Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* Cursor Trail */}
      <CursorTrail />

      {/* Header */}
      <header className="relative z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <Scale className="h-8 w-8 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">LegalMind AI</h1>
                <p className="text-xs text-gray-400 hidden sm:block">Advanced Legal Intelligence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-white ${
                    location.pathname === item.href
                      ? 'text-white border-b-2 border-white pb-1'
                      : 'text-gray-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoading ? (
                <div className="w-20 h-10 bg-white/10 rounded-lg animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="px-4 py-2 text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block text-sm font-medium transition-colors duration-300 ${
                    location.pathname === item.href ? 'text-white' : 'text-gray-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-white text-sm">{user.email}</div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-white border border-white/20 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="w-full px-4 py-2 text-white border border-white/20 rounded-lg"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="w-full px-4 py-2 bg-white text-black rounded-lg font-medium"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with Transition */}
      <main className="relative z-10">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isTransitioning 
              ? 'opacity-0 transform translate-y-4' 
              : 'opacity-100 transform translate-y-0'
          }`}
        >
          {displayChildren}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/90 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <Scale className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">LegalMind AI</h3>
                  <p className="text-sm text-gray-400">Advanced Legal Intelligence</p>
                </div>
              </div>
              <p className="text-gray-400 max-w-md">
                Revolutionizing legal practice with AI-powered case analysis, 
                temporal reasoning, and comprehensive precedent discovery.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                <li><Link to="/examples" className="hover:text-white transition-colors">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LegalMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Layout;