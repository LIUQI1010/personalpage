import MyNavigation from './components/MyNavigation';
import About from './components/About';

function App() {
  return (
    <main className='bg-black text-white'>
      <MyNavigation />
      <About id='about' />
    </main>
  );
}

export default App;
