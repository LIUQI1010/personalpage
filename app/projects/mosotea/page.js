'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  ShieldCheck,
  LayoutDashboard,
  Languages,
  Mail,
  Gauge,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Calendar,
    title: 'Online Booking System',
    desc: 'Real-time availability, race condition prevention via PostgreSQL triggers, smart time slot filtering',
    color: 'from-emerald-400 to-teal-400',
    border: 'border-emerald-500/30 hover:border-emerald-500/60',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    icon: ShieldCheck,
    title: 'Self-Service Cancellation',
    desc: 'HMAC-SHA256 signed tokens, 24-hour business rule enforcement, automatic capacity release',
    color: 'from-amber-400 to-orange-400',
    border: 'border-amber-500/30 hover:border-amber-500/60',
    bg: 'rgba(245, 158, 11, 0.08)',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Dashboard',
    desc: 'Booking management, time slot controls, operational metrics, direct booking creation',
    color: 'from-purple-400 to-violet-400',
    border: 'border-purple-500/30 hover:border-purple-500/60',
    bg: 'rgba(139, 92, 246, 0.08)',
  },
  {
    icon: Languages,
    title: 'Bilingual Support',
    desc: 'Full English / Traditional Chinese with locale-based routing via next-intl',
    color: 'from-cyan-400 to-blue-400',
    border: 'border-cyan-500/30 hover:border-cyan-500/60',
    bg: 'rgba(6, 182, 212, 0.08)',
  },
  {
    icon: Mail,
    title: 'Automated Emails',
    desc: '5 email types triggered by booking and cancellation events, bilingual templates',
    color: 'from-pink-400 to-rose-400',
    border: 'border-pink-500/30 hover:border-pink-500/60',
    bg: 'rgba(236, 72, 153, 0.08)',
  },
  {
    icon: Gauge,
    title: 'Performance',
    desc: 'Lighthouse 90+ across Performance, Accessibility, Best Practices, and SEO',
    color: 'from-green-400 to-emerald-400',
    border: 'border-green-500/30 hover:border-green-500/60',
    bg: 'rgba(34, 197, 94, 0.08)',
  },
];

const techStack = [
  'Next.js 16',
  'TypeScript',
  'Tailwind CSS',
  'Supabase (PostgreSQL)',
  'Vercel',
  'Cloudflare',
  'Resend',
  'Claude Code',
];

const outcomes = [
  { label: 'Live at', value: 'mosotea.co.nz', link: 'https://mosotea.co.nz' },
  { label: 'Delivery', value: '~1 week from requirements to production' },
  { label: 'UAT', value: 'Full client sign-off completed' },
  { label: 'Lighthouse', value: '90+ across all categories' },
];

export default function MosoTea() {
  const router = useRouter();
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const roleRef = useRef(null);
  const featuresRef = useRef(null);
  const techRef = useRef(null);
  const screenshotsRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(heroRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
      }

      if (storyRef.current) {
        gsap.fromTo(storyRef.current, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: storyRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      }

      if (roleRef.current) {
        gsap.fromTo(roleRef.current, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: roleRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      }

      const cards = featuresRef.current?.querySelectorAll('.feature-card');
      cards?.forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 40, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top 95%', toggleActions: 'play none none reverse' },
        });
      });

      if (techRef.current) {
        gsap.fromTo(techRef.current, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: techRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      }

      if (screenshotsRef.current) {
        gsap.fromTo(screenshotsRef.current, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: screenshotsRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      }

      if (resultsRef.current) {
        gsap.fromTo(resultsRef.current, { opacity: 0, y: 50 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: resultsRef.current, start: 'top 90%', toggleActions: 'play none none reverse' },
        });
      }
    }, pageRef.current);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={pageRef} className='min-h-screen bg-[oklch(0.18_0_0)] text-white'>
      {/* Back navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-[oklch(0.18_0_0)]/80 backdrop-blur-md border-b border-white/5'>
        <div className='max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center'>
          <button
            onClick={() => router.push('/')}
            className='inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors'
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className='pt-32 pb-16 px-4 md:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center gap-3 mb-4'>
            <span className='px-3 py-1 text-xs font-bold tracking-wide uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full'>
              Paid Freelance
            </span>
            <span className='text-sm text-gray-500'>Mar 2026</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold mb-4'>
            <span className='bg-gradient-to-r from-emerald-300 via-green-200 to-amber-200 bg-clip-text text-transparent'>
              Moso Tea
            </span>
            <span className='text-gray-400 text-2xl md:text-3xl font-light ml-4'>Commercial Website</span>
          </h1>
          <p className='text-xl text-gray-400 mb-8 max-w-2xl'>
            A full-stack commercial website for a New Zealand artisan tea experience studio, delivered end-to-end in ~1 week.
          </p>
          <a
            href='https://mosotea.co.nz'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300'
          >
            Visit Live Site
            <ExternalLink size={16} />
          </a>

          <div className='mt-12 rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-emerald-900/20 to-gray-900/40'>
            <div className='aspect-video flex items-center justify-center'>
              <img
                src='/img/mosotea/hero-placeholder.svg'
                alt='Moso Tea Website Hero Screenshot'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-4 md:px-8'>
        <div className='h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent' />
      </div>

      {/* Project Story */}
      <section ref={storyRef} className='py-20 px-4 md:px-8'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent'>
            The Story
          </h2>
          <div className='space-y-6 text-lg text-gray-300 leading-relaxed'>
            <p>
              I visited Moso Tea as a customer and was immediately drawn to the warmth of the tea ceremony experience. But I noticed something — they had no online presence at all. No website, no booking system, no way for new customers to discover them online.
            </p>
            <p>
              I reached out to the owner and proposed building a complete website for them. What started as a conversation over tea became a <span className='text-amber-400 font-medium'>paid freelance engagement</span> — the only one in my portfolio. This wasn't a side project or a learning exercise; it was a real business deliverable with real client expectations.
            </p>
            <p>
              Working in a 2-person Agile team, we delivered the entire project in approximately one week — from initial requirements gathering and client sign-off through to production deployment and user acceptance testing. I handled everything beyond the code independently: UI/UX design, photography, and all written content.
            </p>
          </div>
        </div>
      </section>

      {/* My Role */}
      <section ref={roleRef} className='py-20 px-4 md:px-8'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent'>
            My Role
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-gray-800/40 rounded-xl p-6 border border-white/5'>
              <h3 className='text-sm font-semibold tracking-widest uppercase text-emerald-400 mb-3'>Sole Owner</h3>
              <ul className='space-y-2 text-gray-300'>
                <li className='flex items-start gap-2'><span className='text-emerald-400 mt-1'>&#9679;</span>UI/UX Design</li>
                <li className='flex items-start gap-2'><span className='text-emerald-400 mt-1'>&#9679;</span>Photography</li>
                <li className='flex items-start gap-2'><span className='text-emerald-400 mt-1'>&#9679;</span>Content Writing</li>
                <li className='flex items-start gap-2'><span className='text-emerald-400 mt-1'>&#9679;</span>Deployment & DevOps</li>
              </ul>
            </div>
            <div className='bg-gray-800/40 rounded-xl p-6 border border-white/5'>
              <h3 className='text-sm font-semibold tracking-widest uppercase text-amber-400 mb-3'>Collaborative (2-person team)</h3>
              <ul className='space-y-2 text-gray-300'>
                <li className='flex items-start gap-2'><span className='text-amber-400 mt-1'>&#9679;</span>Full-Stack Development</li>
                <li className='flex items-start gap-2'><span className='text-amber-400 mt-1'>&#9679;</span>Frontend (Next.js, Tailwind)</li>
                <li className='flex items-start gap-2'><span className='text-amber-400 mt-1'>&#9679;</span>Backend (Supabase, APIs)</li>
                <li className='flex items-start gap-2'><span className='text-amber-400 mt-1'>&#9679;</span>Agile Sprint Planning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section ref={featuresRef} className='py-20 px-4 md:px-8'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent'>
            Key Features
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map(f => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className={`feature-card rounded-xl p-6 border ${f.border} transition-all duration-300`}
                  style={{ backgroundColor: f.bg }}
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${f.color} mb-4`}>
                    <Icon size={20} className='text-white' />
                  </div>
                  <h3 className='text-lg font-semibold text-white mb-2'>{f.title}</h3>
                  <p className='text-sm text-gray-400 leading-relaxed'>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section ref={techRef} className='py-20 px-4 md:px-8'>
        <div className='max-w-3xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent'>
            Tech Stack
          </h2>
          <div className='flex flex-wrap justify-center gap-3'>
            {techStack.map(tech => (
              <span
                key={tech}
                className='px-5 py-2.5 bg-gradient-to-r from-emerald-500/15 to-green-500/15 rounded-full text-sm border border-emerald-500/25 text-gray-200 hover:border-emerald-400 hover:scale-105 transition-all duration-300 cursor-default'
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section ref={screenshotsRef} className='py-20 px-4 md:px-8'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent'>
            Screenshots
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className='aspect-video rounded-xl overflow-hidden border border-white/10 bg-gray-800/40 flex items-center justify-center'
              >
                <img
                  src={`/img/mosotea/screenshot-${i}-placeholder.svg`}
                  alt={`Moso Tea Screenshot ${i}`}
                  className='w-full h-full object-cover'
                />
              </div>
            ))}
          </div>
          <div className='flex justify-center gap-6 flex-wrap'>
            {[1, 2].map(i => (
              <div
                key={i}
                className='w-48 aspect-[9/16] rounded-xl overflow-hidden border border-white/10 bg-gray-800/40 flex items-center justify-center'
              >
                <img
                  src={`/img/mosotea/mobile-${i}-placeholder.svg`}
                  alt={`Moso Tea Mobile Screenshot ${i}`}
                  className='w-full h-full object-cover'
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section ref={resultsRef} className='py-20 px-4 md:px-8'>
        <div className='max-w-3xl mx-auto'>
          <h2 className='text-3xl md:text-4xl font-bold mb-12 text-center bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent'>
            Results
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {outcomes.map(o => (
              <div key={o.label} className='bg-gray-800/40 rounded-xl p-6 border border-white/5'>
                <div className='text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-2'>{o.label}</div>
                {o.link ? (
                  <a href={o.link} target='_blank' rel='noopener noreferrer' className='text-lg text-white hover:text-emerald-300 transition-colors'>
                    {o.value} <ExternalLink size={14} className='inline ml-1' />
                  </a>
                ) : (
                  <div className='text-lg text-white'>{o.value}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className='py-16 px-4 md:px-8'>
        <div className='max-w-3xl mx-auto text-center'>
          <div className='h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mb-16' />
          <a
            href='https://mosotea.co.nz'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300'
          >
            Visit mosotea.co.nz
            <ExternalLink size={16} />
          </a>
          <div className='mt-8'>
            <button
              onClick={() => router.push('/')}
              className='text-sm text-gray-500 hover:text-gray-300 transition-colors'
            >
              &larr; Back to Portfolio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
