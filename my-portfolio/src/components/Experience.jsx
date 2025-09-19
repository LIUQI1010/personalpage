import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const Experience = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const experienceTitleRef = useRef(null);
  const experienceRef = useRef(null);
  const educationTitleRef = useRef(null);
  const educationRef = useRef(null);
  const academicRef = useRef(null);
  const decorationRef = useRef(null);

  // 工作经验数据
  const workExperience = {
    title: 'Overseas Math Teacher',
    period: '2015–2024',
    description:
      'Communicated complex mathematical concepts to diverse student groups, enhancing ability to explain difficult ideas clearly and effectively. Collaborated with colleagues to develop curricula and adapt to new educational technologies, demonstrating quick learning, flexibility, and problem-solving in dynamic environments.',
  };

  // 教育背景数据
  const educationData = {
    master: {
      degree: 'Master of Computer Science',
      university: 'Victoria University of Wellington',
      period: '2024–Present',
      expectedGraduation: 'November 2025',
      currentGPA: 'Overall GPA: A-',
      keySubjects: [
        {
          name: 'Advanced Programming Languages',
          grade: 'A+',
          description: 'Deep dive into programming language theory and advanced concepts',
        },
        {
          name: 'Database System Engineering',
          grade: 'A+',
          description: 'SQL database design, query optimization, and relational database systems',
        },
        {
          name: 'Automated Program Analysis',
          grade: 'A+',
          description: 'Java programming with automated testing frameworks and analysis tools',
        },
      ],
    },
    bachelor: {
      degree: 'BSc in Computer Science and Technology',
      university: 'Southeast University',
      graduationYear: '2015',
      period: '2011–2015',
    },
  };

  useGSAP(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. 主标题动画
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 100,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // 2. 副标题动画
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
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
            delay: 0.2,
          }
        );
      }

      // 3. 工作经验标题动画
      if (experienceTitleRef.current) {
        gsap.fromTo(
          experienceTitleRef.current,
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
              trigger: experienceTitleRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
            delay: 0.4,
          }
        );
      }

      // 4. 工作经验卡片动画
      if (experienceRef.current) {
        gsap.fromTo(
          experienceRef.current,
          {
            opacity: 0,
            x: -60,
            scale: 0.95,
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.25,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: experienceRef.current,
              start: 'top 95%',
              toggleActions: 'play reverse play reverse',
            },
            delay: 0,
          }
        );
      }

      // 5. 教育背景标题动画
      if (educationTitleRef.current) {
        gsap.fromTo(
          educationTitleRef.current,
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
              trigger: educationTitleRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
            delay: 0.8,
          }
        );
      }

      // 6. 学术表现卡片动画
      const academicCards = gsap.utils.toArray('.academic-card');
      academicCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
            delay: 1.0 + index * 0.1,
          }
        );
      });

      // 7. 装饰元素动画
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

        gsap.to(shapes, {
          rotation: '+=360',
          duration: 22,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          force3D: true,
        });
      }

      // 8. 整体容器初始动画
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className='min-h-screen bg-gray-900 text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255,255,255,0.015) 0.5px, transparent 0.5px),
          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.012) 0.3px, transparent 0.3px),
          radial-gradient(circle at 45% 15%, rgba(255,255,255,0.018) 0.4px, transparent 0.4px),
          radial-gradient(circle at 15% 85%, rgba(255,255,255,0.01) 0.2px, transparent 0.2px)
        `,
        backgroundSize: '120px 120px, 80px 80px, 100px 100px, 60px 60px',
        backgroundPosition: '0 0, 40px 40px, 20px 60px, 80px 20px',
      }}
    >
      {/* 背景装饰 */}
      <div
        ref={decorationRef}
        className='absolute inset-0 pointer-events-none'
        style={{ overflowAnchor: 'none', contain: 'layout paint' }}
      >
        <div className='decoration-shape absolute top-20 left-10 w-20 h-20 border border-orange-500/20 rounded-full'></div>
        <div className='decoration-shape absolute top-40 right-20 w-16 h-16 border border-cyan-500/20'></div>
        <div className='decoration-shape absolute bottom-40 left-20 w-12 h-12 border border-yellow-500/20 rounded-full'></div>
        <div className='decoration-shape absolute bottom-20 right-10 w-24 h-24 border border-red-500/20'></div>
      </div>

      <div className='max-w-6xl mx-auto'>
        {/* 标题部分 */}
        <div className='text-center mb-16'>
          <h1
            ref={titleRef}
            className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-300 to-red-600 bg-clip-text text-transparent'
          >
            Experience
          </h1>
          <p ref={subtitleRef} className='text-xl md:text-2xl text-gray-300 font-light'>
            Professional Background & Educational Journey
          </p>
        </div>

        <div className='max-w-5xl mx-auto space-y-12'>
          {/* 工作经验部分 */}
          <div>
            <h2
              ref={experienceTitleRef}
              className='text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-300 to-red-600 bg-clip-text text-transparent'
            >
              Professional Experience
            </h2>
            <div
              ref={experienceRef}
              className='bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-400/20 p-8 md:p-10 hover:border-orange-400/40 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500'
            >
              <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-4'>
                <h3 className='text-2xl md:text-3xl font-bold text-white mb-2 md:mb-0'>
                  {workExperience.title}
                </h3>
                <div className='px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-full text-xs md:text-sm self-start md:self-auto'>
                  {workExperience.period}
                </div>
              </div>
              <p className='text-lg text-gray-300 leading-relaxed'>{workExperience.description}</p>
            </div>
          </div>

          {/* 学术表现展示 */}
          <div ref={academicRef}>
            <h2
              ref={educationTitleRef}
              className='text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-300 to-red-600 bg-clip-text text-transparent'
            >
              Education
            </h2>

            <div className='max-w-6xl mx-auto space-y-8'>
              {/* 硕士学位信息卡片 */}
              <div className='academic-card p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 relative overflow-hidden'>
                {/* VUW Logo作为背景 - 占满整个卡片 */}
                <div
                  className='absolute inset-0 bg-center bg-no-repeat bg-contain opacity-15'
                  style={{
                    backgroundImage: 'url(/img/Full-logo-green.png)',
                    backgroundSize: '70%',
                  }}
                ></div>

                <div className='relative z-10'>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-3'>
                    <div className='flex items-center flex-1'>
                      {/* Shield图标 - 桌面端显示，移动端隐藏 */}
                      <div className='hidden md:flex w-12 h-12 mr-4 overflow-hidden items-center justify-center'>
                        <img
                          src='/img/Shield.png'
                          alt='Victoria University of Wellington Shield'
                          className='h-full object-cover'
                          style={{ objectPosition: 'center' }}
                        />
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold text-white leading-tight mb-1'>
                          {educationData.master.degree}
                        </h3>
                        <p className='text-emerald-400 text-lg'>
                          {educationData.master.university}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col items-start md:items-end mt-3 md:mt-0'>
                      <div className='flex flex-row gap-2 md:flex-col md:gap-0'>
                        <div className='px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-full text-xs md:text-sm'>
                          {educationData.master.period}
                        </div>
                        <div className='px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-orange-300 to-red-600 text-white font-bold rounded-full text-xs md:text-sm md:mt-2'>
                          {educationData.master.currentGPA}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='ml-0 md:ml-16 flex flex-col md:flex-row md:items-end md:justify-between'>
                    <p className='text-gray-400 text-base mt-2 mb-2 md:mb-0'>
                      Expected Graduation: {educationData.master.expectedGraduation}
                    </p>
                  </div>
                </div>
              </div>

              {/* 核心课程成绩 */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                {educationData.master.keySubjects.map((subject, index) => (
                  <div
                    key={subject.name}
                    className='academic-card p-6 rounded-xl border transition-all duration-300 hover:scale-105'
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      borderColor: 'rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <div className='flex justify-between items-start mb-3'>
                      <h4 className='text-lg font-semibold text-white leading-tight flex-1 mr-3'>
                        {subject.name}
                      </h4>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          subject.grade === 'A+'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                            : subject.grade === 'A'
                              ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white'
                              : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                        }`}
                      >
                        {subject.grade}
                      </div>
                    </div>
                    <p className='text-gray-400 text-sm leading-relaxed'>{subject.description}</p>
                  </div>
                ))}
              </div>

              {/* 学士学位信息卡片 */}
              <div className='academic-card p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 relative overflow-hidden'>
                {/* 东南大学背景图片 - 占满整个卡片 */}
                <div
                  className='absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10'
                  style={{
                    backgroundImage: 'url(/img/logo/校标文字组合.png)',
                    backgroundSize: '70%',
                  }}
                ></div>

                <div className='relative z-10'>
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between mb-3'>
                    <div className='flex items-center flex-1'>
                      {/* 东南大学Logo图标 - 桌面端显示，移动端隐藏 */}
                      <div className='hidden md:flex w-12 h-12 mr-4 overflow-hidden items-center justify-center'>
                        <img
                          src='/img/logo/东南大学logo.svg.png'
                          alt='Southeast University Logo'
                          className='h-full object-contain'
                          style={{ objectPosition: 'center' }}
                        />
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold text-white leading-tight mb-1'>
                          {educationData.bachelor.degree}
                        </h3>
                        <p className='text-cyan-400 text-lg'>{educationData.bachelor.university}</p>
                      </div>
                    </div>
                    <div className='flex flex-col items-start md:items-end space-y-2'>
                      <div className='px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-full text-sm'>
                        {educationData.bachelor.period}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
