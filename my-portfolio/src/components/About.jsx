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
    const qiPath = document.querySelectorAll('.qi-path');
    qiPath.forEach(path => {
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
        <div className='text-center mb-16'>
          <svg className='w-1/2 mx-auto min-w-80' viewBox='0 80 500 150'>
            <path
              className='qi-path p1'
              d='M 57.334 133.781 C 57.334 135.159 57.334 139.291 57.334 137.913 C 57.334 136.88 57.334 133.781 57.334 134.814 C 57.334 137.321 54.147 144.288 55.268 142.046 C 55.823 140.935 56.779 140.057 57.334 138.946 C 58.993 135.629 52.029 152.795 53.202 149.277 C 53.788 147.518 54.818 145.911 55.268 144.112 C 56.565 138.926 50.087 164.85 51.136 159.608 C 51.627 157.149 52.71 154.834 53.202 152.376 C 53.546 150.654 52.513 155.82 52.169 157.541 C 51.536 160.708 51.136 163.439 51.136 166.839 C 51.136 167.872 51.136 170.971 51.136 169.938 C 51.136 167.528 51.136 165.117 51.136 162.707 C 51.136 157.886 51.136 181.99 51.136 177.17 C 51.136 163.289 55.877 193.458 51.136 179.236 C 50.238 176.542 52.304 184.806 53.202 187.5 C 53.928 189.679 59.671 195.138 53.202 185.434 C 51.321 182.612 58.851 197.765 57.334 194.732 C 56.779 193.621 55.823 192.743 55.268 191.632 C 54.158 189.411 57.179 196.72 59.4 197.831 C 61.31 198.786 60.277 196.72 58.367 195.765 C 56.395 194.778 61.56 198.911 63.533 199.897 C 65.59 200.926 63.524 199.893 61.466 198.864 C 58.983 197.622 72.507 199.897 69.731 199.897 C 68.353 199.897 66.976 199.897 65.599 199.897 C 62.424 199.897 77.908 196.827 74.896 197.831 C 73.435 198.318 72.225 199.41 70.764 199.897 C 67.682 200.924 81.934 193.279 79.028 194.732 C 72.952 197.77 83.1 187.622 80.061 193.698 C 78.684 196.453 85.168 182.512 84.194 185.434 C 80.559 196.339 92.043 174.176 85.227 184.401 C 83.415 187.119 89.787 172.182 88.326 175.103 C 82.578 186.599 93.436 161.839 89.359 174.07 C 88.265 177.353 90.392 160.279 90.392 163.74 C 90.392 165.117 90.392 166.495 90.392 167.872 C 90.392 171.316 90.392 154.098 90.392 157.541 C 90.392 158.919 90.392 160.296 90.392 161.674 C 90.392 165.134 89.359 147.882 89.359 151.343 C 89.359 160.744 89.41 149.379 88.326 147.211 C 85.467 141.494 79.29 124.484 70.764 124.484 C 66.348 124.484 58.356 130.693 58.367 130.682 C 59.745 129.305 52.858 136.192 54.235 134.814 C 54.479 134.571 52.858 134.814 53.202 134.814'
            />
            <path
              className='qi-path p2'
              d='M 75.929 178.203 C 81.895 181.185 95.557 193.698 95.557 193.698'
            />
            <path
              className='qi-path p3'
              d='M 106.921 169.938 C 105.843 172.094 106.921 179.58 106.921 177.17 C 106.921 176.136 106.921 181.302 106.921 180.269 C 106.921 178.203 106.921 188.533 106.921 186.467 C 106.921 185.434 106.921 184.401 106.921 183.368 C 106.921 181.302 106.921 191.632 106.921 189.566 C 106.921 188.393 106.921 199.951 106.921 193.698'
            />
            <path
              className='qi-path p4'
              d='M 101.756 153.409 C 106.307 153.409 111.053 158.575 111.053 158.575'
            />
            <path
              className='qi-path p5'
              d='M 145.144 131.715 C 141.203 135.656 142.045 137.116 142.045 136.88 C 142.045 134.702 139.005 145.027 139.979 143.079 C 140.466 142.105 140.525 140.953 141.012 139.98 C 142.282 137.44 138.048 150.938 138.946 148.244 C 139.395 146.897 139.344 145.382 139.979 144.112 C 141.549 140.971 136.802 157.774 137.913 154.442 C 138.468 152.777 138.39 150.943 138.946 149.277 C 140.04 145.994 137.913 163.068 137.913 159.608 C 137.913 145.891 137.913 174.357 137.913 160.641 C 137.913 157.886 137.913 171.66 137.913 168.905 C 137.913 165.827 139.456 177.157 137.913 174.07 C 136.88 172.004 142.045 182.335 141.012 180.269 C 140.457 179.158 139.501 178.28 138.946 177.17 C 138.257 175.792 139.923 180.213 141.012 181.302 C 141.492 181.782 144.072 183.329 141.012 180.269 C 139.794 179.051 144.111 186.123 144.111 184.401 C 144.111 183.312 144.374 186.73 145.144 187.5 C 146.022 188.378 148.088 191.477 147.21 190.599 C 147.201 190.59 154.442 195.765 154.442 195.765'
            />
            <path
              className='qi-path p6'
              d='M 185.433 135.847 C 178.686 129.1 174.615 136.335 174.07 136.88 C 172.758 138.192 170.692 143.357 172.004 142.046 C 173.177 140.872 173.177 138.806 172.004 139.98 C 170.282 141.701 170.2 149.521 170.97 147.211 C 171.419 145.864 172.004 144.498 172.004 143.079 C 172.004 139.904 169.937 155.551 169.937 152.376 C 169.937 141.415 166.379 165.119 169.937 154.442 C 170.923 151.484 168.904 166.858 168.904 163.74 C 168.904 150.27 168.904 178.321 168.904 164.773 C 168.904 161.997 171.179 175.52 169.937 173.037 C 168.652 170.466 175.739 181.938 175.103 181.302 C 174.014 180.213 180.775 183.368 179.235 183.368 C 176.301 183.368 183.947 183.368 181.301 183.368 C 179.579 183.368 188.188 183.368 186.466 183.368 C 186.275 183.368 193.698 178.203 193.698 178.203'
            />
            <path
              className='qi-path p7'
              d='M 205.061 129.649 C 205.061 134.56 205.061 138.734 205.061 136.88 C 205.061 134.47 205.061 146.522 205.061 144.112 C 205.061 143.079 205.061 142.046 205.061 141.013 C 205.061 137.913 205.061 153.409 205.061 150.31 C 205.061 148.933 205.061 147.555 205.061 146.178 C 205.061 143.06 203.042 158.434 204.028 155.475 C 204.477 154.128 205.061 152.763 205.061 151.343 C 205.061 148.225 204.028 163.759 204.028 160.641 C 204.028 159.263 204.028 157.886 204.028 156.508 C 204.028 154.787 204.028 159.952 204.028 161.674 C 204.028 162.592 204.028 166.265 204.028 161.674 C 204.028 159.918 201.754 168.081 202.995 166.839 C 203.544 166.29 202.995 172.435 202.995 174.07 C 202.995 176.848 202.995 178.087 202.995 178.203 C 202.995 179.958 201.962 185.124 201.962 183.368 C 201.962 174.157 203.893 161.809 208.16 157.541 C 210.049 155.653 214.359 158.575 214.359 158.575 C 214.359 158.575 217.303 162.552 216.425 161.674 C 215.737 160.986 216.425 166.702 216.425 164.773 C 216.425 162.707 216.425 173.037 216.425 170.971 C 216.425 160.87 216.425 182.105 216.425 172.004 C 216.425 169.594 216.425 181.646 216.425 179.236 C 216.425 177.696 218.491 183.368 218.491 183.368'
            />
            <path
              className='qi-path p8'
              d='M 229.855 165.806 C 242.666 172.211 242.251 154.442 242.251 154.442 C 242.251 154.442 236.053 153.409 236.053 153.409 C 236.053 153.409 233.131 155.298 232.954 155.475 C 230.885 157.544 229.855 166.552 229.855 164.773 C 229.855 162.707 229.855 173.037 229.855 170.971 C 229.855 170.627 229.855 171.66 229.855 172.004 C 229.855 173.859 233.232 178.481 231.921 177.17 C 231.043 176.292 234.142 178.358 235.02 179.236 C 236.237 180.453 241.907 179.236 240.185 179.236 C 238.808 179.236 237.43 179.236 236.053 179.236 C 232.954 179.236 248.45 179.236 245.351 179.236 C 235.734 179.236 255.321 174.25 247.417 178.203 C 246.039 178.891 250.009 176.136 251.549 176.136'
            />
            <path
              className='qi-path p9'
              d='M 258.78 164.773 C 265.63 164.773 265.452 162.233 266.012 161.674 C 268.961 158.724 270.493 159.259 270.144 159.608 C 269.14 160.612 271.177 155.475 271.177 155.475 C 271.177 155.475 269.846 153.112 269.111 152.376 C 263.146 146.411 256.714 156.882 256.714 158.575 C 256.714 169.767 261.688 171.813 266.012 176.136 C 267.253 177.378 272.747 174.318 271.177 175.103 C 265.274 178.055 268.912 175.719 270.144 175.103 C 272.49 173.931 279.721 170.831 277.375 172.004 C 275.998 172.693 274.524 173.216 273.243 174.07 C 271.177 175.448 277.086 170.723 279.441 169.938 C 282.539 168.905 277.581 173.865 281.508 169.938'
            />
            <path
              className='qi-path p10'
              d='M 285.64 123.451 C 285.64 128.528 288.027 128.937 287.706 128.616 C 286.072 126.982 291.838 136.88 290.805 134.814 C 290.25 133.704 289.294 132.826 288.739 131.715 C 287.566 129.369 293.011 141.292 291.838 138.946 C 291.351 137.972 291.292 136.821 290.805 135.847 C 289.632 133.502 295.077 145.424 293.904 143.079 C 290.902 137.074 293.904 150.733 293.904 144.112 C 293.904 140.845 297.003 156.676 297.003 153.409 C 297.003 149.621 297.003 168.561 297.003 164.773 C 297.003 163.395 297.977 167.931 297.003 168.905 C 296.659 169.249 295.97 170.425 295.97 169.938 C 295.97 167.844 294.001 178.01 294.937 176.136 C 296.719 172.573 290.036 184.907 291.838 181.302 C 293.08 178.819 286.464 191.016 287.706 188.533 C 288.261 187.423 289.217 186.545 289.772 185.434 C 290.758 183.462 284.081 192.158 285.64 190.599'
            />
            <path
              className='qi-path p11'
              d='M 337.293 126.55 C 337.955 128.537 338.326 134.843 338.326 132.748 C 338.326 130.338 338.326 128.272 338.326 130.682 C 338.326 133.781 338.326 143.079 338.326 139.98 C 338.326 138.258 338.326 136.536 338.326 134.814 C 338.326 130.338 338.326 152.721 338.326 148.244 C 338.326 146.178 338.326 144.112 338.326 142.046 C 338.326 137.899 335.981 158.376 337.293 154.442 C 338.282 151.476 338.282 148.376 337.293 151.343 C 336.421 153.957 337.293 162.362 337.293 159.608 C 337.293 149.507 337.293 170.742 337.293 160.641 C 337.293 158.23 337.293 170.283 337.293 167.872 C 337.293 157.786 337.293 176.173 337.293 168.905 C 337.293 167.183 337.293 175.792 337.293 174.07 C 337.293 171.316 334.538 182.335 337.293 182.335 C 339.387 182.335 341.396 181.302 343.491 181.302 C 348.247 181.302 349.867 180.269 349.689 180.269 C 347.933 180.269 356.425 178.45 354.855 179.236 C 350.021 181.652 360.613 179.236 355.888 179.236 C 354.51 179.236 360.02 179.236 360.02 179.236 C 360.02 179.236 364.152 178.203 364.152 178.203'
            />
            <path
              className='qi-path p12'
              d='M 374.483 154.442 C 376.728 156.687 376.549 166.915 376.549 163.74 C 376.549 162.362 376.549 169.249 376.549 167.872 C 376.549 167.235 376.549 173.551 376.549 170.971 C 376.549 169.249 376.549 177.858 376.549 176.136 C 376.549 175.103 376.549 180.269 376.549 179.236 C 376.549 178.203 376.549 176.136 376.549 176.136'
            />
            <path
              className='qi-path p13'
              d='M 369.317 136.88 C 374.564 136.88 377.582 139.98 377.582 139.98'
            />
            <path
              className='qi-path p14'
              d='M 393.078 149.277 C 394.622 150.821 394.111 155.47 394.111 152.376 C 394.111 149.621 394.111 163.395 394.111 160.641 C 394.111 159.263 394.111 157.886 394.111 156.508 C 394.111 153.409 394.111 168.905 394.111 165.806 C 394.111 164.429 394.111 163.051 394.111 161.674 C 394.111 158.575 394.111 174.07 394.111 170.971 C 394.111 169.594 394.111 168.216 394.111 166.839 C 394.111 164.429 394.111 176.481 394.111 174.07 C 394.111 173.508 396.177 177.17 396.177 177.17 C 396.177 177.17 400.309 173.563 400.309 175.103 C 400.309 175.345 404.441 168.202 404.441 168.905 C 404.441 170.445 407.596 163.684 406.507 164.773 C 404.344 166.937 407.54 162.228 407.54 164.773 C 407.54 166.951 411.147 157.035 409.607 158.575 C 408.125 160.056 410.64 152.376 410.64 152.376 C 410.64 152.376 410.64 145.488 410.64 148.244 C 410.64 156.433 405.033 175.103 417.871 175.103'
            />
          </svg>
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
