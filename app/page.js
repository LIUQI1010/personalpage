'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import MyNavigation from '@/components/MyNavigation';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import LikeButton from '@/components/LikeButton';
import VisitTracker from '@/components/VisitTracker';

// Canvas/animation 组件需要 ssr: false（访问 window/document/canvas）
const GalaxyBackground = dynamic(() => import('@/components/GalaxyBackground'), { ssr: false });
const LoadingAnimation = dynamic(() => import('@/components/LoadingAnimation'), { ssr: false });
const LizardCursor = dynamic(() => import('@/components/LizardCursor'), { ssr: false });

export default function Home() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    window.scrollTo(0, 0);
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
