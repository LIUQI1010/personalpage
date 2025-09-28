import { useEffect } from 'react';
import MyNavigation from '../components/MyNavigation';
import About from '../components/About';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Blog from '../components/Blog';
import Contact from '../components/Contact';
import GalaxyBackground from '../components/GalaxyBackground';
import LikeButton from '../components/LikeButton';
import VisitTracker from '../components/VisitTracker';

function Home() {
  // 控制页面刷新后的滚动位置
  useEffect(() => {
    // 禁用浏览器的滚动恢复功能
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // 清除URL中的锚点并滚动到顶部
    if (window.location.hash) {
      // 清除URL中的锚点
      window.history.replaceState(null, null, window.location.pathname);
    }

    // 使用 setTimeout 确保在 React Router 处理完成后执行
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // 立即也执行一次
    window.scrollTo(0, 0);

    // 监听页面卸载，确保下次加载时从顶部开始
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // 创建Canvas元素用于绘制鼠标轨迹曲线
    const canvas = document.createElement('canvas');
    canvas.className = 'mouse-trail-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const trailPoints = []; // 存储轨迹点
    const maxPoints = 5; // 最大轨迹点数

    // 绘制轨迹曲线（带淡出动画和渐变粗细）
    const drawTrail = () => {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (trailPoints.length < 2) return;

      const now = Date.now();

      // 为每个线段单独绘制，实现粗细渐变
      for (let i = 0; i < trailPoints.length - 1; i++) {
        const currentPoint = trailPoints[i];
        const nextPoint = trailPoints[i + 1];

        // 计算淡出透明度（基于时间）
        const age = now - currentPoint.timestamp;
        const fadeProgress = Math.min(age / 500, 1);
        const opacity = Math.max(0, 1 - fadeProgress);

        if (opacity <= 0) continue;

        // 计算线条粗细（基于位置在轨迹中的比例）
        // trailPoints数组：[最老的点, ..., 最新的点]
        // i从0到trailPoints.length-2，i越大表示越接近最新的点
        const positionProgress = i / Math.max(1, trailPoints.length - 2); // 0到1，0是最老，1是最新
        const thicknessFactor = 0.2 + 0.8 * positionProgress; // 从0.2到1.0，最新的最粗

        // 绘制外发光层
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.1})`;
        ctx.lineWidth = 8 * thicknessFactor; // 最粗8px，逐渐变细
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.filter = 'blur(4px)';

        ctx.beginPath();
        ctx.moveTo(currentPoint.x, currentPoint.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
        ctx.restore();

        // 绘制主线条
        ctx.save();
        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
        ctx.lineWidth = 3 * thicknessFactor; // 最粗3px，逐渐变细
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = `rgba(0, 255, 255, ${opacity * 0.2})`;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.moveTo(currentPoint.x, currentPoint.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
        ctx.restore();

        // 绘制内亮线
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.lineWidth = Math.max(0.3, 1 * thicknessFactor); // 最粗1px，最细0.3px
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(currentPoint.x, currentPoint.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.stroke();
        ctx.restore();
      }
    };

    // 简化轨迹管理
    const manageTrail = () => {
      // 移除过多的轨迹点
      while (trailPoints.length > maxPoints) {
        trailPoints.shift();
      }

      // 移除过老的点（超过0.5秒）
      const now = Date.now();
      for (let i = trailPoints.length - 1; i >= 0; i--) {
        if (now - trailPoints[i].timestamp > 500) {
          trailPoints.splice(i, 1);
        }
      }
    };

    // 鼠标移动事件处理
    let lastMouseX = 0;
    let lastMouseY = 0;
    const handleMouseMove = e => {
      // 只有鼠标移动距离足够时才添加新轨迹点
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastMouseX, 2) + Math.pow(e.clientY - lastMouseY, 2)
      );

      // 只有移动距离大于20像素时才添加新点
      if (distance > 20) {
        trailPoints.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now(),
        });

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
      }
    };

    // 动画循环
    const animate = () => {
      manageTrail();
      drawTrail();
      requestAnimationFrame(animate);
    };

    // 窗口大小改变时重新设置画布尺寸
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 添加事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 开始动画
    animate();

    // 清理函数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // 移除Canvas元素
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  return (
    <main className='text-white relative'>
      <VisitTracker />
      <GalaxyBackground />
      <MyNavigation />
      <About id='about' />
      <Projects id='projects' />
      <Experience id='experience' />
      <Blog id='blog' />
      <Contact id='contact' />
      <LikeButton />
    </main>
  );
}

export default Home;
