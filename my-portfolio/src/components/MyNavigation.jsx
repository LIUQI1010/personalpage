import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from './ui/navigation-menu';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MyNavigation() {
  const logoRef = useRef(null); // Logo 文字元素的引用，用于 GSAP SplitText 动画
  const mobileMenuRef = useRef(null); // 移动端菜单容器的引用，用于打开/关闭动画
  const menuItemsRef = useRef([]); // 移动端菜单项的引用数组，用于错位动画效果
  const navRef = useRef(null); // 导航栏容器的引用，用于滚动时的显示/隐藏动画
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 控制移动端菜单的开关状态
  const [shouldRenderMenu, setShouldRenderMenu] = useState(false); // 控制菜单是否渲染到DOM，确保关闭动画完整播放
  const [isAnimating, setIsAnimating] = useState(false); // 防止动画过程中的重复操作，避免动画冲突

  // 路由相关
  const location = useLocation();
  const navigate = useNavigate();
  const isComponentsPage = location.pathname === '/my-components';

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

  // 合并的滚动处理 - 避免多个滚动监听器冲突
  useGSAP(() => {
    if (!navRef.current) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      const scrollDelta = Math.abs(currentScrollY - lastScrollY);

      // 在组件页面禁用导航栏自动收起功能
      if (isComponentsPage) {
        // 在组件页面始终保持导航栏显示
        gsap.to(navRef.current, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
        ticking = false;
        return;
      }

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
  }, [isComponentsPage]);

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
      ease: 'power2.out',
    })
      // Then animate container out
      .to(mobileMenuRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
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

  // 处理导航点击事件
  const handleNavigationClick = (item, e) => {
    e.preventDefault();
    closeMenu();

    if (item.type === 'route') {
      // 路由跳转
      navigate(item.href);
    } else if (item.type === 'anchor') {
      // 当前页面锚点跳转
      const target = document.querySelector(item.href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.type === 'home-anchor') {
      // 跳转到主页的锚点
      navigate(item.href);
    }
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

  // 根据当前页面返回不同的导航项
  const getNavigationItems = () => {
    if (isComponentsPage) {
      // 在组件库页面，不显示主页，只显示锚点链接和当前页面
      return [
        { href: '/#about', label: 'About', type: 'home-anchor' },
        { href: '/#projects', label: 'Projects', type: 'home-anchor' },
        { href: '/#experience', label: 'Experience', type: 'home-anchor' },
        { href: '/#blog', label: 'Blog', type: 'home-anchor' },
        { href: '/#contact', label: 'Contact', type: 'home-anchor' },
        { href: '/my-components', label: 'Components', type: 'route', active: true },
      ];
    } else {
      // 在主页，显示锚点导航和组件库链接
      return [
        { href: '#about', label: 'About', type: 'anchor' },
        { href: '#projects', label: 'Projects', type: 'anchor' },
        { href: '#experience', label: 'Experience', type: 'anchor' },
        { href: '#blog', label: 'Blog', type: 'anchor' },
        { href: '#contact', label: 'Contact', type: 'anchor' },
        { href: '/my-components', label: 'Components', type: 'route' },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav
      ref={navRef}
      className='fixed left-0 right-0 w-full z-50 transition-all duration-300'
      style={{
        top: 'env(safe-area-inset-top, 0px)',
        paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        // Safari iOS 优化
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        // 支持动态岛和紧凑标签栏模式
        minHeight: 'max(44px, env(safe-area-inset-top, 0px) + 44px)',
      }}
    >
      {/* Main navigation bar */}
      <div className='flex items-center justify-between px-4 md:px-8 py-2'>
        {/* Left side - Logo */}
        <button
          className='text-lg font-semibold cursor-pointer hover:opacity-80 transition-opacity duration-200'
          ref={logoRef}
          onClick={() => window.location.reload()}
          style={{
            color: 'white',
            background: 'none',
            border: 'none',
            padding: 0,
          }}
          aria-label='刷新页面'
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
          <span className='hidden md:inline'>Qi Liu</span>
        </button>

        {/* Desktop navigation - Hidden on mobile */}
        <div className='hidden md:block'>
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map(item => (
                <NavigationMenuItem key={item.href} className='desktop-menu-item'>
                  <NavigationMenuLink
                    href={item.href}
                    onClick={e => handleNavigationClick(item, e)}
                    className={item.active ? 'text-blue-400 font-semibold' : ''}
                  >
                    {item.label}
                  </NavigationMenuLink>
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
          className='md:hidden absolute left-0 w-full border-b border-white/20 shadow-lg z-50'
          style={{
            top: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            // Safari iOS 优化
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)',
          }}
        >
          <nav className='py-4'>
            {navigationItems.map((item, index) => (
              <a
                key={item.href}
                ref={el => (menuItemsRef.current[index] = el)}
                href={item.href}
                className={`block px-6 py-3 text-sm font-medium hover:bg-white/10 hover:text-white transition-colors ${
                  item.active ? 'text-blue-400 font-semibold bg-white/5' : 'text-white'
                }`}
                onClick={e => handleNavigationClick(item, e)}
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
