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
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

export default function MyNavigation() {
  const logoRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const navRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Logo文字分割效果（无动画）
  useGSAP(() => {
    if (!logoRef.current) return;

    const logoSplit = new SplitText(logoRef.current, {
      type: 'words',
    });

    // 给每个分割的词语应用白色样式
    logoSplit.words.forEach(word => {
      word.style.color = 'white';
    });

    return () => {
      logoSplit.revert();
    };
  }, []);

  // Q字母滚动旋转效果
  useGSAP(() => {
    const qLetters = document.querySelectorAll('[data-letter="Q"]');

    if (qLetters.length === 0) return;

    // 调色板：按顺序平滑轮换（更高对比度）
    const palette = ['#006d77', '#83c5be', '#edf6f9', '#ffddd2', '#e29578'];

    const hexToRgb = hex => {
      const h = hex.replace('#', '');
      const bigint = parseInt(h, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    };

    const rgbToHex = (r, g, b) => {
      const toHex = v => v.toString(16).padStart(2, '0');
      return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const interpolateHex = (from, to, t) => {
      const c1 = hexToRgb(from);
      const c2 = hexToRgb(to);
      const r = lerp(c1.r, c2.r, t);
      const g = lerp(c1.g, c2.g, t);
      const b = lerp(c1.b, c2.b, t);
      return rgbToHex(r, g, b);
    };

    // 立即设置初始状态，避免页面刷新时的跳动
    qLetters.forEach(q => {
      gsap.set(q, {
        rotation: 45, // 设置初始45度旋转
        force3D: true, // 启用GPU加速
      });
      q.style.willChange = 'transform'; // 优化动画性能
    });

    const handleScrollRotation = () => {
      const scrollY = window.scrollY;
      const rotation = 45 + scrollY * 0.5; // 初始倾斜45度，并随滚动旋转

      // 将旋转角映射到 [0, 1) 形成颜色循环进度
      const t = (((rotation % 360) + 360) % 360) / 360;
      const n = palette.length;
      const seg = Math.floor(t * n) % n;
      const next = (seg + 1) % n;
      const localT = t * n - seg;
      const color = interpolateHex(palette[seg], palette[next], localT);

      qLetters.forEach(q => {
        // 强制覆盖父级颜色，确保变色可见
        q.style.setProperty('color', color, 'important');
        q.style.setProperty('-webkit-text-fill-color', color, 'important');

        gsap.to(q, {
          rotation: rotation,
          duration: 0.1,
          ease: 'none',
          force3D: true, // 确保使用GPU加速
        });
      });
    };

    // 立即调用一次，设置基于当前滚动位置的正确状态
    handleScrollRotation();

    window.addEventListener('scroll', handleScrollRotation, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollRotation);
    };
  }, []);

  // 滚动状态管理
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <nav
      ref={navRef}
      className='fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Main navigation bar */}
      <div className='flex items-center justify-between px-4 md:px-8 py-2'>
        {/* Left side - Logo */}
        <div
          className='text-lg font-semibold'
          ref={logoRef}
          style={{
            color: 'white',
          }}
        >
          <span className='md:hidden'>
            <span
              className='inline-block font-black'
              data-letter='Q'
              style={{
                fontFamily:
                  'Circular, "SF Pro Display", "Avenir Next", "Helvetica Neue", sans-serif',
                fontWeight: '700',
                transform: 'scale(1.1)',
              }}
            >
              Q
            </span>
            i Liu
          </span>
          <span className='hidden md:inline'>
            <span
              className='inline-block font-black'
              data-letter='Q'
              style={{
                fontFamily:
                  'Circular, "SF Pro Display", "Avenir Next", "Helvetica Neue", sans-serif',
                fontWeight: '700',
                transform: 'scale(1.1)',
              }}
            >
              Q
            </span>
            i Liu
          </span>
        </div>

        {/* Desktop navigation - Hidden on mobile */}
        <div className='hidden md:block'>
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map(item => (
                <NavigationMenuItem key={item.href} className='desktop-menu-item'>
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
          className='md:hidden absolute top-full left-0 w-full border-b border-white/20 shadow-lg z-50'
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
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
    </nav>
  );
}
