import { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
  const galaxyRef = useRef(null);

  useEffect(() => {
    const galaxy = galaxyRef.current;
    if (!galaxy) return;

    // 创建星星：银河主带 + 零星星星
    const galaxyStars = 300; // 银河主带星星
    const scatteredStars = 150; // 零星分布的星星
    const totalStars = galaxyStars + scatteredStars;

    for (let i = 0; i < totalStars; i++) {
      const star = document.createElement('div');

      let finalX, finalY, size;

      if (i < galaxyStars) {
        // 银河主带星星
        const progress = i / galaxyStars;

        // 基础对角线路径
        const baseX = window.innerWidth * progress;
        const baseY = window.innerHeight * progress;

        // 添加正弦波动创造银河弯曲效果
        const waveAmplitude = Math.min(window.innerWidth, window.innerHeight) * 0.15;
        const waveX = Math.sin(progress * Math.PI * 1.5) * waveAmplitude;
        const waveY = Math.cos(progress * Math.PI * 1.5 * 0.7) * waveAmplitude * 0.3;

        // 在银河带内随机分布
        const spreadRadius = Math.min(window.innerWidth, window.innerHeight) * 0.12;
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDistance = Math.random() * spreadRadius;
        const randomX = Math.cos(randomAngle) * randomDistance;
        const randomY = Math.sin(randomAngle) * randomDistance;

        finalX = Math.max(5, Math.min(window.innerWidth - 5, baseX + waveX + randomX));
        finalY = Math.max(5, Math.min(window.innerHeight - 5, baseY + waveY + randomY));
        size = Math.random() * 1.5 + 1; // 1-2.5px 更小的银河星星
      } else {
        // 零星分布的星星（在整个屏幕随机分布）
        finalX = Math.random() * (window.innerWidth - 10) + 5;
        finalY = Math.random() * (window.innerHeight - 10) + 5;
        size = Math.random() * 1 + 0.5; // 0.5-1.5px 更小的零星星星
      }

      // 区分银河星星和零星星星的视觉效果
      const isGalaxyStar = i < galaxyStars;
      const opacity = isGalaxyStar ? 0.8 : 0.6; // 零星星星更暗一些
      const blurAmount = isGalaxyStar ? 0.8 : 0.5; // 零星星星模糊程度更小
      const glowIntensity = isGalaxyStar ? 0.3 : 0.2; // 零星星星发光更弱

      star.style.cssText = `
        position: absolute;
        left: ${finalX}px;
        top: ${finalY}px;
        width: ${size}px;
        height: ${size}px;
        background: white;
        border-radius: 50%;
        opacity: ${opacity};
        box-shadow: 0 0 ${size * 2}px rgba(255,255,255,${glowIntensity}), 0 0 ${size * 4}px rgba(255,255,255,${glowIntensity * 0.5});
        animation: twinkle ${isGalaxyStar ? Math.random() * 4 + 1 : Math.random() * 6 + 2}s ease-in-out infinite alternate;
        filter: blur(${blurAmount}px);
        z-index: 1;
      `;

      galaxy.appendChild(star);
    }

    console.log(
      `Created ${totalStars} twinkling stars: ${galaxyStars} in galaxy + ${scatteredStars} scattered`
    );
  }, []);

  return (
    <>
      {/* CSS动画定义 */}
      <style>{`
        @keyframes twinkle {
          0% { 
            opacity: 0.2; 
            transform: scale(0.8); 
            filter: brightness(0.5);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.3); 
            filter: brightness(1.5);
          }
          100% { 
            opacity: 0.4; 
            transform: scale(1); 
            filter: brightness(0.8);
          }
        }
      `}</style>

      <div
        ref={galaxyRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 10,
          filter: 'blur(0.5px)', // 增强的整体模糊滤镜
        }}
      />
    </>
  );
};

export default GalaxyBackground;
