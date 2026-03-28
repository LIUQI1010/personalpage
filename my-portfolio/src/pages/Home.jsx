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
import LoadingAnimation from '../components/LoadingAnimation';
import LizardCursor from '../components/LizardCursor';

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

  return (
    <main className='text-white relative'>
      <LoadingAnimation />
      <LizardCursor />
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
