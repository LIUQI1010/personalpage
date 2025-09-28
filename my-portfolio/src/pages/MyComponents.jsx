import { useState } from 'react';
import MyNavigation from '../components/MyNavigation';

export default function MyComponents() {
  // 示例组件数据
  const components = [
    { id: 'button', name: 'Custom Button' },
    { id: 'card', name: 'Glass Card' },
    { id: 'modal', name: 'Modal Dialog' },
    { id: 'input', name: 'Floating Input' },
    { id: 'loader', name: 'Loading Spinner' },
  ];

  const [selectedComponent, setSelectedComponent] = useState(components[0]);

  return (
    <main className='text-white relative min-h-screen bg-gray-900'>
      <MyNavigation />

      <div className='flex pt-24'>
        {/* 侧边导航 - 固定位置，不需要联动 */}
        <aside className='w-64 bg-gray-800/30 backdrop-blur-md border-r border-gray-700/30 flex-shrink-0 h-[calc(100vh-6rem)]'>
          <div className='p-6'>
            <h2 className='text-xl font-bold text-white mb-6'>Components</h2>
            <nav className='space-y-2'>
              {components.map(component => (
                <button
                  key={component.id}
                  onClick={() => setSelectedComponent(component)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedComponent.id === component.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-300 hover:bg-gray-700/30 hover:text-white'
                  }`}
                >
                  {component.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 主内容区域 */}
        <div className='flex-1 overflow-auto'>
          <div className='p-8'>
            <div className='max-w-4xl mx-auto'>
              <h1 className='text-3xl font-bold mb-4'>{selectedComponent.name}</h1>
              <p className='text-gray-300 mb-8'>Selected component preview</p>

              <div className='bg-gray-800/30 rounded-lg p-8 border border-gray-700/50'>
                <div className='text-center py-20'>
                  <p className='text-xl text-gray-400'>
                    {selectedComponent.name} preview will be displayed here
                  </p>
                  <p className='text-sm text-gray-500 mt-4'>
                    Navigation bar is now fixed and won't hide on scroll
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
