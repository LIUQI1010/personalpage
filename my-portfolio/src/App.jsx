import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Home from './pages/Home';

const MosoTea = lazy(() => import('./pages/MosoTea'));
const MyComponents = lazy(() => import('./pages/MyComponents'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 组件用于处理路由切换时的滚动重置
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 路由切换时清除锚点并滚动到顶部
    if (window.location.hash) {
      window.history.replaceState(null, null, pathname);
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/projects/mosotea' element={<MosoTea />} />
          <Route path='/my-components' element={<MyComponents />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
