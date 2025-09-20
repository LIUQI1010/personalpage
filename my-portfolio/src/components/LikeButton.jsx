import { useState, useRef, useCallback, useEffect } from 'react';
import { Heart } from 'lucide-react';

const LikeButton = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastRecordedClick, setLastRecordedClick] = useState(null);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef(null);
  const heartIdRef = useRef(0);

  // 创建飘浮爱心
  const createFloatingHeart = useCallback(() => {
    const heartId = heartIdRef.current++;
    const newHeart = {
      id: heartId,
      x: Math.random() * 12 - 6, // -6 到 6 的随机偏移
      rotation: Math.random() * 30 - 15, // -15 到 15 度的随机旋转
    };

    setFloatingHearts(prev => [...prev, newHeart]);

    // 2秒后移除爱心
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(heart => heart.id !== heartId));
    }, 2000);
  }, []);

  // 获取初始点赞数
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch('/api/likes');
        const data = await response.json();
        if (data.success) {
          setLikeCount(data.likes);
        }
      } catch (error) {
        console.error('Failed to fetch likes:', error);
      }
    };
    
    fetchLikes();
  }, []);

  // 检查是否可以记录点赞（1分钟限制）
  const canRecordLike = useCallback(() => {
    if (!lastRecordedClick) return true;
    const timeDiff = Date.now() - lastRecordedClick;
    return timeDiff >= 60000; // 60秒 = 60000毫秒
  }, [lastRecordedClick]);

  // 处理点击事件
  const handleLike = useCallback(async () => {
    // 防止重复点击
    if (isLoading) return;

    // 设置按钮动画
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);

    // 创建飘浮爱心（每次点击都会创建）
    createFloatingHeart();

    // 检查是否可以记录点赞（本地检查，减少不必要的API调用）
    if (canRecordLike()) {
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (data.success) {
          setLikeCount(data.likes);
          setLastRecordedClick(Date.now());
          console.log('点赞已记录！当前总数:', data.likes);
        } else if (response.status === 429) {
          console.log('点赞过于频繁，服务器端限制');
        } else {
          console.error('点赞失败:', data.message);
        }
      } catch (error) {
        console.error('网络错误:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log('点赞过于频繁，本地限制');
    }
  }, [canRecordLike, createFloatingHeart, isLoading]);

  // 检查是否在冷却期
  const isInCooldown = !canRecordLike();

  return (
    <div className='fixed bottom-8 right-8 z-50'>
      {/* 飘浮爱心容器 */}
      <div className='absolute inset-0 pointer-events-none z-30'>
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            className='absolute bottom-full left-1/2'
            style={{
              '--heart-x': `${heart.x}px`,
              '--heart-rotation': `${heart.rotation}deg`,
              animation: 'floatUp 2s ease-out forwards',
            }}
          >
            <Heart
              className='w-4 h-4 text-red-500 fill-current'
              style={{
                filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))',
              }}
            />
          </div>
        ))}
      </div>

      {/* 点赞按钮 */}
      <div className='flex flex-col items-center'>
        {/* 点赞按钮 */}
        <button
          ref={buttonRef}
          onClick={handleLike}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`
            group relative w-12 h-12 rounded-full
            bg-white/10 backdrop-blur-sm border border-white/20
            hover:bg-white/20 hover:scale-110
            transition-all duration-200 ease-out
            ${isAnimating ? 'scale-125' : ''}
            ${isInCooldown ? 'opacity-60' : 'opacity-90'}
          `}
          style={{ cursor: 'pointer' }}
        >
          <Heart
            className={`
              w-5 h-5 mx-auto transition-all duration-200
              ${isInCooldown ? 'text-red-500' : 'text-red-500 group-hover:text-red-400'}
              ${likeCount > 0 ? 'fill-current' : ''}
            `}
          />

          {/* 点击波纹效果 */}
          <div
            className={`
              absolute inset-0 rounded-full border-2 border-red-500/50
              ${isAnimating ? 'animate-ping' : 'opacity-0'}
            `}
          />

          {/* 自定义Tooltip */}
          {showTooltip && (
            <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded whitespace-nowrap pointer-events-none z-10'>
              {likeCount.toLocaleString()} likes
              <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black/80'></div>
            </div>
          )}
        </button>
      </div>

      {/* 全局CSS动画样式 */}
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateX(calc(-50% + var(--heart-x))) translateY(0) scale(1) rotate(var(--heart-rotation));
          }
          50% {
            opacity: 0.8;
            transform: translateX(calc(-50% + var(--heart-x))) translateY(-40px) scale(1.1) rotate(calc(var(--heart-rotation) + 10deg));
          }
          100% {
            opacity: 0;
            transform: translateX(calc(-50% + var(--heart-x))) translateY(-80px) scale(0.8) rotate(calc(var(--heart-rotation) + 20deg));
          }
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
