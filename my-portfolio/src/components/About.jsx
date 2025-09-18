import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const About = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const introRef = useRef(null);
  const skillsRef = useRef(null);
  const skillsTitleRef = useRef(null);
  const academicRef = useRef(null);
  const academicTitleRef = useRef(null);
  const highlightsRef = useRef(null);
  const skillCategoriesRef = useRef([]);
  const certificationCardsRef = useRef([]);
  const decorationRef = useRef(null);

  // 技能数据
  const skills = {
    'Cloud & AWS': {
      basic: ['AWS Lambda', 'DynamoDB', 'S3', 'API Gateway', 'Serverless'],
      detailed: [
        'Serverless Architecture',
        'CloudFormation',
        'IAM Policies',
        'AWS Cognito Authentication',
        'API Gateway + Lambda Integration',
        'S3 Static Hosting',
      ],
    },
    Programming: {
      basic: ['Python', 'JavaScript', 'HTML', 'CSS', 'React', 'Java'],
      detailed: [
        'Python Flask/Django',
        'JavaScript ES6+',
        'HTML5 Semantic Elements',
        'CSS3 & Flexbox/Grid',
        'React Hooks & Context',
        'Java Spring Boot',
        'Responsive Design',
      ],
    },
    Database: {
      basic: ['MySQL', 'PostgreSQL', 'DynamoDB', 'SQL', 'NoSQL'],
      detailed: [
        'MySQL Query Optimization',
        'PostgreSQL Advanced Features',
        'DynamoDB Design Patterns',
        'Complex SQL Joins',
        'NoSQL Document Design',
        'Database Indexing',
        'Data Modeling',
      ],
    },
    Tools: {
      basic: ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA', 'PyCharm'],
      detailed: [
        'Git Workflow & Branching',
        'GitHub Actions CI/CD',
        'VS Code Extensions',
        'IntelliJ IDEA Debugging',
        'PyCharm Python Development',
        'Unix/Linux CLI',
        'Docker Basics',
      ],
    },
  };

  // 学术表现数据
  const academicPerformance = {
    degree: 'Master of Computer Science',
    university: 'Victoria University of Wellington',
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
  };

  // 证书数据 - 包含Credly徽章信息
  const certifications = {
    'AWS Certifications': [
      {
        name: 'Solutions Architect Associate',
        status: 'completed',
        year: '2025',
        credlyImageUrl:
          'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
        credlyVerifyUrl: 'https://www.credly.com/badges/4f9b68d1-68e3-480f-857c-c63d6464694f',
        credlyEmbedId: '4f9b68d1-68e3-480f-857c-c63d6464694f', // 用于嵌入代码的备用方案
      },
      {
        name: 'Cloud Practitioner',
        status: 'completed',
        year: '2024',
        credlyImageUrl: '/img/cloud foundation.png', // 使用本地图片
        credlyVerifyUrl: '', // 如果有验证链接可以后续添加
      },
      {
        name: 'Developer Associate',
        status: 'preparing',
        year: 'In Progress',
        credlyImageUrl: '', // 暂时为空，获得认证后填入
        credlyVerifyUrl: '',
      },
    ],
  };

  useGSAP(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. 主标题动画 - 从下方滑入
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
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
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
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
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
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
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
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
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
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
              },
              delay: index * 0.1 + tagIndex * 0.05 + 0.3,
            }
          );
        });
      });

      // 6. 学术表现标题动画
      if (academicTitleRef.current) {
        gsap.fromTo(
          academicTitleRef.current,
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
              trigger: academicTitleRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse',
            },
          }
        );
      }

      // 7. 学术表现内容动画
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
            delay: index * 0.1,
          }
        );
      });

      // 8. 认证区域标题动画
      if (highlightsRef.current) {
        const certTitle = highlightsRef.current.querySelector('h2');
        if (certTitle) {
          gsap.fromTo(
            certTitle,
            {
              opacity: 0,
              y: 50,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: certTitle,
                start: 'top 80%',
                toggleActions: 'play reverse play reverse',
              },
            }
          );
        }
      }

      // 9. 认证卡片动画 - 简单淡入效果
      const certCards = gsap.utils.toArray('.certification-card');
      certCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
            delay: index * 0.1,
          }
        );
      });

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

        gsap.to(shapes, {
          rotation: '+=360',
          duration: 20,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          force3D: true,
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
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // hover功能已移除

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
        <div className='decoration-shape absolute top-20 left-10 w-20 h-20 border border-blue-500/20 rounded-full'></div>
        <div className='decoration-shape absolute top-40 right-20 w-16 h-16 border border-purple-500/20'></div>
        <div className='decoration-shape absolute bottom-40 left-20 w-12 h-12 border border-green-500/20 rounded-full'></div>
        <div className='decoration-shape absolute bottom-20 right-10 w-24 h-24 border border-pink-500/20'></div>
      </div>

      <div className='max-w-6xl mx-auto'>
        {/* 标题部分 */}
        <div className='text-center mb-16'>
          <h1
            ref={titleRef}
            className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'
          >
            Qi (Chee) Liu
          </h1>
          <p ref={subtitleRef} className='text-xl md:text-2xl text-gray-300 font-light'>
            AWS-Certified Solutions Architect & Full-Stack Developer
          </p>
        </div>

        {/* 个人介绍 */}
        <div ref={introRef} className='max-w-4xl mx-auto mb-20'>
          <p className='text-lg md:text-xl text-gray-300 leading-relaxed text-center'>
            Computer Science graduate student at VUW seeking internship opportunities in full-stack
            development or cloud computing. I have hands-on experience with AWS serverless
            architectures and modern web development, combined with strong communication and
            problem-solving skills from my teaching background.
          </p>
        </div>

        {/* 技能展示 */}
        <div ref={skillsRef} className='mb-20'>
          <h2
            ref={skillsTitleRef}
            className='text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'
          >
            Technical Skills
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {Object.entries(skills).map(([category, skillData], categoryIndex) => (
              <div key={category} className='skill-category'>
                <h3 className='text-xl font-semibold mb-4 text-center'>{category}</h3>
                <div className='flex flex-wrap gap-2 justify-center'>
                  {skillData.basic.map((skill, skillIndex) => (
                    <span
                      key={skill}
                      className='skill-tag px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full text-sm border border-blue-500/30 hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-default'
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 证书展示 */}
        <div ref={highlightsRef} className='mb-20'>
          <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'>
            Certifications
          </h2>
          <div className='max-w-5xl mx-auto'>
            {Object.entries(certifications).map(([category, certs]) => (
              <div key={category} className='certification-category'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  {certs.map((cert, index) => (
                    <div
                      key={cert.name}
                      className={`certification-card relative overflow-hidden rounded-xl p-6 transition-all duration-500 group cursor-pointer ${
                        index === 0
                          ? 'border border-[#00b4d8]/30 hover:border-[#00b4d8]/50 hover:shadow-xl hover:shadow-[#00b4d8]/10'
                          : index === 1
                            ? 'border border-[#48cae4]/30 hover:border-[#48cae4]/50 hover:shadow-xl hover:shadow-[#48cae4]/10'
                            : 'border border-[#90e0ef]/30 hover:border-[#90e0ef]/50 hover:shadow-xl hover:shadow-[#90e0ef]/10'
                      }`}
                      style={{
                        backgroundColor:
                          index === 0
                            ? 'rgba(0, 180, 216, 0.08)'
                            : index === 1
                              ? 'rgba(72, 202, 228, 0.08)'
                              : 'rgba(144, 224, 239, 0.08)',
                      }}
                    >
                      {/* AWS徽章区域 - 支持Credly官方徽章 */}
                      <div className='flex justify-center mb-4'>
                        {cert.credlyImageUrl ? (
                          // 使用Credly官方徽章
                          <div className='relative group-hover:scale-150 group-hover:translate-y-3 transition-all duration-500 ease-out'>
                            {cert.credlyVerifyUrl ? (
                              <a
                                href={cert.credlyVerifyUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='block'
                              >
                                <img
                                  src={cert.credlyImageUrl}
                                  alt={`AWS ${cert.name} Certification Badge`}
                                  className='w-20 h-20 object-contain rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-500'
                                />
                              </a>
                            ) : (
                              <img
                                src={cert.credlyImageUrl}
                                alt={`AWS ${cert.name} Certification Badge`}
                                className='w-20 h-20 object-contain rounded-lg shadow-lg group-hover:shadow-2xl transition-shadow duration-300'
                              />
                            )}
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
                            AWS Certified
                          </h4>
                          <h5 className='text-lg font-extrabold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent leading-tight'>
                            {cert.name.toUpperCase()}
                          </h5>
                        </div>

                        {/* 年份 */}
                        <div className='text-center'>
                          <p className='text-gray-400 text-sm font-medium'>{cert.year}</p>
                        </div>
                      </div>

                      {/* 装饰性背景元素 */}
                      <div className='absolute top-0 right-0 w-24 h-24 opacity-5'>
                        <div
                          className={`w-full h-full rounded-full ${
                            cert.status === 'completed'
                              ? 'bg-gradient-to-br from-orange-400 to-yellow-500'
                              : 'bg-gradient-to-br from-blue-400 to-purple-500'
                          }`}
                        ></div>
                      </div>

                      {/* Hover效果的光晕 */}
                      <div className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                        <div
                          className={`absolute inset-0 rounded-xl ${
                            cert.status === 'completed'
                              ? 'bg-gradient-to-br from-orange-500/5 to-yellow-500/5'
                              : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                          }`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 学术表现展示 */}
        <div ref={academicRef} className='mb-20'>
          <h2
            ref={academicTitleRef}
            className='text-3xl md:text-4xl font-bold text-center mb-12 text-white'
            style={{
              background: 'linear-gradient(to right, #10b981, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Academic Performance
          </h2>

          <div className='max-w-6xl mx-auto'>
            {/* 学位信息卡片 */}
            <div className='academic-card mb-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 relative overflow-hidden'>
              {/* VUW Logo作为背景 - 占满整个卡片 */}
              <div
                className='absolute inset-0 bg-center bg-no-repeat bg-contain opacity-15'
                style={{
                  backgroundImage: 'url(/img/Full-logo-green.png)',
                  backgroundSize: '70%',
                }}
              ></div>

              {/* GPA徽章 - 桌面端右上角，与标题对齐，移动端隐藏 */}
              <div className='hidden md:block absolute top-6 right-4 z-20'>
                <div className='px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold shadow-lg'>
                  {academicPerformance.currentGPA}
                </div>
              </div>

              <div className='relative z-10'>
                <div className='flex items-center mb-3'>
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
                      {academicPerformance.degree}
                    </h3>
                    <p className='text-emerald-400 text-lg'>{academicPerformance.university}</p>
                  </div>
                </div>

                <div className='ml-0 md:ml-16'>
                  <p className='text-gray-400 text-base mt-2 mb-3'>
                    Expected Graduation: {academicPerformance.expectedGraduation}
                  </p>

                  {/* GPA徽章 - 移动端显示在下方，桌面端隐藏 */}
                  <div className='md:hidden inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold shadow-lg'>
                    {academicPerformance.currentGPA}
                  </div>
                </div>
              </div>
            </div>

            {/* 核心课程成绩 */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {academicPerformance.keySubjects.map((subject, index) => (
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
