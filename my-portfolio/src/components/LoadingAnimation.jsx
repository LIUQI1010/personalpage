import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const LoadingAnimation = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const planeRef = useRef(null);
  const ringRef = useRef(null);
  const radiusRef = useRef({ value: 0 });
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem('loading-played')) {
      setShouldPlay(true);
      sessionStorage.setItem('loading-played', '1');
    } else {
      onComplete?.();
    }
  }, []);

  useEffect(() => {
    if (!shouldPlay) return;

    const overlay = overlayRef.current;
    const plane = planeRef.current;
    const ring = ringRef.current;
    if (!overlay || !plane || !ring) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const centerX = vw / 2;
    const centerY = vh / 2;
    const maxRadius = Math.sqrt(vw * vw + vh * vh) / 2;

    const updateMask = (r) => {
      if (r <= 0) {
        overlay.style.WebkitMaskImage = 'none';
        overlay.style.maskImage = 'none';
        return;
      }
      const mask = `radial-gradient(circle ${r}px at ${centerX}px ${centerY}px, transparent ${r}px, black ${r}px)`;
      overlay.style.WebkitMaskImage = mask;
      overlay.style.maskImage = mask;
    };

    updateMask(0);

    const tl = gsap.timeline({
      onComplete: () => {
        if (overlay.parentNode) {
          overlay.style.display = 'none';
        }
        onComplete?.();
      },
    });

    // 阶段一：纸飞机从左上角沿弧线飞入中心
    tl.set(plane, {
      x: -60,
      y: -60,
      rotation: 0,
      opacity: 1,
      scale: 1,
      scaleY: 0.7,
    });

    tl.to(plane, {
      duration: 1.5,
      opacity: 1,
      scale: 1,
      ease: 'power2.inOut',
      motionPath: {
        path: [
          { x: -60, y: -60 },
          { x: centerX * 0.3, y: centerY * 0.6 },
          { x: centerX * 0.7, y: centerY * 0.3 },
          { x: centerX, y: centerY },
        ],
        type: 'cubic',
        autoRotate: false,
      },
    });

    // 阶段二：飞机淡出 + 圆环从中心扩散
    tl.to(
      plane,
      {
        duration: 0.3,
        opacity: 0,
        scale: 0.1,
        ease: 'power2.in',
      },
      '+=0'
    );

    // 圆环出现并扩散
    tl.fromTo(
      ring,
      {
        scale: 0,
        opacity: 1,
      },
      {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      '-=0.25'
    );

    // 圆形遮罩扩散露出页面
    tl.to(
      radiusRef.current,
      {
        value: maxRadius,
        duration: 1.15,
        ease: 'power2.out',
        onUpdate: () => {
          updateMask(radiusRef.current.value);
        },
      },
      '-=0.5'
    );

    return () => {
      tl.kill();
    };
  }, [shouldPlay]);

  if (!shouldPlay) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const ringSize = Math.max(vw, vh) * 0.6;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'oklch(0.13 0.03 261.7)',
        pointerEvents: 'none',
      }}
    >
      {/* 纸飞机 SVG */}
      <svg
        ref={planeRef}
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          filter: 'drop-shadow(0 0 8px rgba(200, 220, 255, 0.7))',
        }}
      >
        <path
          d="M3 2L22 12L3 22L6 12Z"
          stroke="rgba(220, 230, 255, 0.9)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="rgba(220, 230, 255, 0.15)"
        />
        <line
          x1="6" y1="12" x2="22" y2="12"
          stroke="rgba(220, 230, 255, 0.5)"
          strokeWidth="1"
        />
      </svg>

      {/* 扩散圆环 */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: ringSize,
          height: ringSize,
          marginLeft: -ringSize / 2,
          marginTop: -ringSize / 2,
          borderRadius: '50%',
          border: '2px solid rgba(220, 230, 255, 0.8)',
          boxShadow:
            '0 0 15px rgba(200, 220, 255, 0.4), inset 0 0 15px rgba(200, 220, 255, 0.1)',
          transform: 'scale(0)',
          opacity: 0,
        }}
      />
    </div>
  );
};

export default LoadingAnimation;
