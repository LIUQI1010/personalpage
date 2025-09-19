import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const nzStarsDataRef = useRef(null);
  const islandPathsRef = useRef({ loaded: false, south: [], north: [] });
  const outlineProgressRef = useRef(0);
  const insideProgressRef = useRef(0);
  const scrollTriggerRef = useRef({ outline: null, inside: null });
  const meteorsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 设置Canvas尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // 计算将SVG坐标等比缩放并居中到Canvas的变换
    const computeSvgTransform = svgSize => {
      const svgW = svgSize?.width || 1000;
      const svgH = svgSize?.height || 1330;
      const scale = Math.min(canvas.width / svgW, canvas.height / svgH) * 0.9;
      const offsetX = (canvas.width - svgW * scale) / 2;
      const offsetY = (canvas.height - svgH * scale) / 2;
      return { scale, offsetX, offsetY, svgW, svgH };
    };

    // 缓动：先快后慢（easeOutCubic）
    const easeOut = t => {
      const clamped = Math.max(0, Math.min(1, t));
      const inv = 1 - clamped;
      return 1 - inv * inv * inv;
    };

    // 基于 nz_stars.json + svg 轮廓构建：轮廓1000 + 内部1000 + 外部1000
    const buildCompositeStars = (
      data,
      outlineCount = 1000,
      insideCount = 1000,
      outsideCount = 1000
    ) => {
      if (!data || !Array.isArray(data.stars)) return null;
      const { scale, offsetX, offsetY } = computeSvgTransform(data.svgSize);

      // 将 SVG 坐标转换为 Canvas 坐标
      const toCanvas = pt => ({ x: offsetX + pt.x * scale, y: offsetY + pt.y * scale });

      // 轮廓：从预生成1000个中等间距抽取 outlineCount 个
      const outlineStars = [];
      const totalOutline = data.stars.length;
      for (let i = 0; i < outlineCount; i++) {
        const index = Math.floor((i * totalOutline) / outlineCount);
        const p = toCanvas(data.stars[index]);
        const x0 = Math.random() * (canvas.width - 10) + 5;
        const y0 = Math.random() * (canvas.height - 10) + 5;
        outlineStars.push({
          x: x0,
          y: y0,
          x0,
          y0,
          tx: p.x,
          ty: p.y,
          group: 'outline',
          size: Math.random() * 0.6 + 0.4,
          type: 'galaxy',
          opacity: 0.85,
          baseOpacity: 0.85,
          maxOpacity: 1,
          minOpacity: 0.15,
          twinkleSpeed: Math.random() * 0.04 + 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          glowIntensity: 0.6,
        });
      }

      // 内外判断函数：基于 Path2D + 当前变换
      const isInsideNZ = (x, y) => {
        if (!islandPathsRef.current.loaded) return false;
        let inside = false;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);
        const { south, north } = islandPathsRef.current;
        for (let i = 0; i < south.length && !inside; i++) {
          if (ctx.isPointInPath(south[i], x, y)) inside = true;
        }
        for (let i = 0; i < north.length && !inside; i++) {
          if (ctx.isPointInPath(north[i], x, y)) inside = true;
        }
        ctx.restore();
        return inside;
      };

      // 内部随机点
      const insideStars = [];
      let guard = 0;
      const maxTries = insideCount * 100;
      while (insideStars.length < insideCount && guard < maxTries) {
        guard++;
        // 目标点需在新西兰内部
        const tx = Math.random() * (canvas.width - 10) + 5;
        const ty = Math.random() * (canvas.height - 10) + 5;
        if (isInsideNZ(tx, ty)) {
          // 初始点随机（全屏散开）
          const x0 = Math.random() * (canvas.width - 10) + 5;
          const y0 = Math.random() * (canvas.height - 10) + 5;
          insideStars.push({
            x: x0,
            y: y0,
            x0,
            y0,
            tx,
            ty,
            group: 'inside',
            size: Math.random() * 0.5 + 0.3,
            type: 'galaxy',
            opacity: 0.8,
            baseOpacity: 0.8,
            maxOpacity: 1,
            minOpacity: 0.12,
            twinkleSpeed: Math.random() * 0.04 + 0.03,
            twinklePhase: Math.random() * Math.PI * 2,
            glowIntensity: 0.5,
          });
        }
      }

      // 外部随机点
      const outsideStars = [];
      guard = 0;
      while (outsideStars.length < outsideCount && guard < outsideCount * 200) {
        guard++;
        const x0 = Math.random() * (canvas.width - 10) + 5;
        const y0 = Math.random() * (canvas.height - 10) + 5;
        if (!isInsideNZ(x0, y0)) {
          outsideStars.push({
            x: x0,
            y: y0,
            x0,
            y0,
            tx: x0,
            ty: y0,
            group: 'outside',
            size: Math.random() * 0.4 + 0.2,
            type: 'scattered',
            opacity: 0.6,
            baseOpacity: 0.6,
            maxOpacity: 0.9,
            minOpacity: 0.05,
            twinkleSpeed: Math.random() * 0.04 + 0.03,
            twinklePhase: Math.random() * Math.PI * 2,
            glowIntensity: 0.3,
          });
        }
      }

      return [...outlineStars, ...insideStars, ...outsideStars];
    };

    // 加载本地预生成的星点坐标
    const loadNZStars = async () => {
      try {
        const resp = await fetch('/nz_stars.json', { cache: 'no-store' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        nzStarsDataRef.current = data;
        // 若已加载SVG轮廓，则按新规则生成；否则先仅用轮廓点（临时）
        if (islandPathsRef.current.loaded) {
          const rebuilt = buildCompositeStars(data);
          if (rebuilt) starsRef.current = rebuilt;
        } else {
          // 临时仅使用轮廓点（全部映射），待SVG加载后重建
          const { scale, offsetX, offsetY } = computeSvgTransform(data.svgSize);
          const tmp = data.stars.map(pt => ({
            x: offsetX + pt.x * scale,
            y: offsetY + pt.y * scale,
            size: Math.random() * 0.6 + 0.4,
            type: 'galaxy',
            opacity: 0.85,
            baseOpacity: 0.85,
            maxOpacity: 1,
            minOpacity: 0.15,
            twinkleSpeed: Math.random() * 0.03 + 0.015,
            twinklePhase: Math.random() * Math.PI * 2,
            glowIntensity: 0.6,
          }));
          starsRef.current = tmp;
        }
        console.log(`Loaded NZ stars: ${data.total || data.stars.length}`);
      } catch (e) {
        console.error('Load nz_stars.json failed:', e);
      }
    };

    // 加载 SVG 以获取 Path2D 轮廓（南/北岛）
    const loadSvgPaths = async () => {
      try {
        const resp = await fetch('/nz.svg', { cache: 'no-store' });
        const text = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const paths = Array.from(doc.querySelectorAll('path'));
        const southNames = new Set([
          'Southland',
          'Marlborough District',
          'Nelson City',
          'Tasman District',
          'West Coast',
          'Otago',
          'Canterbury',
        ]);
        const northNames = new Set([
          'Auckland',
          'Waikato',
          'Wellington',
          'Manawatu-Wanganui',
          'Taranaki',
          'Northland',
          'Bay of Plenty',
          'Gisborne District',
          "Hawke's Bay",
        ]);
        const south = [];
        const north = [];
        paths.forEach(p => {
          const d = p.getAttribute('d');
          const name = p.getAttribute('name') || '';
          if (!d) return;
          const p2d = new Path2D(d);
          if (southNames.has(name)) south.push(p2d);
          else if (northNames.has(name)) north.push(p2d);
        });
        islandPathsRef.current = { loaded: true, south, north };
        // 若已加载星点，则立即重建为 600+1000+300 分布
        if (nzStarsDataRef.current) {
          const rebuilt = buildCompositeStars(nzStarsDataRef.current);
          if (rebuilt) starsRef.current = rebuilt;
        }
      } catch (e) {
        console.error('Load nz.svg failed:', e);
      }
    };

    // 星星数据结构
    const galaxyStars = 375;
    const scatteredStars = 225;
    const totalStars = galaxyStars + scatteredStars;

    // 创建星星数据
    const createStars = () => {
      const stars = [];

      for (let i = 0; i < totalStars; i++) {
        // 初始全部随机分布（避免“银河带”闪烁），稍留边距
        const x = Math.random() * (canvas.width - 10) + 5;
        const y = Math.random() * (canvas.height - 10) + 5;
        const size = Math.random() * 0.4 + 0.2; // 0.2-0.6px
        const type = 'scattered';

        stars.push({
          x,
          y,
          x0: x,
          y0: y,
          tx: x,
          ty: y,
          group: 'outside',
          size,
          type,
          opacity: type === 'galaxy' ? 0.8 : 0.6,
          baseOpacity: type === 'galaxy' ? 0.8 : 0.6,
          maxOpacity: type === 'galaxy' ? 1 : 0.9,
          minOpacity: type === 'galaxy' ? 0.1 : 0.05,
          twinkleSpeed:
            type === 'galaxy' ? Math.random() * 0.04 + 0.02 : Math.random() * 0.03 + 0.015,
          twinklePhase: Math.random() * Math.PI * 2,
          glowIntensity: type === 'galaxy' ? 0.6 : 0.3,
        });
      }

      return stars;
    };

    // 初始化星星（先用默认，数据就绪后替换）
    starsRef.current = createStars();
    console.log(
      `Created ${totalStars} stars with Canvas: ${galaxyStars} in galaxy + ${scatteredStars} scattered`
    );
    // 异步加载本地星点 & SVG轮廓
    loadNZStars();
    loadSvgPaths();

    // 启用滚动驱动形变：在滚动到 #experience 顶部靠近中部时进度为1
    try {
      if (!gsap.core.globals().ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    } catch (_) {
      // ignore
    }
    // 1) 轮廓形变：从页面顶部滚动到 #experience 顶部到达视窗中部时，进度 0 -> 1
    const stOutline = ScrollTrigger.create({
      start: 'top top',
      endTrigger: '#experience',
      end: 'top center',
      scrub: true,
      onUpdate: self => {
        outlineProgressRef.current = self.progress;
      },
    });

    // 2) 内部形变：从 #experience 到达中部后开始，到页面底部结束，进度 0 -> 1
    const stInside = ScrollTrigger.create({
      start: '#experience top center',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: self => {
        insideProgressRef.current = self.progress;
      },
    });
    scrollTriggerRef.current = { outline: stOutline, inside: stInside };

    // 绘制单个星星的函数
    const drawStar = star => {
      const { x, y, size, opacity, glowIntensity } = star;

      if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(size)) {
        return;
      }

      ctx.save();

      // 设置全局透明度
      ctx.globalAlpha = opacity;

      // 创建径向渐变用于发光效果
      const glowRadius = Math.max(0.1, size) * 2.5; // 减小光晕半径
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${glowIntensity})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${glowIntensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      // 绘制外发光
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 绘制星星核心
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ========= 流星（正式版） =========
    const spawnMeteor = () => {
      // 自然的右下方向，带少量抖动
      const baseDeg = 28 + Math.random() * 8; // 28°~36°
      const angle = (baseDeg * Math.PI) / 180;
      const speed = 8 + Math.random() * 4; // 8~12 px/帧
      const length = 120 + Math.random() * 80; // 120~200
      const width = 1 + Math.random() * 1.2;
      // 起点：顶部或左上，更靠近可视区
      const fromTop = Math.random() < 0.6;
      const x0 = fromTop ? Math.random() * (canvas.width * 0.8) + canvas.width * 0.1 : -30;
      const y0 = fromTop ? -20 : Math.random() * (canvas.height * 0.4);
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      meteorsRef.current.push({
        x: x0,
        y: y0,
        vx,
        vy,
        life: 0,
        maxLife: 70 + Math.random() * 60,
        length,
        width,
      });
    };

    const updateAndRenderMeteors = () => {
      // 每帧小概率生成，最多3颗（频率降低）
      if (meteorsRef.current.length < 3 && Math.random() < 0.005) {
        spawnMeteor();
      }

      for (let i = meteorsRef.current.length - 1; i >= 0; i--) {
        const m = meteorsRef.current[i];
        m.life += 1;
        m.x += m.vx;
        m.y += m.vy;

        const vlen = Math.hypot(m.vx, m.vy) || 1;
        const tx = m.x - (m.vx / vlen) * m.length;
        const ty = m.y - (m.vy / vlen) * m.length;

        const lifeProgress = m.life / m.maxLife;
        const fade = Math.max(0, Math.min(1, 1 - lifeProgress));

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // 渐变拖尾
        const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.25, `rgba(180,220,255,${0.35 * fade})`);
        grad.addColorStop(1, `rgba(255,255,255,${0.9 * fade})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // 头部光晕（缩小）
        const headR = Math.max(0.4, m.width * 1.2);
        const hgrad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, headR * 2);
        hgrad.addColorStop(0, `rgba(255,255,255,${0.8 * fade})`);
        hgrad.addColorStop(0.5, `rgba(200,230,255,${0.35 * fade})`);
        hgrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hgrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, headR * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        if (
          m.life > m.maxLife ||
          m.x < -100 ||
          m.x > canvas.width + 100 ||
          m.y > canvas.height + 120
        ) {
          meteorsRef.current.splice(i, 1);
        }
      }
    };

    // 更新星星闪烁状态
    const updateStars = () => {
      starsRef.current.forEach(star => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkleValue = (Math.sin(star.twinklePhase) + 1) / 2;
        star.opacity = star.minOpacity + twinkleValue * (star.maxOpacity - star.minOpacity);
      });
    };

    // 渲染函数
    const render = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新星星位置（形变插值）与闪烁状态
      const pO = outlineProgressRef.current;
      const pI = insideProgressRef.current;
      const eO = easeOut(pO);
      const eI = easeOut(pI);
      if (starsRef.current) {
        for (let i = 0; i < starsRef.current.length; i++) {
          const s = starsRef.current[i];
          if (s.group === 'outline') {
            s.x = s.x0 + (s.tx - s.x0) * eO;
            s.y = s.y0 + (s.ty - s.y0) * eO;
          } else if (s.group === 'inside') {
            s.x = s.x0 + (s.tx - s.x0) * eI;
            s.y = s.y0 + (s.ty - s.y0) * eI;
          } else {
            // outside 以及默认创建的星星，确保基础字段存在
            if (!Number.isFinite(s.x0) || !Number.isFinite(s.y0)) {
              s.x0 = s.x;
              s.y0 = s.y;
            }
            s.x = s.x0;
            s.y = s.y0;
          }
        }
      }
      updateStars();

      // 绘制所有星星
      starsRef.current.forEach(drawStar);

      // 强制流星循环（调试）
      updateAndRenderMeteors();

      // 请求下一帧
      animationRef.current = requestAnimationFrame(render);
    };

    // 开始动画
    console.log('Starting galaxy animation...');
    // 首帧生成1颗，随后按概率生成
    spawnMeteor();
    render();

    // 窗口大小改变处理
    const handleResize = () => {
      setCanvasSize();
      // 重新创建星星以适应新尺寸
      if (nzStarsDataRef.current && islandPathsRef.current.loaded) {
        const rebuilt = buildCompositeStars(nzStarsDataRef.current);
        if (rebuilt) return (starsRef.current = rebuilt);
      } else if (nzStarsDataRef.current) {
        const { scale, offsetX, offsetY } = computeSvgTransform(nzStarsDataRef.current.svgSize);
        const tmp = nzStarsDataRef.current.stars.map(pt => ({
          x: offsetX + pt.x * scale,
          y: offsetY + pt.y * scale,
          size: Math.random() * 0.6 + 0.4,
          type: 'galaxy',
          opacity: 0.85,
          baseOpacity: 0.85,
          maxOpacity: 1,
          minOpacity: 0.15,
          twinkleSpeed: Math.random() * 0.04 + 0.03,
          twinklePhase: Math.random() * Math.PI * 2,
          glowIntensity: 0.6,
        }));
        return (starsRef.current = tmp);
      } else {
        starsRef.current = createStars();
      }
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.outline && scrollTriggerRef.current.outline.kill();
        scrollTriggerRef.current.inside && scrollTriggerRef.current.inside.kill();
        scrollTriggerRef.current = { outline: null, inside: null };
      }
      meteorsRef.current = [];
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10,
        filter: 'blur(0.3px)', // 轻微的整体模糊效果
      }}
    />
  );
};

export default GalaxyBackground;
