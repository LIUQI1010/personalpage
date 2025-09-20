import { useEffect } from 'react';

const VisitTracker = () => {
  useEffect(() => {
    const recordVisit = async () => {
      try {
        // 记录访问
        await fetch('/api/visitor-stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Visit recorded');
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    // 页面加载时记录访问
    recordVisit();
  }, []);

  // 这个组件不渲染任何内容
  return null;
};

export default VisitTracker;
