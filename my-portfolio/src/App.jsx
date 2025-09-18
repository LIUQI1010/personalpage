import MyNavigation from './components/MyNavigation';
import About from './components/About';

function App() {
  return (
    <main className='bg-gray-900 text-white'>
      <MyNavigation />
      <About id='about' />
    </main>
  );
}

export default App;
