import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const Blog = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);
  const decorationRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // 图片加载状态管理
  const [loadedImages, setLoadedImages] = useState(new Set([0, 1, 2])); // 默认显示前3张

  const subtitle = 'Captured across Aotearoa New Zealand';

  const images = [
    { src: '/img/blogs/Blue%20Spring.jpg', location: 'Blue Spring' },
    { src: '/img/blogs/Rotorua01.jpg', location: 'Rotorua' },
    { src: '/img/blogs/Taopo01.jpg', location: 'Taopo' },
    { src: '/img/blogs/Taopo02.jpg', location: 'Taopo' },
    { src: '/img/blogs/Wellington01.JPG', location: 'Wellington' },
    { src: '/img/blogs/Wellington02.JPG', location: 'Wellington' },
  ];

  // 预加载所有图片
  useEffect(() => {
    images.forEach((img, index) => {
      const imageElement = new Image();
      imageElement.src = img.src;
      // 预加载但不需要状态管理，让浏览器缓存处理
    });
  }, []);

  // GSAP图片淡入动画
  const animateImageIn = (imageElement, delay = 0) => {
    if (!imageElement) return;

    gsap.fromTo(
      imageElement,
      {
        opacity: 0,
        scale: 0.9,
        y: 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: delay,
        onComplete: () => {
          // 动画完成后，确保图片可以正常hover
          imageElement.style.transform = '';
          imageElement.style.opacity = '1';
        },
      }
    );
  };

  // 加载图片的通用函数
  const loadImagesByIndices = indices => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      indices.forEach(index => newSet.add(index));
      return newSet;
    });
  };

  // 防抖计时器
  const wheelTimeoutRef = useRef(null);

  // 处理鼠标滚轮事件（横向滚动）
  const handleWheel = e => {
    if (!gridRef.current) return;

    const container = gridRef.current;
    const scrollAmount = e.deltaY * 0.8;
    const currentScrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    // 添加容差值，避免浮点数精度问题
    const tolerance = 2;

    // 计算目标滚动位置
    const targetScrollLeft = currentScrollLeft + scrollAmount;

    // 更精确的边界检测
    const isAtLeftEdge = currentScrollLeft <= tolerance && scrollAmount < 0;
    const isAtRightEdge = currentScrollLeft >= maxScrollLeft - tolerance && scrollAmount > 0;

    // 如果到达边界，允许垂直滚动
    if (isAtLeftEdge || isAtRightEdge) {
      // 清除防抖计时器
      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = null;
      }
      // 不阻止默认行为，让页面垂直滚动
      return;
    }

    // 否则阻止默认行为，进行横向滚动
    e.preventDefault();

    // 计算并设置新的滚动位置
    const clampedScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft));
    container.scrollLeft = clampedScrollLeft;

    // 立即更新滚动条
    handleScroll();

    // 防抖处理图片加载和可见性检查
    if (wheelTimeoutRef.current) {
      clearTimeout(wheelTimeoutRef.current);
    }

    wheelTimeoutRef.current = setTimeout(() => {
      // 计算当前应该显示的图片
      const currentIndex = Math.floor(
        (clampedScrollLeft / (maxScrollLeft || 1)) * (images.length - 1)
      );
      const indicesToLoad = [];
      for (
        let i = Math.max(0, currentIndex - 1);
        i <= Math.min(images.length - 1, currentIndex + 2);
        i++
      ) {
        indicesToLoad.push(i);
      }

      // 加载图片并检查可见性
      loadImagesByIndices(indicesToLoad);
      checkVisibleImages();
      wheelTimeoutRef.current = null;
    }, 50);
  };

  // 检查哪些图片应该显示
  const checkVisibleImages = () => {
    if (!gridRef.current) return;

    const container = gridRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;

    // 直接查询所有图片卡片元素
    const imageCards = container.querySelectorAll('.blog-card');

    imageCards.forEach((cardElement, index) => {
      if (!cardElement) return;

      // 计算卡片相对于容器的位置
      const cardLeft = cardElement.offsetLeft;
      const cardRight = cardLeft + cardElement.offsetWidth;

      // 扩大检测范围，确保图片能被及时加载
      const preloadDistance = 200;
      const viewportLeft = scrollLeft - preloadDistance;
      const viewportRight = scrollLeft + containerWidth + preloadDistance;

      const isVisible = cardRight > viewportLeft && cardLeft < viewportRight;

      // 如果图片在可视范围内，则显示
      if (isVisible && !loadedImages.has(index)) {
        setLoadedImages(prev => new Set([...prev, index]));
      }
    });
  };

  // 显示相邻图片（用于拖动时）
  const showAdjacentImages = centerIndex => {
    const indicesToShow = [];
    // 显示中心图片前后各2张，总共最多5张图片
    for (
      let i = Math.max(0, centerIndex - 2);
      i <= Math.min(images.length - 1, centerIndex + 2);
      i++
    ) {
      indicesToShow.push(i);
    }

    loadImagesByIndices(indicesToShow);
    setTimeout(checkVisibleImages, 100);
  };

  // 处理滚动事件，更新自定义滚动条
  const handleScroll = () => {
    if (!gridRef.current || !scrollIndicatorRef.current) return;

    const container = gridRef.current;
    const indicator = scrollIndicatorRef.current;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const scrollPercent = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;

    const trackElement = indicator.parentElement;
    if (!trackElement) return;

    const trackWidth = trackElement.getBoundingClientRect().width;

    // 计算滑块的真实大小 - 反映可视区域与总内容的比例
    const visibleRatio = container.clientWidth / container.scrollWidth;
    const sliderWidth = Math.max(32, trackWidth * visibleRatio); // 最小32px

    // 计算滑块位置
    const maxSliderPosition = trackWidth - sliderWidth;
    const clampedPercent = Math.max(0, Math.min(100, scrollPercent));
    const sliderPosition = (clampedPercent / 100) * maxSliderPosition;

    // 更新滑块样式
    indicator.style.left = `${sliderPosition}px`;
    indicator.style.width = `${sliderWidth}px`;

    // 检查是否需要加载新的图片
    checkVisibleImages();
  };

  // 处理滚动条拖动
  const handleScrollbarClick = e => {
    if (!gridRef.current || !e.currentTarget) return;

    const scrollbar = e.currentTarget;
    const rect = scrollbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollbarWidth = rect.width;
    const clickPercent = (clickX / scrollbarWidth) * 100;

    const container = gridRef.current;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const targetScrollLeft = (clickPercent / 100) * scrollWidth;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  };

  // 处理滚动条拖动开始
  const handleScrollbarMouseDown = e => {
    e.preventDefault();
    e.stopPropagation(); // 防止触发轨道点击事件

    const container = gridRef.current;
    const scrollbarTrack = e.currentTarget.parentElement;
    if (!container || !scrollbarTrack) return;

    const trackRect = scrollbarTrack.getBoundingClientRect();
    const scrollWidth = container.scrollWidth - container.clientWidth;

    // 计算当前滑块的实际大小
    const visibleRatio = container.clientWidth / container.scrollWidth;
    const sliderWidth = Math.max(32, trackRect.width * visibleRatio);
    const maxSliderPosition = trackRect.width - sliderWidth;

    const handleMouseMove = moveEvent => {
      const mouseX = moveEvent.clientX - trackRect.left;
      const sliderPosition = Math.max(0, Math.min(maxSliderPosition, mouseX - sliderWidth / 2));
      const scrollPercent = maxSliderPosition > 0 ? sliderPosition / maxSliderPosition : 0;

      container.scrollLeft = scrollPercent * scrollWidth;

      // 拖动时显示相关图片
      const targetImageIndex = Math.floor(scrollPercent * (images.length - 1));
      showAdjacentImages(targetImageIndex);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // 拖动结束后检查可见图片
      setTimeout(checkVisibleImages, 100);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useGSAP(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. 主标题动画
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 100,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 2. 副标题动画
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: subtitleRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.2,
          }
        );
      }

      // 3. 网格容器动画
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.4,
          }
        );

        const cards = gridRef.current.querySelectorAll('.blog-card');
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 95%',
                toggleActions: 'play none none reverse',
              },
              delay: index * 0.05,
            }
          );
        });
      }

      // 4. 装饰元素动画
      if (decorationRef.current) {
        const shapes = decorationRef.current.querySelectorAll('.decoration-shape');

        shapes.forEach((shape, index) => {
          shape.style.willChange = 'transform';
          shape.style.backfaceVisibility = 'hidden';

          const initialRotation = index === 1 || index === 3 ? 45 : 0;

          gsap.set(shape, {
            rotation: initialRotation,
            force3D: true,
          });
        });

        gsap.to(shapes, {
          rotation: '+=360',
          duration: 25,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          force3D: true,
        });
      }

      // 5. 整体容器初始动画
      gsap.fromTo(
        sectionRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
        }
      );

      // 6. 添加滚动事件监听器
      if (gridRef.current) {
        const container = gridRef.current;

        // 添加滚动事件监听器
        container.addEventListener('scroll', handleScroll);

        // 添加鼠标滚轮事件监听器到图片容器
        container.addEventListener('wheel', handleWheel, { passive: false });

        // 初始化滚动条位置
        handleScroll();
        // 初始化时检查可见图片
        setTimeout(checkVisibleImages, 500);
      }
    }, sectionRef.current);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      // 清理事件监听器
      const container = gridRef.current;
      if (container) {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className='min-h-screen bg-gray-900 text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.015) 0.5px, transparent 0.5px),
          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.012) 0.3px, transparent 0.3px),
          radial-gradient(circle at 45% 15%, rgba(255,255,255,0.018) 0.4px, transparent 0.4px),
          radial-gradient(circle at 15% 85%, rgba(255,255,255,0.01) 0.2px, transparent 0.2px)
        `,
        backgroundSize: '120px 120px, 80px 80px, 100px 100px, 60px 60px',
        backgroundPosition: '0 0, 40px 40px, 20px 60px, 80px 20px',
      }}
    >
      {/* 背景装饰 */}
      <div
        ref={decorationRef}
        className='absolute inset-0 pointer-events-none'
        style={{ overflowAnchor: 'none', contain: 'layout paint' }}
      >
        <div className='decoration-shape absolute top-20 left-10 w-20 h-20 border border-blue-500/20 rounded-full'></div>
        <div className='decoration-shape absolute top-40 right-20 w-16 h-16 border border-purple-500/20'></div>
        <div className='decoration-shape absolute bottom-40 left-20 w-12 h-12 border border-green-500/20 rounded-full'></div>
        <div className='decoration-shape absolute bottom-20 right-10 w-24 h-24 border border-pink-500/20'></div>

        {/* 三角形装饰 */}
        <div
          className='decoration-shape triangle-decoration triangle-left absolute top-30 right-32 text-blue-400/20'
          style={{ '--triangle-size': '16px', '--triangle-color': 'currentColor' }}
        ></div>
        <div
          className='decoration-shape triangle-decoration triangle-up absolute top-56 left-28 text-green-400/20'
          style={{ '--triangle-size': '13px', '--triangle-color': 'currentColor' }}
        ></div>
        <div
          className='decoration-shape triangle-decoration triangle-right absolute bottom-64 right-28 text-purple-400/20'
          style={{ '--triangle-size': '19px', '--triangle-color': 'currentColor' }}
        ></div>
      </div>

      <div className='max-w-6xl mx-auto'>
        {/* 标题部分 */}
        <div className='text-center mb-16'>
          <h1
            ref={titleRef}
            className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent leading-tight pb-2'
          >
            Blog
          </h1>
          <p ref={subtitleRef} className='text-xl md:text-2xl text-gray-300 font-light'>
            {subtitle}
          </p>
        </div>

        {/* 图片水平滚动 */}
        <div className='relative'>
          {/* 滚动容器 */}
          <div ref={gridRef} className='overflow-x-scroll overflow-y-hidden'>
            <div className='flex gap-6 pb-4' style={{ width: 'max-content' }}>
              {images.map((image, index) => (
                <div
                  key={`${image.location}-${index}`}
                  className='blog-card bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-50 relative flex-shrink-0'
                  style={{ width: '320px' }}
                >
                  <div className='w-full h-60 bg-gray-800 relative overflow-hidden'>
                    {loadedImages.has(index) ? (
                      <img
                        src={image.src}
                        alt={`${image.location} - New Zealand`}
                        className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
                        style={{
                          opacity: index < 3 ? 1 : 0,
                          willChange: 'transform, opacity',
                        }}
                        onLoad={e => {
                          const img = e.target;
                          // 动态加载的图片执行淡入动画，前3张直接显示
                          if (index >= 3) {
                            animateImageIn(img, 0);
                          } else {
                            img.style.opacity = '1';
                          }
                        }}
                      />
                    ) : (
                      // 占位符 - 简单的灰色背景
                      <div className='w-full h-full bg-gray-700'></div>
                    )}
                    {/* 地名显示 - hover时出现 */}
                    <div className='absolute bottom-4 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center'>
                      <div className='text-white text-lg font-semibold'>{image.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 自定义滚动条 */}
          <div className='mt-6 px-4'>
            {/* 滚动条轨道 */}
            <div
              className='w-full h-2 bg-gray-700/50 rounded-full relative cursor-pointer'
              onClick={handleScrollbarClick}
            >
              {/* 滚动条滑块 */}
              <div
                ref={scrollIndicatorRef}
                className='absolute top-0 h-2 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full cursor-grab active:cursor-grabbing hover:shadow-lg'
                style={{
                  left: '0px',
                  width: '64px', // 初始宽度，将被JavaScript动态更新
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseDown={handleScrollbarMouseDown}
              ></div>
            </div>
          </div>

          {/* 滚动提示文字 */}
          <div className='text-center mt-4'>
            <p className='text-gray-400 text-sm flex items-center justify-center gap-3'>
              <span className='animate-arrow-blink text-cyan-400 font-bold'>←</span>
              <span className='font-medium'>Swipe to explore more photos</span>
              <span className='animate-arrow-blink text-cyan-400 font-bold'>→</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
