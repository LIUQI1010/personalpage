import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

// 图片堆叠组件
const ImageStack = ({
  images = [],
  className = '',
  containerSize = { width: 400, height: 240 },
  expandedLayout = [
    { x: 0, y: -20, scale: 1.1, rotation: 0, zIndex: 55 },
    { x: -180, y: -80, scale: 0.9, rotation: -8, zIndex: 54 },
    { x: 180, y: -80, scale: 0.9, rotation: 8, zIndex: 53 },
    { x: -180, y: 40, scale: 0.9, rotation: -5, zIndex: 52 },
    { x: 180, y: 40, scale: 0.9, rotation: 5, zIndex: 51 },
  ],
  onImageClick = () => {},
  disabled = false,
}) => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice =
        window.innerWidth <= 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 初始化图片叠放状态
  useEffect(() => {
    if (!containerRef.current || isMobile || disabled) return;

    const imageElements = containerRef.current.querySelectorAll('.stack-image');
    if (!imageElements.length) return;

    // 设置容器初始状态
    gsap.set(containerRef.current, {
      width: containerSize.width,
      height: containerSize.height,
      overflow: 'visible',
      position: 'relative',
    });

    // 设置图片初始叠放状态
    imageElements.forEach((image, index) => {
      gsap.set(image, {
        position: 'absolute',
        x: index * -3,
        y: index * -3,
        scale: 1 - index * 0.05,
        rotation: (index - 2) * 2,
        zIndex: imageElements.length - index,
        transformOrigin: 'center center',
      });
    });
  }, [isMobile, disabled, containerSize]);

  // 展开动画
  const animateExpand = () => {
    if (!containerRef.current || isMobile || disabled) return;

    const imageElements = containerRef.current.querySelectorAll('.stack-image');
    if (!imageElements.length) return;

    // 终止进行中的补间，避免状态卡住
    gsap.killTweensOf(imageElements);

    setIsAnimating(true);

    // 设置容器为相对定位，图片脱离文档流
    gsap.set(containerRef.current, {
      position: 'relative',
      zIndex: 50,
    });

    // 图片向上展开
    imageElements.forEach((image, index) => {
      const layout = expandedLayout[index] || expandedLayout[0];

      gsap.set(image, {
        position: 'absolute',
        zIndex: layout.zIndex,
      });

      gsap.to(image, {
        x: layout.x,
        y: layout.y,
        scale: layout.scale,
        rotation: layout.rotation,
        duration: 0.35,
        delay: index * 0.05,
        ease: 'power3.out',
        overwrite: true,
        onComplete: index === imageElements.length - 1 ? () => setIsAnimating(false) : undefined,
      });
    });
  };

  // 收缩动画
  const animateCollapse = () => {
    if (!containerRef.current || isMobile || disabled) return;

    const imageElements = containerRef.current.querySelectorAll('.stack-image');
    if (!imageElements.length) return;

    // 终止进行中的补间，确保能立即收拢
    gsap.killTweensOf(imageElements);

    setIsAnimating(true);

    // 图片收缩回叠放状态
    imageElements.forEach((image, index) => {
      gsap.to(image, {
        x: index * -3,
        y: index * -3,
        scale: 1 - index * 0.05,
        rotation: (index - 2) * 2,
        zIndex: imageElements.length - index,
        duration: 0.4,
        delay: (imageElements.length - index - 1) * 0.03,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: index === 0 ? () => setIsAnimating(false) : undefined,
      });
    });

    // 重置容器z-index
    gsap.set(containerRef.current, {
      zIndex: 'auto',
      delay: 0.5,
    });
  };

  // 单张图片hover
  const handleImageHover = index => {
    if (!containerRef.current || isMobile || disabled || !isHovered || isAnimating) return;

    const imageElements = containerRef.current.querySelectorAll('.stack-image');
    if (!imageElements[index]) return;

    const layout = expandedLayout[index] || expandedLayout[0];

    gsap.to(imageElements[index], {
      zIndex: 100,
      scale: index === 0 ? 1.3 : 1.1,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: true,
    });
  };

  const handleImageLeave = index => {
    if (!containerRef.current || isMobile || disabled || !isHovered || isAnimating) return;

    const imageElements = containerRef.current.querySelectorAll('.stack-image');
    if (!imageElements[index]) return;

    const layout = expandedLayout[index] || expandedLayout[0];

    gsap.to(imageElements[index], {
      scale: layout.scale,
      zIndex: layout.zIndex,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: true,
    });
  };

  // 容器事件处理
  const handleContainerEnter = () => {
    if (!isMobile && !disabled) {
      setIsHovered(true);
      // 在进入时也终止可能的补间，防止竞争
      const images = containerRef.current?.querySelectorAll('.stack-image');
      if (images && images.length) gsap.killTweensOf(images);
      animateExpand();
    }
  };

  const handleContainerLeave = () => {
    if (!isMobile && !disabled) {
      setIsHovered(false);
      // 离开时无条件收拢，并终止所有补间，解决偶发卡住
      const images = containerRef.current?.querySelectorAll('.stack-image');
      if (images && images.length) gsap.killTweensOf(images);
      animateCollapse();
    }
  };

  // 图片点击处理
  const handleImageClick = (image, index, event) => {
    event.stopPropagation();
    onImageClick(image, index, event);
  };

  if (isMobile || disabled) {
    // 移动端或禁用状态：横向滚动显示
    return (
      <div className={cn('w-full', className)}>
        <div
          className='custom-scrollbar'
          style={{
            overflowX: 'scroll',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
          }}
        >
          <div className='flex gap-4 pb-4' style={{ width: 'max-content' }}>
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className='flex-shrink-0 w-72 h-48 overflow-hidden rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300 cursor-pointer'
                style={{ scrollSnapAlign: 'start' }}
                onClick={e => handleImageClick(image, index, e)}
              >
                <div className='w-full h-full bg-gray-800 relative group'>
                  <img
                    src={image.src || image.placeholder}
                    alt={image.alt || image.title || `Image ${index + 1}`}
                    className='w-full h-full object-cover'
                    draggable={false}
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    <div className='absolute bottom-4 left-4 right-4'>
                      <h3 className='text-white font-semibold text-sm'>
                        {image.title || `Image ${index + 1}`}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 移动端滚动提示 */}
        <div className='flex items-center justify-center gap-3 mt-4 text-gray-400 text-sm'>
          <span className='animate-arrow-blink text-purple-400 font-bold'>←</span>
          <span className='font-medium'>Swipe to explore more images</span>
          <span className='animate-arrow-blink text-purple-400 font-bold'>→</span>
        </div>
      </div>
    );
  }

  // 桌面端：堆叠效果
  return (
    <div className={cn('flex justify-center', className)}>
      <div
        ref={containerRef}
        className='relative mx-auto cursor-pointer'
        onMouseEnter={handleContainerEnter}
        onMouseLeave={handleContainerLeave}
        style={{
          width: containerSize.width,
          height: containerSize.height,
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.id || index}
            className='stack-image w-full h-full overflow-hidden rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300'
            onMouseEnter={() => handleImageHover(index)}
            onMouseLeave={() => handleImageLeave(index)}
            onClick={e => handleImageClick(image, index, e)}
          >
            <div className='w-full h-full bg-gray-800 relative group cursor-pointer'>
              <img
                src={image.src || image.placeholder}
                alt={image.alt || image.title || `Image ${index + 1}`}
                className='w-full h-full object-cover'
                draggable={false}
              />
              <div className='absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='absolute bottom-4 left-4 right-4'>
                  <h3 className='text-white font-semibold text-lg mb-1'>
                    {image.title || `Image ${index + 1}`}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ImageStack };
