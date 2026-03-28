import LizardCursor from './components/LizardCursor';

function App() {
  return (
    <div className='relative min-h-screen overflow-hidden'>
      <LizardCursor />

      {/* 维护页面 */}
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center px-6'>
          <h1 className='text-4xl sm:text-6xl font-bold text-white/90 mb-6 tracking-tight'>
            Under Reconstruction
          </h1>
          <p className='text-lg sm:text-xl text-white/50 mb-2'>
            This site is being rebuilt from the ground up.
          </p>
          <p className='text-lg sm:text-xl text-white/50'>
            Expected back online{' '}
            <span className='text-cyan-400/80 font-semibold'>April 1, 2026</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
