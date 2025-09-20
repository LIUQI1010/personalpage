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

  // 滚动状态管理
  const [isScrolled, setIsScrolled] = useState(false);

  // 合并的滚动处理 - 避免多个滚动监听器冲突
  useGSAP(() => {
    if (!navRef.current) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      // 更新滚动状态（用于样式变化）
      setIsScrolled(currentScrollY > 50);

      // 导航栏显示/隐藏逻辑 - 增加最小滚动距离避免抖动
      if (scrollDelta < 3) {
        // 滚动距离太小，忽略以避免抖动
        ticking = false;
        return;
      }

      // 在页面顶部时始终显示导航栏
      if (currentScrollY <= 10) {
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        // 向下滚动时隐藏导航栏，向上滚动时显示
        if (scrollDirection === 'down' && scrollDelta > 8) {
          gsap.to(navRef.current, {
            y: '-100%',
            duration: 0.3,
            ease: 'power2.out',
          });
        } else if (scrollDirection === 'up' && scrollDelta > 8) {
          gsap.to(navRef.current, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });

    return () => {
      window.removeEventListener('scroll', requestTick);
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

  // 点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = event => {
      if (isMenuOpen && navRef.current && !navRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

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
              style={{
                fontFamily:
                  'Circular, "SF Pro Display", "Avenir Next", "Helvetica Neue", sans-serif',
                fontWeight: '700',
                transform: 'scale(1.1) rotate(45deg)',
                color: '#9B8B7A', // 莫兰迪色 - 温暖的灰褐色
              }}
            >
              Q
            </span>
            i Liu
          </span>
          <span className='hidden md:inline'>
            <span
              className='inline-block font-black'
              style={{
                fontFamily:
                  'Circular, "SF Pro Display", "Avenir Next", "Helvetica Neue", sans-serif',
                fontWeight: '700',
                transform: 'scale(1.1) rotate(45deg)',
                color: '#9B8B7A', // 莫兰迪色 - 温暖的灰褐色
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
          className='md:hidden p-4 min-w-[48px] min-h-[48px] rounded-md text-white hover:bg-white/10 hover:text-white transition-colors flex items-center justify-center'
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
                onClick={e => {
                  e.preventDefault();
                  // 立即关闭菜单，不检查动画状态
                  setIsMenuOpen(false);
                  // 让链接正常工作
                  setTimeout(() => {
                    const target = document.querySelector(item.href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 50);
                }}
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
