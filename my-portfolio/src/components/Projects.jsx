import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, useState, useEffect } from 'react';
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

  const project = projects[activeProjectIndex];

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

        {/* 项目选择器 */}
        <div className='flex justify-center gap-3 mb-8'>
          {projects.map((p, index) => (
            <button
              key={p.id}
              onClick={() => setActiveProjectIndex(index)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                index === activeProjectIndex
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-purple-500/30 hover:text-white'
              }`}
            >
              {p.title.length > 30 ? p.title.substring(0, 30) + '...' : p.title}
            </button>
          ))}
        </div>

        {/* 项目卡片展示 */}
        <div ref={projectContainerRef} className='max-w-4xl mx-auto'>
          <div className='bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10'>
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
