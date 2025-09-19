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
  const highlightsRef = useRef(null);
  const skillCategoriesRef = useRef([]);
  const certificationCardsRef = useRef([]);
  const decorationRef = useRef(null);
  const certificationGridRef = useRef(null);
  const certificationScrollIndicatorRef = useRef(null);

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

  // 处理证书滚动条
  const handleCertificationScroll = () => {
    if (!certificationGridRef.current || !certificationScrollIndicatorRef.current) return;

    const container = certificationGridRef.current;
    const indicator = certificationScrollIndicatorRef.current;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const scrollPercent = scrollWidth > 0 ? (scrollLeft / scrollWidth) * 100 : 0;

    const trackElement = indicator.parentElement;
    if (!trackElement) return;

    const trackWidth = trackElement.getBoundingClientRect().width;

    // 计算滑块的真实大小 - 反映可视区域与总内容的比例
    const visibleRatio = container.clientWidth / container.scrollWidth;
    const sliderWidth = Math.max(32, trackWidth * visibleRatio); // 最小32px

    // 计算滑块位置
    const maxSliderPosition = trackWidth - sliderWidth;
    const clampedPercent = Math.max(0, Math.min(100, scrollPercent));
    const sliderPosition = (clampedPercent / 100) * maxSliderPosition;

    // 更新滑块样式
    indicator.style.left = `${sliderPosition}px`;
    indicator.style.width = `${sliderWidth}px`;
  };

  // 防抖计时器
  const certificationWheelTimeoutRef = useRef(null);

  // 处理证书区域鼠标滚轮事件
  const handleCertificationWheel = e => {
    if (!certificationGridRef.current) return;

    const container = certificationGridRef.current;
    const scrollAmount = e.deltaY * 0.8;
    const currentScrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    // 添加容差值，避免浮点数精度问题
    const tolerance = 2;

    // 计算目标滚动位置
    const targetScrollLeft = currentScrollLeft + scrollAmount;

    // 更精确的边界检测
    const isAtLeftEdge = currentScrollLeft <= tolerance && scrollAmount < 0;
    const isAtRightEdge = currentScrollLeft >= maxScrollLeft - tolerance && scrollAmount > 0;

    // 如果到达边界，允许垂直滚动
    if (isAtLeftEdge || isAtRightEdge) {
      // 清除防抖计时器
      if (certificationWheelTimeoutRef.current) {
        clearTimeout(certificationWheelTimeoutRef.current);
        certificationWheelTimeoutRef.current = null;
      }
      // 不阻止默认行为，让页面垂直滚动
      return;
    }

    // 否则阻止默认行为，进行横向滚动
    e.preventDefault();

    // 计算并设置新的滚动位置
    const clampedScrollLeft = Math.max(0, Math.min(maxScrollLeft, targetScrollLeft));
    container.scrollLeft = clampedScrollLeft;

    // 立即更新滚动条
    handleCertificationScroll();

    // 防抖处理滚动条更新
    if (certificationWheelTimeoutRef.current) {
      clearTimeout(certificationWheelTimeoutRef.current);
    }

    certificationWheelTimeoutRef.current = setTimeout(() => {
      handleCertificationScroll();
      certificationWheelTimeoutRef.current = null;
    }, 50);
  };

  // 处理证书滚动条拖动
  const handleCertificationScrollbarClick = e => {
    if (!certificationGridRef.current || !e.currentTarget) return;

    const scrollbar = e.currentTarget;
    const rect = scrollbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollbarWidth = rect.width;
    const clickPercent = (clickX / scrollbarWidth) * 100;

    const container = certificationGridRef.current;
    const scrollWidth = container.scrollWidth - container.clientWidth;
    const targetScrollLeft = (clickPercent / 100) * scrollWidth;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  };

  // 处理证书滚动条滑块拖动
  const handleCertificationScrollbarMouseDown = e => {
    e.preventDefault();
    e.stopPropagation();

    const container = certificationGridRef.current;
    const scrollbarTrack = e.currentTarget.parentElement;
    if (!container || !scrollbarTrack) return;

    const trackRect = scrollbarTrack.getBoundingClientRect();
    const scrollWidth = container.scrollWidth - container.clientWidth;

    // 计算当前滑块的实际大小
    const visibleRatio = container.clientWidth / container.scrollWidth;
    const sliderWidth = Math.max(32, trackRect.width * visibleRatio);
    const maxSliderPosition = trackRect.width - sliderWidth;

    const handleMouseMove = moveEvent => {
      const mouseX = moveEvent.clientX - trackRect.left;
      const sliderPosition = Math.max(0, Math.min(maxSliderPosition, mouseX - sliderWidth / 2));
      const scrollPercent = maxSliderPosition > 0 ? sliderPosition / maxSliderPosition : 0;

      container.scrollLeft = scrollPercent * scrollWidth;
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
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
              start: 'top 90%',
              end: 'bottom 10%',
              toggleActions: 'play none none reverse',
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

      // 6. 认证区域整体动画
      if (highlightsRef.current) {
        gsap.fromTo(
          highlightsRef.current,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: highlightsRef.current,
              start: 'top 98%',
              end: 'bottom 2%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // 认证区域标题动画已由整体容器动画处理
      }

      // 7. 认证卡片动画 - 由整体容器动画处理，这里只添加轻微的延迟效果
      const certCards = gsap.utils.toArray('.certification-card');
      certCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: highlightsRef.current,
              start: 'top 98%',
              end: 'bottom 2%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.3 + index * 0.1,
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

      // 添加证书滚动条事件监听器
      setTimeout(() => {
        if (certificationGridRef.current && certificationScrollIndicatorRef.current) {
          const container = certificationGridRef.current;

          // 添加滚动事件监听器
          container.addEventListener('scroll', handleCertificationScroll);

          // 添加鼠标滚轮事件监听器
          container.addEventListener('wheel', handleCertificationWheel, { passive: false });

          // 初始化滚动条位置
          handleCertificationScroll();
        }
      }, 500); // 延迟确保DOM完全渲染
    }, sectionRef.current);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // 清理证书滚动事件监听器
      const container = certificationGridRef.current;
      if (container) {
        container.removeEventListener('scroll', handleCertificationScroll);
        container.removeEventListener('wheel', handleCertificationWheel);
      }
    };
  }, []);

  // hover功能已移除

  return (
    <section
      id={id}
      ref={sectionRef}
      className='min-h-screen bg-gray-950 text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
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

          {/* 横向滚动容器 */}
          <div className='relative max-w-6xl mx-auto'>
            {/* 滚动容器 */}
            <div
              ref={certificationGridRef}
              className='overflow-x-scroll overflow-y-hidden'
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div className='flex gap-6 pb-4' style={{ width: 'max-content' }}>
                {Object.entries(certifications).map(([category, certs]) =>
                  certs.map((cert, index) => (
                    <div
                      key={cert.name}
                      className={`certification-card relative overflow-hidden rounded-xl p-6 transition-all duration-500 group cursor-pointer flex-shrink-0 ${
                        index === 0
                          ? 'border border-[#00b4d8]/30 hover:border-[#00b4d8]/50 hover:shadow-xl hover:shadow-[#00b4d8]/10'
                          : index === 1
                            ? 'border border-[#48cae4]/30 hover:border-[#48cae4]/50 hover:shadow-xl hover:shadow-[#48cae4]/10'
                            : 'border border-[#90e0ef]/30 hover:border-[#90e0ef]/50 hover:shadow-xl hover:shadow-[#90e0ef]/10'
                      }`}
                      style={{
                        width: '400px', // 增加宽度确保需要滚动
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

                        {/* 年份已隐藏 */}
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
                  ))
                )}
              </div>
            </div>

            {/* 自定义滚动条 */}
            <div className='mt-6 px-4'>
              {/* 滚动条轨道 */}
              <div
                className='w-full h-2 bg-gray-700/50 rounded-full relative cursor-pointer'
                onClick={handleCertificationScrollbarClick}
              >
                {/* 滚动条滑块 */}
                <div
                  ref={certificationScrollIndicatorRef}
                  className='absolute top-0 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full cursor-grab active:cursor-grabbing hover:shadow-lg'
                  style={{
                    left: '0px',
                    width: '64px', // 初始宽度，将被JavaScript动态更新
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseDown={handleCertificationScrollbarMouseDown}
                ></div>
              </div>
            </div>

            {/* 滚动提示文字 */}
            <div className='text-center mt-4'>
              <p className='text-gray-400 text-sm flex items-center justify-center gap-3'>
                <span className='animate-arrow-blink text-green-400 font-bold'>←</span>
                <span className='font-medium'>Swipe to explore certifications</span>
                <span className='animate-arrow-blink text-green-400 font-bold'>→</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
