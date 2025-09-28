import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useEffect } from 'react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const About = ({ id }) => {
  const sectionRef = useRef(null);
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

  // 最简方案：完全依赖CSS scroll-snap，无JavaScript干预

  // 简化：只需要判断是否为触摸设备
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // 处理证书区域鼠标滚轮事件
  const handleCertificationWheel = e => {
    if (!certificationGridRef.current) return;

    // 触摸设备上禁用鼠标滚轮
    if (isTouchDevice()) {
      return;
    }

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

  // 移除了复杂的触摸事件处理，现在使用 react-swipeable

  useGSAP(() => {
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
      if (certificationGridRef.current && certificationScrollIndicatorRef.current) {
        const container = certificationGridRef.current;

        // 添加滚动事件监听器
        container.addEventListener('scroll', handleCertificationScroll);

        // 只在非触摸设备上添加鼠标滚轮事件监听器
        if (!isTouchDevice()) {
          container.addEventListener('wheel', handleCertificationWheel, { passive: false });
        }
        // 触摸设备：使用 react-swipeable 处理滑动

        // 立即初始化滚动条，使用正确的尺寸计算
        setTimeout(() => {
          handleCertificationScroll();
        }, 100); // 短暂延迟确保DOM完全渲染
      }
    }, sectionRef.current);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());

      // 清理证书滚动事件监听器
      const container = certificationGridRef.current;
      if (container) {
        container.removeEventListener('scroll', handleCertificationScroll);

        // 只清理鼠标滚轮事件监听器（如果之前添加了）
        if (!isTouchDevice()) {
          container.removeEventListener('wheel', handleCertificationWheel);
        }
      }
    };
  }, []);

  useEffect(() => {
    const qiPaths = document.querySelectorAll('.qi-path, .qi-path-stroke, .qi-path-fill');
    qiPaths.forEach(path => {
      const length = path.getTotalLength();
      path.style.setProperty('--l', length);
    });
  }, []);

  // hover功能已移除

  return (
    <section
      id={id}
      ref={sectionRef}
      className='min-h-screen text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
    >
      <div className='max-w-6xl mx-auto'>
        {/* 标题部分 */}
        <div className='flex flex-col items-center justify-center mb-10'>
          <div className='relative group w-4/5 md:w-1/2' style={{ minWidth: '400px' }}>
            <svg viewBox='0 0 700 143' className='w-full h-auto cursor-pointer'>
              <path
                className='qi-path p1'
                d='M70.6,75.1l13.2,-9.1l9.1,-9.2l5.4,-9.1l1.87,-8.5l-2.87,-7.6l-8.2,-6.3l-15.7,-1.2l-19.8,3.8l-21.8,12.6l-16.4,16l-6.58,12.6l-3.78,11.1l0.63,10.98l2.83,9.135l5,4.725l12.3,3.15l13.9,-0.94l18.9,-5.99l18.6,-12.26l13.8,-13.6l5.4,-14.5l-1.6,-11.9l-8.2,-9.2l-8.8,-4.7l-7.9,-1.3l-11.3,1.3M10.7,110.7l0.6,-8.18l4.8,-8.19l6.6,-2.52l10.1,3.15l44.7,27.74l9.1,3.1l6,-2.2l1.9,-2.8l-0.6,-5'
              ></path>
              <path
                className='qi-path p2'
                d='M112.78,67.2l-11.03,13l-5.98,12.56v6.925l6.295,2.835l12.615,-6.93l9.7,-10.09M120.68,53.4l0.3,3.4l3.1,-0.6v-1.9l-3.4,-0.9'
              ></path>
              <path
                className='qi-path p3'
                d='M240.38,8.6l-23,6l-19.2,10.4l-16.1,14.8l-9.45,15.2l-4.41,13.2l-0.95,16.7l3.78,8.8l7.83,7.88l4.8,2.52l6.3,0.31'
              ></path>
              <path
                className='qi-path p4'
                d='M274.68,42l-7.2,6.3l-1.6,5.1l0.3,3.8l3.2,4.7l6.3,3.5l9.1,0.3l8.8,-1.9l9.5,-6.6l6.3,-8.2l2.2,-7.3l-0.3,-6.9l-3.8,-6.9l-6.6,-3.8l-7.9,-2.2l-11,0.3l-19.6,6.3l-11.9,6.9l-12.9,11.4l-9.8,13.2l-4.41,12l-1.89,14.8l3.15,9.74l6.65,7.24l15.1,4.41l13.8,-1.26l7.9,-2.21l13.6,-6.61l8.2,-5.67l6.3,-6.34'
              ></path>
              <path
                className='qi-path p5'
                d='M335.48,42.4l-17.28,22.3l-20.12,34.985l12.88,-15.485l11.92,-9.4l8.5,-6l9.2,-4.1l2.5,0.7l-7.6,10.7l-5.9,9.1l-2.2,5.66v5.05l2.2,2.51l3.7,1.265l15.8,-14.185'
              ></path>
              <path
                className='qi-path p6'
                d='M350.92,84.9l6.93,1.2l12.33,-5.9l7.2,-6.7l1.9,-4.1l-1.3,-4l-5.6,-1l-13.27,7.6l-9.13,10.7l-3.47,9.11l1.89,7.875l8.5,2.205l12.28,-5.98l11.7,-10.41'
              ></path>
              <path
                className='qi-path p7'
                d='M382.72,84.9l6.93,1.2l12.33,-5.9l7.2,-6.7l1.9,-4.1l-1.3,-4l-5.6,-1l-13.27,7.6l-9.13,10.7l-3.47,9.11l1.89,7.875l8.5,2.205l12.28,-5.98l11.7,-10.41'
              ></path>
              <path
                className='qi-path p8'
                d='M418.93,105.04l15.75,-3.46l13.9,-5.99l15.4,-10.09l10.1,-10.1l8.8,-11l6.6,-13.5l2.8,-10.7l-0.3,-12.6l-6.6,-11.4l-7.9,-5.3l-7.8,-1.6'
              ></path>
              <path
                className='qi-path p9'
                d='M586.18,46.4l-4.1,-2.2l-6.3,2.2l-3.5,4.1l-1.6,6.7l2.6,7.2l7.5,4.7l8.5,4.1l11.4,-1.2l18.6,-8.5l12.9,-12.6l8.79,-15.2l1.58,-11l-4.1,-5.3l-5.67,-1.6l-10.7,4.1l-14.5,14.5l-10.1,15.4l-28.6,38.1l-9.5,10.1l-7.6,5.35l-8.78,-0.31l-3.14,-6.3l1.57,-11.34l3.78,-8.5l5.07,-6.6l2.2,-1.3l15.4,26.16l15.8,11.66l14.1,4.08l14.2,-0.3l7.6,-3.46l3.1,-4.1l0.3,-5.04'
              ></path>
              <path
                className='qi-path p10'
                d='M635.98,67.2l-11.03,13l-5.98,12.56v6.925l6.295,2.835l12.615,-6.93l9.7,-10.09M643.88,53.4l0.3,3.4l3.1,-0.6v-1.9l-3.4,-0.9'
              ></path>
              <path
                className='qi-path p11'
                d='M647.63,85.5l6.61,-5.7l10.74,-12.9l3.1,-1.9l-10.69,15.5l-7.555,12.89l-0.635,4.09l1.895,2.835l5.035,0.945l4.75,-2.84l7.2,-6.93l24.6,-26.49l1.9,-0.6l0.3,2.5l-17.3,20.8l-1.9,7.26l1.2,4.41l5.1,1.575l5,-3.155l9.5,-8.49l3.4,-3.8'
              ></path>
            </svg>
            {/* Tooltip */}
            <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10'>
              <div className='text-center'>
                <div className='font-medium'>Created with Single Line Font Renderer</div>
                <div className='text-xs text-gray-300 mt-1'>
                  jvolker.github.io/single-line-font-renderer
                </div>
              </div>
              {/* Arrow */}
              <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800'></div>
            </div>
          </div>
          <p ref={subtitleRef} className='text-xl md:text-xl text-gray-300 font-light text-center'>
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
              className='overflow-x-scroll overflow-y-hidden md:overflow-x-scroll'
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
                // 触摸设备启用滚动吸附，非触摸设备禁用
                scrollSnapType: isTouchDevice() ? 'x mandatory' : 'none',
              }}
            >
              <div className='flex gap-6 pb-4' style={{ width: 'max-content' }}>
                {Object.entries(certifications).map(([category, certs]) =>
                  certs.map((cert, index) => (
                    <div
                      key={cert.name}
                      className={`certification-card relative overflow-hidden rounded-xl p-6 group cursor-pointer flex-shrink-0 ${
                        index === 0
                          ? 'border border-[#00b4d8]/30 hover:border-[#00b4d8]/50 hover:shadow-xl hover:shadow-[#00b4d8]/10'
                          : index === 1
                            ? 'border border-[#48cae4]/30 hover:border-[#48cae4]/50 hover:shadow-xl hover:shadow-[#48cae4]/10'
                            : 'border border-[#90e0ef]/30 hover:border-[#90e0ef]/50 hover:shadow-xl hover:shadow-[#90e0ef]/10'
                      }`}
                      style={{
                        width: '300px', // 缩小宽度
                        backgroundColor:
                          index === 0
                            ? 'rgba(0, 180, 216, 0.08)'
                            : index === 1
                              ? 'rgba(72, 202, 228, 0.08)'
                              : 'rgba(144, 224, 239, 0.08)',
                        // 触摸设备启用卡片吸附，非触摸设备禁用
                        scrollSnapAlign: isTouchDevice() ? 'start' : 'none',
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
                    width: '32px', // 使用最小宽度作为初始值
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
