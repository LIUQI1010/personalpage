import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import MyComponents from './pages/MyComponents';

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
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/my-components' element={<MyComponents />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
