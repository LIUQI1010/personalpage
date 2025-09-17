import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from './ui/navigation-menu';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

export default function MyNavigation() {
  const logoRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useGSAP(() => {
    if (!logoRef.current) return;

    const logoSplit = new SplitText(logoRef.current, {
      type: 'words',
    });

    gsap.from(logoSplit.words, {
      opacity: 0,
      yPercent: 100,
      duration: 0.8,
      ease: 'elastic.out',
      stagger: 0.1,
    });

    return () => {
      logoSplit.revert();
    };
  }, []);

  // Animation functions - defined before useEffect
  const animateMenuOpen = useCallback(() => {
    if (!mobileMenuRef.current) return;

    setIsAnimating(true);
    const tl = gsap.timeline();

    // Set initial states
    gsap.set(mobileMenuRef.current, {
      y: -20,
      opacity: 0,
    });

    gsap.set(menuItemsRef.current, {
      x: -30,
      opacity: 0,
    });

    // Animate container first
    tl.to(mobileMenuRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out',
    })
      // Then animate menu items with stagger
      .to(menuItemsRef.current, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.2)',
        onComplete: () => setIsAnimating(false),
      });
  }, []);

  const animateMenuClose = useCallback(() => {
    if (!mobileMenuRef.current) return;

    setIsAnimating(true);
    const tl = gsap.timeline();

    // Animate items out first
    tl.to(menuItemsRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.2,
      stagger: 0.03,
      ease: 'power2.in',
    })
      // Then animate container out
      .to(mobileMenuRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          setIsAnimating(false);
          setShouldRenderMenu(false);
        },
      });
  }, []);

  // Handle menu state changes
  useEffect(() => {
    if (isMenuOpen) {
      setShouldRenderMenu(true);
    } else if (shouldRenderMenu) {
      // Start close animation
      animateMenuClose();
    }
  }, [isMenuOpen, shouldRenderMenu, animateMenuClose]);

  // Mobile menu animation
  useEffect(() => {
    if (!shouldRenderMenu || !mobileMenuRef.current) return;

    if (isMenuOpen) {
      animateMenuOpen();
    }
  }, [shouldRenderMenu, isMenuOpen, animateMenuOpen]);

  const toggleMenu = () => {
    if (isAnimating) return;
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (isAnimating) return;
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div className='w-full relative'>
      {/* Main navigation bar */}
      <div className='flex items-center justify-between px-4 md:px-8 py-2'>
        {/* Left side - Logo */}
        <div className='text-lg font-semibold' ref={logoRef}>
          <span className='md:hidden'>Qi Liu</span>
          <span className='hidden md:inline'>Qi (Chee) Liu</span>
        </div>

        {/* Desktop navigation - Hidden on mobile */}
        <div className='hidden md:block'>
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map(item => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink href={item.href}>{item.label}</NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile hamburger menu button - Hidden on desktop */}
        <button
          className='md:hidden p-2 rounded-md text-white hover:bg-white/10 hover:text-white transition-colors'
          onClick={toggleMenu}
          aria-label='Toggle navigation menu'
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {shouldRenderMenu && (
        <div
          ref={mobileMenuRef}
          className='md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-sm border-b border-white/20 shadow-lg z-50'
        >
          <nav className='py-4'>
            {navigationItems.map((item, index) => (
              <a
                key={item.href}
                ref={el => (menuItemsRef.current[index] = el)}
                href={item.href}
                className='block px-6 py-3 text-sm font-medium text-white hover:bg-white/10 hover:text-white transition-colors'
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
