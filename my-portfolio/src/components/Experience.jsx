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
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none reverse',
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
              start: 'top 90%',
              toggleActions: 'play none none reverse',
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
              start: 'top 90%',
              toggleActions: 'play none none reverse',
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
              toggleActions: 'play none none reverse',
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
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.3,
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
          },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.5 + index * 0.1,
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
      className='min-h-screen bg-gray-800 text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
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
              {/* 硕士学位信息卡片容器 - 包含hover时显示的课程卡片 */}
              <div className='relative group'>
                {/* 全屏背景模糊遮罩 - 先出现 */}
                <div className='fixed inset-0 bg-black/20 backdrop-blur-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in z-10 pointer-events-none'></div>
                {/* hover时显示的课程卡片 - 延迟出现 */}
                <div
                  className='hover-cards-container absolute bottom-full left-0 w-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-700 ease-out transform translate-y-8 group-hover:translate-y-0 z-30'
                  style={{ transitionDelay: '200ms' }}
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {educationData.master.keySubjects.map((subject, index) => {
                      // 固定每张卡片的延迟时间，确保顺序一致
                      const delays = ['300ms', '400ms', '500ms'];
                      return (
                        <div
                          key={subject.name}
                          className='course-card p-6 rounded-xl border transition-all duration-500 hover:scale-105 shadow-xl transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.12)',
                            borderColor: 'rgba(16, 185, 129, 0.3)',
                            backdropFilter: 'blur(8px)',
                            transitionDelay: delays[index] || '300ms',
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
                          <p className='text-gray-300 text-sm leading-relaxed'>
                            {subject.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* 指向箭头 */}
                  <div className='flex justify-center mt-4'>
                    <div className='w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-emerald-400/50'></div>
                  </div>
                </div>

                {/* 硕士学位信息卡片 */}
                <div className='academic-card p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 relative overflow-hidden hover:border-emerald-400/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 cursor-pointer z-20'>
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
                        <div className='px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-full text-xs md:text-sm text-center'>
                          {educationData.master.period}
                        </div>
                      </div>
                    </div>

                    <div className='ml-0 md:ml-16 flex flex-col md:flex-row md:items-end md:justify-between'>
                      <p className='text-gray-400 text-base mt-2 mb-2 md:mb-0'>
                        Expected Graduation: {educationData.master.expectedGraduation}
                      </p>
                      <div className='relative'>
                        {/* 背景发光效果 - 减少半径 */}
                        <div className='absolute inset-0 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 blur-sm opacity-50 animate-pulse scale-105'></div>
                        <div className='relative px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-bold rounded-full text-xs md:text-sm mt-2 md:mt-0'>
                          {educationData.master.currentGPA}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
