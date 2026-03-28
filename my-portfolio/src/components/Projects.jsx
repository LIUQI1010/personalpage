import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageStack } from './ui/image-stack';
import { projects } from '../data/projects';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const Projects = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const projectContainerRef = useRef(null);
  const decorationRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const navigate = useNavigate();
  const navRef = useRef(null);
  const buttonRefs = useRef([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const project = projects[activeProjectIndex];

  // 计算选中横线位置
  useEffect(() => {
    const btn = buttonRefs.current[activeProjectIndex];
    const nav = navRef.current;
    if (btn && nav) {
      const navRect = nav.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setUnderline({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [activeProjectIndex]);

  // 处理图片点击 - 打开模态框
  const handleImageClick = (image, index, event) => {
    event.stopPropagation();
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
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
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
            delay: 0.4,
          }
        );
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

        const spinTween = gsap.to(shapes, {
          rotation: '+=360',
          duration: 25,
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
      className='min-h-screen text-white pt-20 pb-20 px-4 md:px-8 relative overflow-hidden'
    >
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

        {/* 项目选择器 — 星座导航 */}
        <div ref={navRef} className='relative flex items-center justify-center mb-12'>
          {projects.map((p, index) => (
            <div key={p.id} className='flex items-center'>
              {index > 0 && <div className='w-8 h-px bg-white/15 mx-1' />}
              <button
                ref={(el) => (buttonRefs.current[index] = el)}
                onClick={() => setActiveProjectIndex(index)}
                className={`flex items-center gap-2 px-3 pt-1.5 pb-3 text-sm font-medium transition-colors duration-300 ${
                  index === activeProjectIndex ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                    index === activeProjectIndex
                      ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.9)]'
                      : 'bg-gray-500'
                  }`}
                />
                {p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title}
                {p.badge && (
                  <span className='px-1.5 py-0.5 text-[9px] font-bold tracking-wide uppercase text-amber-400/70 border border-amber-500/20 rounded-sm'>
                    {p.badge}
                  </span>
                )}
              </button>
            </div>
          ))}
          {/* 滑动横线 */}
          <span
            className='absolute bottom-0 h-[2px] bg-purple-400 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]'
            style={{ left: underline.left, width: underline.width }}
          />
        </div>

        {/* 项目卡片展示 */}
        <div ref={projectContainerRef} className='max-w-4xl mx-auto'>
          <div className='rounded-xl border border-white/10 overflow-hidden hover:border-purple-500/20 transition-all duration-500 bg-white/[0.03]'>
            {/* 项目标题和描述 */}
            <div className='p-8 md:p-10'>
              <div className='flex items-baseline gap-3 mb-4 flex-wrap'>
                <h2 className='text-2xl md:text-3xl font-bold text-white'>{project.title}</h2>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sm text-blue-400 underline underline-offset-2 decoration-blue-400/40 hover:text-blue-300 hover:decoration-blue-300 transition-colors duration-200'
                  >
                    {project.liveUrl.replace(/^https?:\/\//, '')} &#8599;
                  </a>
                )}
              </div>
              <p className='text-lg text-gray-300 mb-6 leading-relaxed'>{project.description}</p>
              <div className='flex flex-wrap gap-2 mb-8'>
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className='flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-sm border border-white/10 hover:border-purple-500/40 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-default'
                  >
                    <span className='w-1 h-1 rounded-full bg-purple-400 opacity-60 flex-shrink-0' />
                    {tech}
                  </span>
                ))}
              </div>
              {project.detailPage && (
                <button
                  onClick={() => navigate(project.detailPage)}
                  className='inline-flex items-center gap-2 px-4 py-2 text-sm text-purple-400 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 rounded-sm transition-all duration-300'
                >
                  View Project Details
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                  </svg>
                </button>
              )}
            </div>

            {/* 图片展示区域 */}
            {project.images && project.images.length > 0 && (
              <div className='px-8 md:px-10 pb-8 md:pb-10'>
                <ImageStack
                  images={project.images}
                  onImageClick={handleImageClick}
                  containerSize={{ width: 400, height: 240 }}
                  className='w-full'
                />
              </div>
            )}
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
                src={selectedImage.src}
                alt={selectedImage.alt || selectedImage.title}
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
