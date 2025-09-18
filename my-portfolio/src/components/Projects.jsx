import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState } from 'react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const Projects = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const projectContainerRef = useRef(null);
  const decorationRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 项目数据
  const project = {
    title: 'Serverless Assignment Management Platform',
    description:
      'Developed a full-stack assignment management platform using AWS serverless architecture. Features include secure file upload/download, assignment submission tracking, and instructor feedback system. Implemented scalable backend with Lambda functions, DynamoDB for data persistence, and S3 for file storage, demonstrating modern cloud-native development practices.',
    technologies: ['AWS Lambda', 'DynamoDB', 'S3', 'API Gateway', 'React', 'Python', 'Serverless'],
    images: [
      {
        id: 'architecture',
        title: 'System Architecture',
        placeholder: 'https://via.placeholder.com/300x200/1f2937/60a5fa?text=Architecture+Diagram',
      },
      {
        id: 'login',
        title: 'Login Interface',
        placeholder: 'https://via.placeholder.com/300x200/1f2937/10b981?text=Login+Page',
      },
      {
        id: 'dashboard',
        title: 'Main Dashboard',
        placeholder: 'https://via.placeholder.com/300x200/1f2937/f59e0b?text=Dashboard',
      },
      {
        id: 'submit',
        title: 'Assignment Submission',
        placeholder: 'https://via.placeholder.com/300x200/1f2937/ef4444?text=Submit+Assignment',
      },
      {
        id: 'grading',
        title: 'Automated Grading',
        placeholder: 'https://via.placeholder.com/300x200/1f2937/8b5cf6?text=Grading+System',
      },
    ],
  };

  // 检测是否为移动设备
  const isMobile = () => window.innerWidth < 768;

  // 图片展开时的布局与层级（与设计顺序一一对应）
  const expandedLayout = [
    { x: 0, y: -20, scale: 1.1, rotation: 0, zIndex: 55 }, // 中心主图
    { x: -180, y: -80, scale: 0.9, rotation: -8, zIndex: 54 }, // 左上
    { x: 180, y: -80, scale: 0.9, rotation: 8, zIndex: 53 }, // 右上
    { x: -180, y: 40, scale: 0.9, rotation: -5, zIndex: 52 }, // 左下
    { x: 180, y: 40, scale: 0.9, rotation: 5, zIndex: 51 }, // 右下
  ];

  // 容器hover - 控制展开/收缩
  const handleContainerEnter = () => {
    if (!isMobile() && !isAnimating) {
      setIsContainerHovered(true);
      setIsAnimating(true);
      animateImagesExpand();
    }
  };

  const handleContainerLeave = () => {
    if (!isMobile() && !isAnimating) {
      setIsContainerHovered(false);
      setIsAnimating(true);
      animateImagesCollapse();
    }
  };

  // 单张图片hover - 简单的浮到最顶层
  const handleImageHover = index => {
    if (!isMobile() && isContainerHovered && !isAnimating) {
      const images = projectContainerRef.current?.querySelectorAll('.project-image');
      if (!images) return;

      gsap.to(images[index], {
        zIndex: 100,
        scale: index === 0 ? 1.3 : 1.1,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true,
      });
    }
  };

  const handleImageLeave = index => {
    if (!isMobile() && isContainerHovered && !isAnimating) {
      const images = projectContainerRef.current?.querySelectorAll('.project-image');
      if (!images) return;

      gsap.to(images[index], {
        scale: expandedLayout[index].scale,
        zIndex: expandedLayout[index].zIndex,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true,
      });
    }
  };

  // 移动端点击切换
  const handleMobileToggle = () => {
    if (isMobile()) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        animateImagesExpand();
      } else {
        animateImagesCollapse();
      }
    }
  };

  // 图片展开动画
  const animateImagesExpand = () => {
    const container = projectContainerRef.current?.querySelector('.images-container');
    const images = projectContainerRef.current?.querySelectorAll('.project-image');
    if (!images || !container) return;

    // 设置容器为相对定位，图片脱离文档流
    gsap.set(container, {
      position: 'relative',
      zIndex: 50,
    });

    // 图片向上展开，脱离文档流
    images.forEach((image, index) => {
      gsap.set(image, {
        position: 'absolute',
        zIndex: expandedLayout[index].zIndex,
      });

      gsap.to(image, {
        x: expandedLayout[index].x,
        y: expandedLayout[index].y,
        scale: expandedLayout[index].scale,
        rotation: expandedLayout[index].rotation,
        duration: 0.35,
        delay: index * 0.05,
        ease: 'power3.out',
        overwrite: true,
        onComplete: index === images.length - 1 ? () => setIsAnimating(false) : undefined,
      });
    });
  };

  // 图片收缩动画
  const animateImagesCollapse = () => {
    const container = projectContainerRef.current?.querySelector('.images-container');
    const images = projectContainerRef.current?.querySelectorAll('.project-image');
    if (!images || !container) return;

    // 图片收缩回叠放状态
    images.forEach((image, index) => {
      gsap.to(image, {
        x: index * -3,
        y: index * -3,
        scale: 1 - index * 0.05,
        rotation: (index - 2) * 2,
        zIndex: images.length - index,
        duration: 0.4,
        delay: (images.length - index - 1) * 0.03,
        ease: 'power3.inOut',
        overwrite: true,
        onComplete: index === 0 ? () => setIsAnimating(false) : undefined,
      });
    });

    // 重置容器z-index
    gsap.set(container, {
      zIndex: 'auto',
      delay: 0.5,
    });
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

      // 3. 项目容器动画
      if (projectContainerRef.current) {
        gsap.fromTo(
          projectContainerRef.current,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: projectContainerRef.current,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
            delay: 0.4,
          }
        );
      }

      // 4. 图片初始状态设置
      const images = projectContainerRef.current?.querySelectorAll('.project-image');
      const container = projectContainerRef.current?.querySelector('.images-container');

      if (images && container) {
        // 设置容器初始状态
        gsap.set(container, {
          width: '400px',
          height: '240px',
          overflow: 'visible',
          position: 'relative',
        });

        // 设置图片初始叠放状态
        images.forEach((image, index) => {
          gsap.set(image, {
            position: 'absolute',
            x: index * -3,
            y: index * -3,
            scale: 1 - index * 0.05,
            rotation: (index - 2) * 2,
            zIndex: images.length - index,
            transformOrigin: 'center center',
          });
        });
      }

      // 6. 装饰元素动画
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
          duration: 25,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          force3D: true,
        });
      }

      // 7. 整体容器初始动画
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
        <div className='decoration-shape absolute top-20 left-10 w-20 h-20 border border-purple-500/20 rounded-full'></div>
        <div className='decoration-shape absolute top-40 right-20 w-16 h-16 border border-blue-500/20'></div>
        <div className='decoration-shape absolute bottom-40 left-20 w-12 h-12 border border-green-500/20 rounded-full'></div>
        <div className='decoration-shape absolute bottom-20 right-10 w-24 h-24 border border-pink-500/20'></div>
      </div>

      <div className='max-w-6xl mx-auto'>
        {/* 标题部分 */}
        <div className='text-center mb-16'>
          <h1
            ref={titleRef}
            className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'
          >
            Projects
          </h1>
          <p ref={subtitleRef} className='text-xl md:text-2xl text-gray-300 font-light'>
            Showcasing Modern Web Development & Cloud Architecture
          </p>
        </div>

        {/* 项目卡片展示 */}
        <div ref={projectContainerRef} className='max-w-4xl mx-auto'>
          <div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10'>
            {/* 项目标题和描述 */}
            <div className='p-8 md:p-10'>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-4'>{project.title}</h2>
              <p className='text-lg text-gray-300 mb-6 leading-relaxed'>{project.description}</p>
              <div className='flex flex-wrap gap-3 mb-8'>
                {project.technologies.map((tech, index) => (
                  <span
                    key={tech}
                    className='px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm border border-purple-500/30 hover:border-purple-400 hover:scale-105 transition-all duration-300 cursor-default'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 图片展示区域 */}
            <div className='px-8 md:px-10 pb-8 md:pb-10'>
              <div className='flex justify-center'>
                <div
                  className='images-container relative mx-auto'
                  onMouseEnter={handleContainerEnter}
                  onMouseLeave={handleContainerLeave}
                  onClick={handleMobileToggle}
                  style={{ cursor: 'pointer' }}
                >
                  {project.images.map((image, index) => (
                    <div
                      key={image.id}
                      className='project-image w-full h-full overflow-hidden rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300'
                      onMouseEnter={() => handleImageHover(index)}
                      onMouseLeave={() => handleImageLeave(index)}
                    >
                      <div className='w-full h-full bg-gray-800 relative group'>
                        <img
                          src={image.placeholder}
                          alt={image.title}
                          className='w-full h-full object-cover'
                          draggable={false}
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <div className='absolute bottom-4 left-4 right-4'>
                            <h3 className='text-white font-semibold text-lg mb-1'>{image.title}</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
