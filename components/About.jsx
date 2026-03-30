'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download } from 'lucide-react';
import HorizontalScrollContainer from '@/components/ui/HorizontalScrollContainer';
import { skills, certifications } from '@/data/skills';

const About = ({ id }) => {
  const [lightboxImage, setLightboxImage] = useState(null);
  const [downloadCount, setDownloadCount] = useState(null);

  useEffect(() => {
    fetch('/api/cv-downloads')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDownloadCount(data.downloads);
      })
      .catch(() => {});
  }, []);
  const sectionRef = useRef(null);
  const subtitleRef = useRef(null);
  const introRef = useRef(null);
  const skillsRef = useRef(null);
  const skillsTitleRef = useRef(null);
  const highlightsRef = useRef(null);
  const skillCategoriesRef = useRef([]);
  const certificationCardsRef = useRef([]);
  const decorationRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. 主标题动画已移除

      // 2. 副标题动画 - 淡入
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

      // 3. 介绍文本动画 - 逐行显示
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: introRef.current,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.4,
          }
        );
      }

      // 4. 技能标题动画
      if (skillsTitleRef.current) {
        gsap.fromTo(
          skillsTitleRef.current,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: skillsTitleRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // 5. 技能分类动画 - 依次出现
      const skillCategories = gsap.utils.toArray('.skill-category');
      skillCategories.forEach((category, index) => {
        gsap.fromTo(
          category,
          {
            opacity: 0,
            x: index % 2 === 0 ? -50 : 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: category,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
            delay: index * 0.1,
          }
        );

        // 技能标签动画
        const skillTags = category.querySelectorAll('.skill-tag');
        skillTags.forEach((tag, tagIndex) => {
          gsap.fromTo(
            tag,
            {
              opacity: 0,
              scale: 0.8,
              y: 20,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.5,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: category,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
              delay: index * 0.1 + tagIndex * 0.05 + 0.3,
            }
          );
        });
      });

      // 6. 认证区域动画 - 简化为单一动画避免冲突
      if (highlightsRef.current) {
        // 设置初始状态 - 只设置容器，让卡片保持正常状态
        gsap.set(highlightsRef.current, {
          opacity: 0,
          y: 40,
        });

        // 统一的认证区域动画
        gsap.to(highlightsRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: highlightsRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
            onStart: () => {
              // 动画开始时确保滚动位置正确
              if (certificationGridRef.current) {
                certificationGridRef.current.scrollLeft = 0;
              }
            },
          },
        });
      }

      // 8. 装饰元素动画（保持原有的旋转效果）
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
          duration: 20,
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

      // 9. 整体容器初始动画
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

  useEffect(() => {
    const qiPaths = document.querySelectorAll('.qi-path');
    qiPaths.forEach(path => {
      const length = path.getTotalLength();
      path.style.setProperty('--l', length);
    });
    // 等 --l 生效后再触发动画
    requestAnimationFrame(() => {
      qiPaths.forEach(path => path.classList.add('animate'));
    });
  }, []);

  // hover功能已移除

  return (
    <>
    <section
      id={id}
      ref={sectionRef}
      className='min-h-screen text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
    >
      <div className='max-w-6xl mx-auto'>
        {/* 标题部分 */}
        <div className='flex flex-col items-center justify-center mb-10'>
          <div className='relative w-4/5 md:w-1/2' style={{ minWidth: '400px' }}>
            <svg viewBox='0 0 700 160' className='w-full h-auto' aria-labelledby='name-title'>
              <title id='name-title'>Qi Logan Liu</title>
              {/* Q oval */}
              <path className='qi-path' style={{ '--d': '0s' }}
                d='M 80,62 C 78,30 108,16 130,24 C 150,32 155,58 148,78 C 142,98 118,112 96,108 C 78,104 72,82 80,62' />
              {/* Q tail */}
              <path className='qi-path' style={{ '--d': '0.28s' }}
                d='M 128,96 C 140,108 156,110 168,100' />
              {/* i stem */}
              <path className='qi-path' style={{ '--d': '0.42s' }}
                d='M 185,55 C 183,72 181,90 180,105' />
              {/* i dot */}
              <path className='qi-path' style={{ '--d': '0.62s' }}
                d='M 186,39 L 187,42' />
              {/* L */}
              <path className='qi-path' style={{ '--d': '0.82s' }}
                d='M 230,28 C 229,52 228,78 227,105 C 242,106 258,106 272,105' />
              {/* o */}
              <path className='qi-path' style={{ '--d': '1.08s' }}
                d='M 298,56 C 310,54 320,66 318,80 C 316,96 304,106 292,104 C 280,102 274,88 276,74 C 278,60 288,54 298,56' />
              {/* g */}
              <path className='qi-path' style={{ '--d': '1.3s' }}
                d='M 358,58 C 348,52 334,54 328,66 C 322,78 324,94 334,102 C 344,108 358,104 362,92 C 364,82 360,68 358,58 C 357,78 356,102 354,122 C 352,138 340,146 328,138' />
              {/* a */}
              <path className='qi-path' style={{ '--d': '1.62s' }}
                d='M 406,72 C 404,58 392,52 382,56 C 374,62 372,78 376,90 C 382,102 396,106 406,98 C 410,92 408,72 406,55 C 406,72 404,90 404,105' />
              {/* n */}
              <path className='qi-path' style={{ '--d': '1.88s' }}
                d='M 428,55 C 427,72 425,90 424,105 C 427,82 442,52 458,56 C 468,60 470,76 468,105' />
              {/* L */}
              <path className='qi-path' style={{ '--d': '2.2s' }}
                d='M 510,28 C 509,52 508,78 507,105 C 522,106 538,106 552,105' />
              {/* i stem */}
              <path className='qi-path' style={{ '--d': '2.46s' }}
                d='M 572,55 C 570,72 568,90 567,105' />
              {/* i dot */}
              <path className='qi-path' style={{ '--d': '2.66s' }}
                d='M 574,39 L 575,42' />
              {/* u */}
              <path className='qi-path' style={{ '--d': '2.78s' }}
                d='M 595,55 C 593,72 590,86 594,96 C 600,106 614,106 622,96 C 628,88 630,72 632,55 C 630,72 628,90 627,105' />
            </svg>
          </div>
          <p ref={subtitleRef} className='text-xl md:text-xl text-gray-300 font-light text-center'>
            CS Master's Graduate · Full-Stack Developer · AWS Certified
          </p>
        </div>

        {/* 个人介绍 */}
        <div ref={introRef} className='max-w-4xl mx-auto mb-20'>
          <p className='text-lg md:text-xl text-gray-300 leading-relaxed text-center'>
            Master's in Computer Science from Victoria University of Wellington (weighted average ~83%).
            I've shipped a commercial freelance website for a real business, built a serverless AWS platform
            with zero downtime, and developed a PostgreSQL query optimizer using Genetic Programming.
            Before tech, I taught Maths for 8 years — turns out explaining recursion to a hiring manager
            isn't that different from explaining algebra to a room of 15-year-olds.
          </p>
          <div className='flex justify-center mt-6'>
            <a
              href='/Logan-CV.pdf'
              download='Logan-CV.pdf'
              className='group relative inline-flex items-center gap-2 px-5 py-2.5 border border-gray-500 text-gray-300 text-sm tracking-wide rounded-md hover:bg-white/10 hover:border-gray-300 hover:text-white transition-all duration-200'
              aria-label="Download Logan's CV as PDF"
              onClick={() => {
                fetch('/api/cv-downloads', { method: 'POST' })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.success) setDownloadCount(data.downloads);
                  })
                  .catch(() => {});
              }}
            >
              <Download size={20} />
              Download CV
              {downloadCount !== null && (
                <span className='absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-gray-300 bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none'>
                  {downloadCount} downloads
                </span>
              )}
            </a>
          </div>
        </div>

        {/* 技能展示 */}
        <div ref={skillsRef} className='mb-20'>
          <h2
            ref={skillsTitleRef}
            className='text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'
          >
            Technical Skills
          </h2>
          <div className='relative'>
            {/* 背景星点 */}
            {Array.from({ length: 18 }, (_, i) => (
              <span
                key={i}
                className='absolute rounded-full pointer-events-none'
                style={{
                  left: `${((i * 47 + 13) % 97) + 1.5}%`,
                  top: `${((i * 31 + 7) % 93) + 3}%`,
                  width: i % 5 === 0 ? '2px' : '1px',
                  height: i % 5 === 0 ? '2px' : '1px',
                  backgroundColor: 'white',
                  opacity: 0.1 + (i % 5) * 0.06,
                }}
              />
            ))}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12'>
              {Object.entries(skills).map(([category, skillData], categoryIndex) => {
                const categoryStyles = {
                  'Cloud & AWS': {
                    title: 'from-cyan-400 to-teal-400',
                    dot: 'bg-cyan-400',
                    dotGlow: '0 0 6px rgba(34, 211, 238, 0.8)',
                    line: 'from-cyan-400/30 to-transparent',
                    tagBorder: 'hover:border-cyan-500/50',
                    tagDot: 'bg-cyan-400',
                  },
                  Programming: {
                    title: 'from-green-400 to-emerald-400',
                    dot: 'bg-green-400',
                    dotGlow: '0 0 6px rgba(74, 222, 128, 0.8)',
                    line: 'from-green-400/30 to-transparent',
                    tagBorder: 'hover:border-green-500/50',
                    tagDot: 'bg-green-400',
                  },
                  Database: {
                    title: 'from-orange-400 to-amber-400',
                    dot: 'bg-orange-400',
                    dotGlow: '0 0 6px rgba(251, 146, 60, 0.8)',
                    line: 'from-orange-400/30 to-transparent',
                    tagBorder: 'hover:border-orange-500/50',
                    tagDot: 'bg-orange-400',
                  },
                  Tools: {
                    title: 'from-purple-400 to-pink-400',
                    dot: 'bg-purple-400',
                    dotGlow: '0 0 6px rgba(196, 181, 253, 0.8)',
                    line: 'from-purple-400/30 to-transparent',
                    tagBorder: 'hover:border-purple-500/50',
                    tagDot: 'bg-purple-400',
                  },
                };
                const tagRotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0', 'rotate-1', '-rotate-2'];
                const style = categoryStyles[category] ?? categoryStyles['Tools'];
                return (
                  <div
                    key={category}
                    className={`skill-category ${categoryIndex % 2 === 1 ? 'md:mt-10' : ''}`}
                  >
                    {/* 星座簇标题 */}
                    <div className='flex items-center gap-3 mb-5'>
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${style.dot}`}
                        style={{ boxShadow: style.dotGlow }}
                      />
                      <h3 className={`text-xs font-semibold tracking-[0.25em] uppercase bg-gradient-to-r ${style.title} bg-clip-text text-transparent`}>
                        {category}
                      </h3>
                      <div className={`flex-1 h-px bg-gradient-to-r ${style.line}`} />
                    </div>
                    {/* 技能标签 */}
                    <div className='flex flex-wrap gap-2'>
                      {skillData.basic.map((skill, skillIndex) => (
                        <span
                          key={skill}
                          className={`skill-tag flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-sm border border-white/10 ${style.tagBorder} bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-default ${tagRotations[skillIndex % tagRotations.length]}`}
                        >
                          <span className={`w-1 h-1 rounded-full flex-shrink-0 ${style.tagDot} opacity-60`} />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 证书展示 */}
        <div ref={highlightsRef} className='mb-20'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
            Certifications
          </h2>

          {/* 横向滚动容器 */}
          <div className='relative max-w-6xl mx-auto'>
            <HorizontalScrollContainer
              hintText='Swipe to explore certifications'
              gradientFrom='from-green-400'
              gradientTo='to-blue-500'
              arrowColor='text-green-400'
            >
                {certifications.map((cert, index) => {
                  const certThemes = {
                    'Foundational C# with Microsoft': {
                      border: 'border-purple-500/30 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/10',
                      bg: 'rgba(168, 85, 247, 0.08)',
                      nameGradient: 'from-purple-400 to-violet-300',
                      decorBg: 'bg-gradient-to-br from-purple-400 to-violet-500',
                    },
                    'Solutions Architect Associate': {
                      border: 'border-orange-500/30 hover:border-orange-500/60 hover:shadow-xl hover:shadow-orange-500/10',
                      bg: 'rgba(249, 115, 22, 0.08)',
                      nameGradient: 'from-orange-400 to-yellow-400',
                      decorBg: 'bg-gradient-to-br from-orange-400 to-yellow-500',
                    },
                    'Cloud Practitioner': {
                      border: 'border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-xl hover:shadow-cyan-500/10',
                      bg: 'rgba(6, 182, 212, 0.08)',
                      nameGradient: 'from-cyan-400 to-blue-400',
                      decorBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
                    },
                    'Developer Associate': {
                      border: 'border-blue-500/30 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10',
                      bg: 'rgba(59, 130, 246, 0.05)',
                      nameGradient: 'from-blue-400 to-indigo-400',
                      decorBg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
                    },
                  };
                  const theme = certThemes[cert.name] ?? certThemes['Cloud Practitioner'];
                  return (
                    <div
                      key={cert.name}
                      onClick={() => cert.credlyImageUrl && setLightboxImage(cert.credlyImageUrl)}
                      className={`certification-card relative overflow-hidden rounded-xl p-6 group cursor-pointer flex-shrink-0 border ${theme.border}`}
                      style={{
                        width: '300px',
                        backgroundColor: theme.bg,
                        scrollSnapAlign: 'start',
                      }}
                    >
                      {/* AWS徽章区域 - 支持Credly官方徽章 */}
                      <div className='flex justify-center mb-4'>
                        {cert.credlyImageUrl ? (
                          // 使用Credly官方徽章
                          <div
                            className='relative group-hover:scale-150 group-hover:translate-y-3 transition-all duration-500 ease-out'
                          >
                              <img
                                src={cert.credlyImageUrl}
                                alt={`${cert.issuer} ${cert.name} Certification Badge`}
                                loading='lazy'
                                decoding='async'
                                className='w-20 h-20 object-contain rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-500'
                              />
                          </div>
                        ) : (
                          // 备用设计（没有Credly徽章时）
                          <div
                            className={`relative w-20 h-20 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-150 group-hover:translate-y-3 group-hover:shadow-2xl transition-all duration-500 ease-out ${
                              cert.status === 'completed'
                                ? 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600'
                                : cert.status === 'preparing'
                                  ? 'bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 border-2 border-dashed border-slate-300'
                                  : 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
                            }`}
                          >
                            {cert.status === 'preparing' ? (
                              // 进行中占位设计
                              <div className='text-slate-600 text-center'>
                                <div className='w-10 h-10 mx-auto mb-1 opacity-40'>
                                  <svg viewBox='0 0 100 100' fill='currentColor'>
                                    {/* 占位徽章轮廓 */}
                                    <circle
                                      cx='50'
                                      cy='50'
                                      r='45'
                                      fill='none'
                                      stroke='currentColor'
                                      strokeWidth='3'
                                      strokeDasharray='8,4'
                                    />
                                    <circle
                                      cx='50'
                                      cy='50'
                                      r='25'
                                      fill='none'
                                      stroke='currentColor'
                                      strokeWidth='2'
                                    />
                                    {/* AWS 文字 */}
                                    <text
                                      x='50'
                                      y='58'
                                      fontSize='14'
                                      fontWeight='bold'
                                      textAnchor='middle'
                                      fill='currentColor'
                                    >
                                      AWS
                                    </text>
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              // 已认证AWS Logo SVG
                              <div className='text-white'>
                                <svg viewBox='0 0 120 70' className='w-14 h-8' fill='currentColor'>
                                  {/* 云朵形状 */}
                                  <path
                                    d='M25 40c-4 0-7-3-7-7s3-7 7-7c1-10 9-18 20-18s19 8 20 18c4 0 7 3 7 7s-3 7-7 7H25z'
                                    opacity='0.8'
                                  />
                                  {/* AWS文字 */}
                                  <text
                                    x='30'
                                    y='58'
                                    fontSize='12'
                                    fontWeight='bold'
                                    letterSpacing='2'
                                  >
                                    AWS
                                  </text>
                                </svg>
                              </div>
                            )}

                            {/* 认证状态图标 */}
                            {cert.status === 'completed' && (
                              <div className='absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white'>
                                <svg
                                  className='w-3 h-3 text-white'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              </div>
                            )}

                            {/* 背景装饰 */}
                            <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent'></div>
                          </div>
                        )}
                      </div>

                      {/* 文字内容整体容器 */}
                      <div className='group-hover:scale-80 group-hover:translate-y-4 transition-all duration-500 ease-out'>
                        {/* 状态标签 */}
                        <div className='flex justify-center mb-3'>
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                              cert.status === 'completed'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                            }`}
                          >
                            {cert.status === 'completed' ? '✓ CERTIFIED' : 'IN PROGRESS'}
                          </div>
                        </div>

                        {/* 证书名称 */}
                        <div className='text-center mb-3'>
                          <h4 className='text-base font-bold text-white mb-1 leading-tight'>
                            {cert.issuer} Certified
                          </h4>
                          <h5 className={`text-lg font-extrabold bg-gradient-to-r ${theme.nameGradient} bg-clip-text text-transparent leading-tight`}>
                            {cert.name.toUpperCase()}
                          </h5>
                        </div>

                        {/* 验证链接 */}
                        {cert.credlyVerifyUrl && (
                          <div className='flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <a
                              href={cert.credlyVerifyUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              onClick={(e) => e.stopPropagation()}
                              className={`text-xs bg-gradient-to-r ${theme.nameGradient} bg-clip-text text-transparent hover:underline`}
                            >
                              Verify →
                            </a>
                          </div>
                        )}
                      </div>

                      {/* 装饰性背景元素 */}
                      <div className='absolute top-0 right-0 w-24 h-24 opacity-5'>
                        <div className={`w-full h-full rounded-full ${theme.decorBg}`}></div>
                      </div>

                      {/* Hover效果的光晕 */}
                      <div className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none'>
                        <div className={`absolute inset-0 rounded-xl ${theme.decorBg} opacity-5`}></div>
                      </div>
                    </div>
                  );
                })}
            </HorizontalScrollContainer>
          </div>
        </div>
      </div>
    </section>

    {/* Lightbox 弹窗 - 通过 Portal 渲染到 body */}
    {lightboxImage && typeof document !== 'undefined' && createPortal(
      <div
        className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer'
        onClick={() => setLightboxImage(null)}
      >
        <div className='relative' onClick={(e) => e.stopPropagation()}>
          <button
            className='absolute -top-3 -right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors z-10'
            onClick={() => setLightboxImage(null)}
          >
            <svg className='w-4 h-4 text-gray-800' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt='Certificate'
            className='max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl'
          />
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default About;
