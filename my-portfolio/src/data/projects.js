export const projects = [
  {
    id: 'mosotea',
    title: 'Moso Tea',
    description:
      'Paid freelance commercial website for a NZ tea studio',
    technologies: ['Next.js', 'TypeScript', 'Supabase'],
    badge: 'Paid Freelance',
    liveUrl: 'https://mosotea.co.nz',
    detailPage: '/projects/mosotea',
    images: [
      {
        id: 'hero',
        title: 'Homepage',
        src: '/img/mosotea/hero-placeholder.svg',
        alt: 'Moso Tea Homepage',
      },
    ],
  },
  {
    id: 'siwei',
    title: 'Serverless Assignment Management Platform',
    description:
      'Developed a full-stack assignment management platform using AWS serverless architecture. Features include secure file upload/download, assignment submission tracking, and instructor feedback system. Implemented scalable backend with Lambda functions, DynamoDB for data persistence, and S3 for file storage, demonstrating modern cloud-native development practices.',
    technologies: ['AWS Lambda', 'DynamoDB', 'S3', 'API Gateway', 'React', 'Python', 'Serverless'],
    images: [
      {
        id: 'architecture',
        title: 'System Architecture',
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyNDAiIGZpbGw9IiMxYTFhMWEiLz48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMmUyZTJlIi8+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iNiIgZmlsbD0iI2ZmNWY1NiIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iMjAiIHI9IjYiIGZpbGw9IiNmZmJkMmUiLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjIwIiByPSI2IiBmaWxsPSIjMjdjOTNmIi8+PHRleHQgeD0iMTAwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNhNGE0YTQiPkFXUyBBcmNoaXRlY3R1cmUgRGlhZ3JhbTwvdGV4dD48cmVjdCB4PSIyMCIgeT0iNjAiIHdpZHRoPSIzNjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjMjYyNjI2IiByeD0iOCIvPjxyZWN0IHg9IjQwIiB5PSI4MCIgd2lkdGg9IjMyMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzMzMzMzMyIgcng9IjQiLz48dGV4dCB4PSIyMDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNsb3VkIEFyY2hpdGVjdHVyZSBTY2hlbWE8L3RleHQ+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTQwIiByPSI0IiBmaWxsPSIjNjY2NjY2Ij48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjAuMzsxOzAuMyIgZHVyPSIxLjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE0MCIgcj0iNCIgZmlsbD0iIzY2NjY2NiI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIwLjM7MTswLjMiIGR1cj0iMS41cyIgYmVnaW49IjAuMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMjIwIiBjeT0iMTQwIiByPSI0IiBmaWxsPSIjNjY2NjY2Ij48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjAuMzsxOzAuMyIgZHVyPSIxLjVzIiBiZWdpbj0iMC40cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz48L2NpcmNsZT48dGV4dCB4PSIyMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM3Nzc3NzciIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbWluZyBTb29uLi4uPC90ZXh0Pjwvc3ZnPg==',
        alt: 'System Architecture Diagram',
      },
      {
        id: 'login',
        title: 'Login Interface',
        src: '/img/siwei/login.png',
        alt: 'Login Interface',
      },
      {
        id: 'dashboard',
        title: 'Main Dashboard',
        src: '/img/siwei/main.png',
        alt: 'Main Dashboard',
      },
      {
        id: 'submit',
        title: 'Assignment Submission',
        src: '/img/siwei/submission.png',
        alt: 'Assignment Submission',
      },
      {
        id: 'grading',
        title: 'Automated Grading',
        src: '/img/siwei/grading.png',
        alt: 'Automated Grading',
      },
    ],
  },
  {
    id: 'portfolio',
    title: 'Personal Portfolio Website',
    description:
      'Designed and built this interactive portfolio featuring a canvas-based galaxy background that morphs into the shape of New Zealand on scroll, custom mouse trail effects, and scroll-triggered GSAP animations. Includes Redis-backed visitor tracking and like system via Vercel serverless functions.',
    technologies: ['React', 'Vite', 'Tailwind CSS', 'GSAP', 'Canvas API', 'Vercel', 'Redis'],
    images: [],
  },
];
