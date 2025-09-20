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
  const courseCardsRef = useRef(null);
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
        // 先设置初始状态
        gsap.set(experienceRef.current, {
          opacity: 0,
          x: -60,
          scale: 0.95,
        });

        gsap.to(experienceRef.current, {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: experienceRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.3,
        });
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
            delay: 0.2,
          }
        );
      }

      // 6. Master学位卡片动画 (第一个出现)
      const masterCard = gsap.utils.toArray('.master-card')[0];
      if (masterCard) {
        // 先设置初始状态
        gsap.set(masterCard, {
          opacity: 0,
          y: 30,
          scale: 0.95,
        });

        gsap.to(masterCard, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: academicRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: 0.4,
        });
      }

      // 7. 课程成绩卡片动画 (第二个出现)
      if (courseCardsRef.current) {
        const courseCards = gsap.utils.toArray('.course-card');
        courseCards.forEach((card, index) => {
          // 先设置初始状态
          gsap.set(card, {
            opacity: 0,
            y: 40,
            scale: 0.9,
          });

          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: academicRef.current,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.7 + index * 0.1,
          });
        });
      }

      // 8. Bachelor学位卡片动画 (最后出现)
      const bachelorCard = gsap.utils.toArray('.bachelor-card')[0];
      if (bachelorCard) {
        // 先设置初始状态
        gsap.set(bachelorCard, {
          opacity: 0,
          y: 30,
          scale: 0.95,
        });

        gsap.to(bachelorCard, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: academicRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
          delay: 1.0,
        });
      }

      // 9. 装饰元素动画
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

      // 10. 整体容器初始动画 - 设置初始状态但不影响子元素
      gsap.set(sectionRef.current, {
        opacity: 1,
      });
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
      className='min-h-screen text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
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
              className='bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-400/20 p-8 md:p-10'
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
              {/* 硕士学位信息卡片容器 */}
              <div className='space-y-6'>
                {/* 硕士学位信息卡片 */}
                <div className='master-card p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 relative overflow-hidden'>
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
                      <div className='flex flex-col sm:flex-row items-start sm:items-center md:items-end mt-3 md:mt-0 gap-2'>
                        <div className='px-3 py-1 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-full text-xs md:text-sm text-center'>
                          {educationData.master.period}
                        </div>
                        <div className='relative'>
                          {/* 背景发光效果 - 减少半径 */}
                          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-slate-400 to-slate-500 blur-sm opacity-50 animate-pulse scale-105'></div>
                          <div className='relative px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-bold rounded-full text-xs md:text-sm'>
                            {educationData.master.currentGPA}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='ml-0 md:ml-16'>
                      <p className='text-gray-400 text-base mt-2'>
                        Expected Graduation: {educationData.master.expectedGraduation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 课程成绩直接显示 */}
                <div
                  ref={courseCardsRef}
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                >
                  {educationData.master.keySubjects.map((subject, index) => (
                    <div
                      key={subject.name}
                      className='course-card p-4 rounded-lg border shadow-lg'
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        borderColor: 'rgba(16, 185, 129, 0.3)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <h4 className='text-base font-semibold text-white leading-tight flex-1 mr-2'>
                          {subject.name}
                        </h4>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
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
                      <p className='text-gray-300 text-xs leading-relaxed'>{subject.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 学士学位信息卡片 */}
              <div className='bachelor-card p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 relative overflow-hidden'>
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
