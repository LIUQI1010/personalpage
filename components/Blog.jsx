'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';
import HorizontalScrollContainer from '@/components/ui/HorizontalScrollContainer';
import { blogImages, developmentLogs } from '@/data/blog';

const Blog = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);
  const decorationRef = useRef(null);
  const developmentLogsRef = useRef(null);
  const photoTitleRef = useRef(null);
  const devTitleRef = useRef(null);

  // 图片加载状态管理
  const [loadedImages, setLoadedImages] = useState(new Set([0, 1, 2]));

  const subtitle = 'Photography & Development Journey in Aotearoa';

  // 预加载所有图片
  useEffect(() => {
    blogImages.forEach((img, index) => {
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

  // 处理照片滚动时的懒加载
  const handlePhotoScroll = ({ scrollLeft, scrollWidth, clientWidth }) => {
    if (!gridRef.current) return;

    const container = gridRef.current;
    const imageCards = container.querySelectorAll('.blog-card');

    imageCards.forEach((cardElement, index) => {
      if (!cardElement) return;

      const cardLeft = cardElement.offsetLeft;
      const cardRight = cardLeft + cardElement.offsetWidth;

      const preloadDistance = 200;
      const viewportLeft = scrollLeft - preloadDistance;
      const viewportRight = scrollLeft + clientWidth + preloadDistance;

      const isVisible = cardRight > viewportLeft && cardLeft < viewportRight;

      if (isVisible && !loadedImages.has(index)) {
        setLoadedImages(prev => new Set([...prev, index]));
      }
    });
  };

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
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

      // 4. 照片模块标题动画
      if (photoTitleRef.current) {
        gsap.fromTo(
          photoTitleRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: photoTitleRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.2,
          }
        );
      }


      // 5. 开发日志模块标题动画
      if (devTitleRef.current) {
        gsap.fromTo(
          devTitleRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: devTitleRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.2,
          }
        );
      }

      // 6. 开发日志区域动画 - 简化为单一动画避免冲突
      if (developmentLogsRef.current) {
        // 简单的淡入动画，不影响卡片尺寸
        gsap.fromTo(
          developmentLogsRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: developmentLogsRef.current,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
              onStart: () => {
                // 动画开始时确保滚动位置正确
                if (developmentLogsRef.current) {
                  developmentLogsRef.current.scrollLeft = 0;
                }
              },
            },
          }
        );
      }

      // 7. 装饰元素动画
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

        const spinTween = gsap.to(shapes, {
          rotation: '+=360',
          duration: 25,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          force3D: true,
        });
        ScrollTrigger.create({
          trigger: decorationRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => spinTween.play(),
          onLeave: () => spinTween.pause(),
          onEnterBack: () => spinTween.play(),
          onLeaveBack: () => spinTween.pause(),
        });
      }

      // 6. 整体容器初始动画
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

    }, sectionRef.current);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className='min-h-screen text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
    >
      <div className='max-w-6xl mx-auto'>
        {/* 标题部分 */}
        <div className='text-center mb-16'>
          <h1
            ref={titleRef}
            className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent leading-tight pb-2'
          >
            Gallery & Journal
          </h1>
          <p ref={subtitleRef} className='text-xl md:text-2xl text-gray-300 font-light'>
            {subtitle}
          </p>
        </div>

        {/* 垂直布局：照片在上，开发日志在下 */}
        <div className='space-y-16'>
          {/* 新西兰照片模块 */}
          <div className='space-y-6'>
            <h2
              ref={photoTitleRef}
              className='text-2xl md:text-3xl font-bold text-center text-cyan-400'
            >
              Captured across Aotearoa New Zealand
            </h2>

            {/* 图片水平滚动 */}
            <div ref={gridRef}>
              <HorizontalScrollContainer
                hintText='Swipe to explore more photos'
                gradientFrom='from-cyan-400'
                gradientTo='to-teal-500'
                arrowColor='text-cyan-400'
                onScroll={handlePhotoScroll}
              >
                {blogImages.map((image, index) => (
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
                          loading='lazy'
                          decoding='async'
                          className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
                          style={{
                            opacity: index < 3 ? 1 : 0,
                            willChange: 'transform, opacity',
                          }}
                          onLoad={e => {
                            const img = e.target;
                            if (index >= 3) {
                              animateImageIn(img, 0);
                            } else {
                              img.style.opacity = '1';
                            }
                          }}
                        />
                      ) : (
                        <div className='w-full h-full bg-gray-700'></div>
                      )}
                      <div className='absolute bottom-4 left-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center'>
                        <div className='text-white text-lg font-semibold'>{image.location}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </HorizontalScrollContainer>
            </div>
          </div>

          {/* 开发日志模块 */}
          <div className='space-y-6'>
            <h2
              ref={devTitleRef}
              className='text-2xl md:text-3xl font-bold text-center text-teal-400'
            >
              Development Journey
            </h2>

            {/* 横向滚动容器 */}
            <div ref={developmentLogsRef}>
              <HorizontalScrollContainer
                hintText='Swipe to explore development timeline'
                gradientFrom='from-teal-400'
                gradientTo='to-emerald-500'
                arrowColor='text-teal-400'
              >
                {developmentLogs
                  .slice()
                  .reverse()
                  .map((log, index) => (
                    <div
                      key={log.date}
                      className='log-card bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-500/20 p-6 hover:border-teal-400/40 hover:shadow-lg transition-all duration-300 flex-shrink-0'
                      style={{ width: '350px' }}
                    >
                      <div className='flex items-center justify-between mb-3'>
                        <div className='text-sm text-gray-400 font-mono'>{log.date}</div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            log.type === 'milestone'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : log.type === 'feature'
                                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {log.type.toUpperCase()}
                        </div>
                      </div>
                      <h3 className='text-lg font-bold text-white mb-2'>{log.title}</h3>
                      <p className='text-gray-300 text-sm leading-relaxed'>{log.description}</p>
                    </div>
                  ))}
              </HorizontalScrollContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
