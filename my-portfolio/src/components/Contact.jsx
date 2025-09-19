import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

const Contact = ({ id }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const statusRef = useRef(null);
  const contactGridRef = useRef(null);
  const decorationRef = useRef(null);

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

        gsap.to(shapes, {
          rotation: '+=360',
          duration: 30,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
          force3D: true,
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
        <div className='decoration-shape absolute top-20 left-10 w-20 h-20 border border-amber-200/20 rounded-full'></div>
        <div className='decoration-shape absolute top-40 right-20 w-16 h-16 border border-slate-300/20'></div>
        <div className='decoration-shape absolute bottom-40 left-20 w-12 h-12 border border-stone-300/20 rounded-full'></div>
        <div className='decoration-shape absolute bottom-20 right-10 w-24 h-24 border border-rose-200/20'></div>

        {/* 三角形装饰 */}
        <div
          className='decoration-shape triangle-decoration triangle-down absolute top-32 left-32 text-amber-300/20'
          style={{ '--triangle-size': '15px', '--triangle-color': 'currentColor' }}
        ></div>
        <div
          className='decoration-shape triangle-decoration triangle-left absolute top-48 right-36 text-slate-400/20'
          style={{ '--triangle-size': '12px', '--triangle-color': 'currentColor' }}
        ></div>
        <div
          className='decoration-shape triangle-decoration triangle-up absolute bottom-48 left-40 text-rose-300/20'
          style={{ '--triangle-size': '18px', '--triangle-color': 'currentColor' }}
        ></div>
      </div>

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
            <div className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-200/20 to-teal-200/20 rounded-full border border-emerald-200/30'>
              <div className='w-2 h-2 bg-emerald-300 rounded-full mr-2 animate-pulse'></div>
              <span className='text-emerald-200 font-medium'>Available for internships</span>
            </div>
            <div className='inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-200/20 to-slate-200/20 rounded-full border border-blue-200/30'>
              <div className='w-2 h-2 bg-blue-300 rounded-full mr-2'></div>
              <span className='text-blue-200 font-medium'>Open to relocation</span>
            </div>
          </div>
        </div>

        {/* 联系方式 - 专业布局 */}
        <div ref={contactGridRef} className='max-w-4xl mx-auto'>
          {/* 主要联系方式 */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            {/* 邮箱 - 主要联系方式 */}
            <div className='contact-card'>
              <a
                href='mailto:qiliu.1122@icloud.com'
                className='block bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700/30 p-6 transition-all duration-300 hover:border-slate-400/50 hover:shadow-xl group'
              >
                <div className='flex items-center space-x-4'>
                  <div className='w-12 h-12 bg-slate-400/10 rounded-xl flex items-center justify-center group-hover:bg-slate-400/20 transition-colors duration-300'>
                    <Mail size={24} className='text-slate-400' />
                  </div>
                  <div className='flex items-center space-x-3'>
                    <h3 className='text-xl font-semibold text-white'>Email:</h3>
                    <p className='text-gray-300 group-hover:text-white transition-colors duration-300'>
                      qiliu.1122@icloud.com
                    </p>
                  </div>
                </div>
              </a>
            </div>

            {/* 电话 */}
            <div className='contact-card'>
              <a
                href='tel:+64274892131'
                className='block bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-gray-700/30 p-6 transition-all duration-300 hover:border-stone-400/50 hover:shadow-xl group'
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

          {/* 社交媒体和位置 */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
            {/* LinkedIn */}
            <div className='contact-card'>
              <a
                href='https://linkedin.com/in/qi-liu-b501b8319'
                target='_blank'
                rel='noopener noreferrer'
                className='block bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-xl border border-gray-700/20 p-6 transition-all duration-300 hover:border-blue-300/50 hover:shadow-lg group text-center'
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
                className='block bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-xl border border-gray-700/20 p-6 transition-all duration-300 hover:border-violet-300/50 hover:shadow-lg group text-center'
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
              <div className='bg-gradient-to-br from-gray-800/20 to-gray-900/20 rounded-xl border border-gray-700/20 p-6 text-center'>
                <div className='w-10 h-10 bg-rose-300/10 rounded-lg flex items-center justify-center mx-auto mb-3'>
                  <MapPin size={20} className='text-rose-300' />
                </div>
                <h4 className='text-sm font-medium text-white mb-1'>Location</h4>
                <p className='text-xs text-gray-400'>Wellington, NZ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
