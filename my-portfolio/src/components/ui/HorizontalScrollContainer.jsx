import { useRef, useEffect, useCallback } from 'react';

const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export default function HorizontalScrollContainer({
  children,
  hintText = 'Swipe to explore',
  gradientFrom = 'from-green-400',
  gradientTo = 'to-blue-500',
  arrowColor = 'text-green-400',
  onScroll: onScrollCallback,
}) {
  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const wheelTimeoutRef = useRef(null);

  const updateIndicator = useCallback(() => {
    if (!containerRef.current || !indicatorRef.current) return;

    const container = containerRef.current;
    const indicator = indicatorRef.current;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const scrollPercent = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;

    const trackElement = indicator.parentElement;
    if (!trackElement) return;

    const trackWidth = trackElement.getBoundingClientRect().width;

    const visibleRatio = container.clientWidth / container.scrollWidth;
    const sliderWidth = Math.max(32, trackWidth * visibleRatio);

    const maxSliderPosition = trackWidth - sliderWidth;
    const clampedPercent = Math.max(0, Math.min(100, scrollPercent));
    const sliderPosition = (clampedPercent / 100) * maxSliderPosition;

    indicator.style.left = `${sliderPosition}px`;
    indicator.style.width = `${sliderWidth}px`;
  }, []);

  const handleScroll = useCallback(() => {
    updateIndicator();

    if (onScrollCallback && containerRef.current) {
      const container = containerRef.current;
      onScrollCallback({
        scrollLeft: container.scrollLeft,
        scrollWidth: container.scrollWidth,
        clientWidth: container.clientWidth,
      });
    }
  }, [updateIndicator, onScrollCallback]);

  const handleWheel = useCallback(
    e => {
      if (!containerRef.current || isTouchDevice()) return;

      const container = containerRef.current;
      const scrollAmount = e.deltaY * 0.8;
      const currentScrollLeft = container.scrollLeft;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const tolerance = 2;

      const isAtLeftEdge = currentScrollLeft <= tolerance && scrollAmount < 0;
      const isAtRightEdge = currentScrollLeft >= maxScrollLeft - tolerance && scrollAmount > 0;

      if (isAtLeftEdge || isAtRightEdge) {
        if (wheelTimeoutRef.current) {
          clearTimeout(wheelTimeoutRef.current);
          wheelTimeoutRef.current = null;
        }
        return;
      }

      e.preventDefault();

      const clampedScrollLeft = Math.max(0, Math.min(maxScrollLeft, currentScrollLeft + scrollAmount));
      container.scrollLeft = clampedScrollLeft;

      handleScroll();

      if (wheelTimeoutRef.current) {
        clearTimeout(wheelTimeoutRef.current);
      }

      wheelTimeoutRef.current = setTimeout(() => {
        handleScroll();
        wheelTimeoutRef.current = null;
      }, 50);
    },
    [handleScroll]
  );

  const handleScrollbarClick = useCallback(
    e => {
      if (!containerRef.current || !e.currentTarget) return;

      const scrollbar = e.currentTarget;
      const rect = scrollbar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const scrollbarWidth = rect.width;
      const clickPercent = (clickX / scrollbarWidth) * 100;

      const container = containerRef.current;
      const scrollWidth = container.scrollWidth - container.clientWidth;
      const targetScrollLeft = (clickPercent / 100) * scrollWidth;

      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    },
    []
  );

  const handleSliderMouseDown = useCallback(
    e => {
      e.preventDefault();
      e.stopPropagation();

      const container = containerRef.current;
      const scrollbarTrack = e.currentTarget.parentElement;
      if (!container || !scrollbarTrack) return;

      const trackRect = scrollbarTrack.getBoundingClientRect();
      const scrollWidth = container.scrollWidth - container.clientWidth;

      const visibleRatio = container.clientWidth / container.scrollWidth;
      const sliderWidth = Math.max(32, trackRect.width * visibleRatio);
      const maxSliderPosition = trackRect.width - sliderWidth;

      const handleMouseMove = moveEvent => {
        const mouseX = moveEvent.clientX - trackRect.left;
        const sliderPosition = Math.max(0, Math.min(maxSliderPosition, mouseX - sliderWidth / 2));
        const scrollPercent = maxSliderPosition > 0 ? sliderPosition / maxSliderPosition : 0;

        container.scrollLeft = scrollPercent * scrollWidth;
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);

    if (!isTouchDevice()) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    setTimeout(() => {
      updateIndicator();
    }, 100);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (!isTouchDevice()) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [handleScroll, handleWheel, updateIndicator]);

  return (
    <div className='relative'>
      {/* Scroll container */}
      <div
        ref={containerRef}
        className='overflow-x-scroll overflow-y-hidden'
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: isTouchDevice() ? 'x mandatory' : 'none',
        }}
      >
        <div className='flex gap-6 pb-4' style={{ width: 'max-content' }}>
          {children}
        </div>
      </div>

      {/* Custom scrollbar */}
      <div className='mt-6 px-4'>
        <div
          className='w-full h-2 bg-gray-700/50 rounded-full relative cursor-pointer'
          onClick={handleScrollbarClick}
        >
          <div
            ref={indicatorRef}
            className={`absolute top-0 h-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full cursor-grab active:cursor-grabbing hover:shadow-lg`}
            style={{
              left: '0px',
              width: '32px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseDown={handleSliderMouseDown}
          ></div>
        </div>
      </div>

      {/* Hint text */}
      <div className='text-center mt-4'>
        <p className='text-gray-400 text-sm flex items-center justify-center gap-3'>
          <span className={`animate-arrow-blink ${arrowColor} font-bold`}>←</span>
          <span className='font-medium'>{hintText}</span>
          <span className={`animate-arrow-blink ${arrowColor} font-bold`}>→</span>
        </p>
      </div>
    </div>
  );
}
