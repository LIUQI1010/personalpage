import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { useRef } from 'react';

const About = () => {
  const titleRef = useRef(null);

  useGSAP(() => {
    if (!titleRef.current) return;

    const titleSplit = new SplitText(titleRef.current, {
      type: 'words',
    });

    gsap.from(titleSplit.words, {
      opacity: 0,
      yPercent: 100,
      duration: 0.8,
      ease: 'elastic.out',
      stagger: 0.1,
    });

    // 清理函数 - 当组件卸载时恢复原始文本
    return () => {
      titleSplit.revert();
    };
  }, []);

  return (
    <h2 ref={titleRef} className='about-title text-3xl font-bold text-center'>
      Qi (Chee) Liu
    </h2>
  );
};

export default About;
