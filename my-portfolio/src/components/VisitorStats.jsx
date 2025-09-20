import { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

const VisitorStats = () => {
  const [totalVisits, setTotalVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        const response = await fetch('/api/visitor-stats');
        const data = await response.json();
        
        if (data.success) {
          setTotalVisits(data.totalVisits);
        } else {
          console.error('API error:', data.message);
          setTotalVisits(0);
        }
      } catch (error) {
        console.error('Failed to fetch visitor stats:', error);
        setTotalVisits(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorStats();
  }, []);

  const formatNumber = num => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className='contact-card'>
      <div className='bg-gradient-to-br from-gray-800/10 to-gray-900/10 rounded-xl border border-gray-700/20 p-6 text-center'>
        <div className='w-10 h-10 bg-emerald-300/10 rounded-lg flex items-center justify-center mx-auto mb-3'>
          <Eye size={20} className='text-emerald-300' />
        </div>
        <h4 className='text-sm font-medium text-white mb-1'>Visitors</h4>
        <p className='text-xs text-gray-400'>
          {isLoading ? 'Loading...' : `${formatNumber(totalVisits)} visits`}
        </p>
      </div>
    </div>
  );
};

export default VisitorStats;
