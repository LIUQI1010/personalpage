'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

// Brand icons removed from lucide-react v1+
const Github = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' className={className}>
    <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
  </svg>
);

const Linkedin = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox='0 0 24 24' fill='currentColor' className={className}>
    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
  </svg>
);
import VisitorStats from '@/components/VisitorStats';

const Contact = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const statusRef = useRef(null);
  const contactGridRef = useRef(null);
  const decorationRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
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

      // 3. 状态标签动画
      if (statusRef.current) {
        gsap.fromTo(
          statusRef.current,
          {
            opacity: 0,
            scale: 0.8,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: statusRef.current,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
            delay: 0.4,
          }
        );
      }

      // 4. 联系方式网格动画
      if (contactGridRef.current) {
        const cards = contactGridRef.current.querySelectorAll('.contact-card');
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 40,
              scale: 0.9,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play reverse play reverse',
              },
              delay: index * 0.1 + 0.6,
            }
          );
        });
      }

      // 5. 装饰元素动画
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
          duration: 30,
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

      // 6. 整体容器初始动画
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
            className='text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-rose-300 to-amber-200 bg-clip-text text-transparent leading-tight pb-2'
          >
            Contact
          </h1>
          <p ref={subtitleRef} className='text-xl md:text-2xl text-gray-300 font-light mb-6'>
            Let's connect and explore opportunities together
          </p>

          {/* 状态标签 */}
          <div ref={statusRef} className='flex justify-center flex-wrap gap-3'>
          </div>
        </div>

        {/* 联系方式 - 专业布局 */}
        <div ref={contactGridRef} className='max-w-4xl mx-auto'>
          {/* 主要联系方式 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            {/* 邮箱 - 主要联系方式 */}
            <div className='contact-card'>
              <a
                href='mailto:qiliu.codes@gmail.com'
                className='block bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-2xl border border-gray-700/30 p-6 transition-all duration-300 hover:border-slate-400/50 hover:shadow-xl group'
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-slate-400/10 rounded-xl flex items-center justify-center group-hover:bg-slate-400/20 transition-colors duration-300'>
                    <Mail size={24} className='text-slate-400' />
                  </div>
                  <div className='flex items-center space-x-3'>
                    <h3 className='text-xl font-semibold text-white'>Email:</h3>
                    <p className='text-gray-300 group-hover:text-white transition-colors duration-300'>
                      qiliu.codes@gmail.com
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* 电话 */}
            <div className='contact-card'>
              <a
                href='tel:+64274892131'
                className='block bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-2xl border border-gray-700/30 p-6 transition-all duration-300 hover:border-stone-400/50 hover:shadow-xl group'
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-stone-400/10 rounded-xl flex items-center justify-center group-hover:bg-stone-400/20 transition-colors duration-300'>
                    <Phone size={24} className='text-stone-400' />
                  </div>
                  <div className='flex items-center space-x-3'>
                    <h3 className='text-xl font-semibold text-white'>Phone:</h3>
                    <p className='text-gray-300 group-hover:text-white transition-colors duration-300'>
                      +64 27 489 2131
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* 社交媒体、位置和访问统计 */}
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3'>
            {/* LinkedIn */}
            <div className='contact-card'>
              <a
                href='https://linkedin.com/in/qi-liu-b501b8319'
                target='_blank'
                rel='noopener noreferrer'
                className='block bg-gradient-to-br from-gray-800/10 to-gray-900/10 rounded-xl border border-gray-700/20 p-6 transition-all duration-300 hover:border-blue-300/50 hover:shadow-lg group text-center'
              >
                <div className='w-10 h-10 bg-blue-300/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-300/20 transition-colors duration-300'>
                  <Linkedin size={20} className='text-blue-300' />
                </div>
                <h4 className='text-sm font-medium text-white mb-1'>LinkedIn</h4>
                <p className='text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300'>
                  Professional profile
                </p>
              </a>
            </div>

            {/* GitHub */}
            <div className='contact-card'>
              <a
                href='https://github.com/LIUQI1010'
                target='_blank'
                rel='noopener noreferrer'
                className='block bg-gradient-to-br from-gray-800/10 to-gray-900/10 rounded-xl border border-gray-700/20 p-6 transition-all duration-300 hover:border-violet-300/50 hover:shadow-lg group text-center'
              >
                <div className='w-10 h-10 bg-violet-300/10 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-300/20 transition-colors duration-300'>
                  <Github size={20} className='text-violet-300' />
                </div>
                <h4 className='text-sm font-medium text-white mb-1'>GitHub</h4>
                <p className='text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-300'>
                  Code portfolio
                </p>
              </a>
            </div>

            {/* Location */}
            <div className='contact-card'>
              <div className='bg-gradient-to-br from-gray-800/10 to-gray-900/10 rounded-xl border border-gray-700/20 p-6 text-center'>
                <div className='w-10 h-10 bg-rose-300/10 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <MapPin size={20} className='text-rose-300' />
                </div>
                <h4 className='text-sm font-medium text-white mb-1'>Open to relocation</h4>
                <p className='text-xs text-gray-400'>Wellington, NZ</p>
              </div>
            </div>

            {/* Visitor Stats */}
            <VisitorStats />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
