import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const Projects = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const projectContainerRef = useRef(null);
  const decorationRef = useRef(null);
  const [isContainerHovered, setIsContainerHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 项目数据
  const project = {
    title: 'Serverless Assignment Management Platform',
    description:
      'Developed a full-stack assignment management platform using AWS serverless architecture. Features include secure file upload/download, assignment submission tracking, and instructor feedback system. Implemented scalable backend with Lambda functions, DynamoDB for data persistence, and S3 for file storage, demonstrating modern cloud-native development practices.',
    technologies: ['AWS Lambda', 'DynamoDB', 'S3', 'API Gateway', 'React', 'Python', 'Serverless'],
    images: [
      {
        id: 'architecture',
        title: 'AWS Cloud Foundation',
        placeholder: '/img/cloud foundation.png',
      },
      {
        id: 'login',
        title: 'Login Interface',
        placeholder: '/img/siwei/login.png',
      },
      {
        id: 'dashboard',
        title: 'Main Dashboard',
        placeholder: '/img/siwei/main.png',
      },
      {
        id: 'submit',
        title: 'Assignment Submission',
        placeholder: '/img/siwei/submission.png',
      },
      {
        id: 'grading',
        title: 'Automated Grading',
        placeholder: '/img/siwei/grading.png',
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

  // 点击图片打开模态框
  const handleImageClick = (image, event) => {
    event.stopPropagation(); // 阻止事件冒泡到容器
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedImage(null), 300); // 延迟重置，等待动画完成
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

      // 4. 桌面端图片初始状态设置
      const images = projectContainerRef.current?.querySelectorAll(
        '.images-container .project-image'
      );
      const container = projectContainerRef.current?.querySelector('.images-container');

      if (images && container && !isMobile()) {
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

  // 键盘事件监听 - ESC关闭模态框
  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // 阻止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

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

        {/* 三角形装饰 */}
        <div
          className='decoration-shape triangle-decoration triangle-left absolute top-28 left-40 text-pink-400/20'
          style={{ '--triangle-size': '14px', '--triangle-color': 'currentColor' }}
        ></div>
        <div
          className='decoration-shape triangle-decoration triangle-up absolute top-52 right-36 text-purple-400/20'
          style={{ '--triangle-size': '16px', '--triangle-color': 'currentColor' }}
        ></div>
        <div
          className='decoration-shape triangle-decoration triangle-down absolute bottom-52 left-36 text-blue-400/20'
          style={{ '--triangle-size': '13px', '--triangle-color': 'currentColor' }}
        ></div>
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
              {/* 桌面端 - 叠放展开效果 */}
              <div className='hidden md:flex justify-center'>
                <div
                  className='images-container relative mx-auto'
                  onMouseEnter={handleContainerEnter}
                  onMouseLeave={handleContainerLeave}
                  style={{ cursor: 'pointer' }}
                >
                  {project.images.map((image, index) => (
                    <div
                      key={image.id}
                      className='project-image w-full h-full overflow-hidden rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300'
                      onMouseEnter={() => handleImageHover(index)}
                      onMouseLeave={() => handleImageLeave(index)}
                      onClick={e => handleImageClick(image, e)}
                    >
                      <div className='w-full h-full bg-gray-800 relative group cursor-pointer'>
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

              {/* 移动端 - 横向滚动显示 */}
              <div className='md:hidden'>
                <div
                  className='overflow-x-auto overflow-y-hidden'
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className='flex gap-4 pb-4' style={{ width: 'max-content' }}>
                    {project.images.map((image, index) => (
                      <div
                        key={image.id}
                        className='flex-shrink-0 w-72 h-48 overflow-hidden rounded-xl border border-gray-600 hover:border-purple-500/50 transition-all duration-300'
                        onClick={e => handleImageClick(image, e)}
                      >
                        <div className='w-full h-full bg-gray-800 relative group cursor-pointer'>
                          <img
                            src={image.placeholder}
                            alt={image.title}
                            className='w-full h-full object-cover'
                            draggable={false}
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <div className='absolute bottom-4 left-4 right-4'>
                              <h3 className='text-white font-semibold text-sm mb-1'>
                                {image.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 移动端滚动提示 */}
                <div className='flex items-center justify-center gap-3 mt-4 text-gray-400 text-sm'>
                  <span className='animate-arrow-blink'>←</span>
                  <span>Swipe to explore more images</span>
                  <span className='animate-arrow-blink'>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 图片预览模态框 */}
      {isModalOpen && selectedImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity duration-300 ${
            isModalOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleCloseModal}
        >
          <div className='relative max-w-4xl max-h-[90vh] mx-4'>
            {/* 关闭按钮 */}
            <button
              onClick={handleCloseModal}
              className='absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10'
            >
              <div className='bg-black/50 backdrop-blur-sm rounded-full p-3 hover:bg-black/70 transition-all duration-200'>
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </div>
            </button>

            {/* 图片容器 */}
            <div
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 ${
                isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.placeholder}
                alt={selectedImage.title}
                className='w-full h-auto max-h-[80vh] object-contain'
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
