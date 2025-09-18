import MyNavigation from './components/MyNavigation';
import About from './components/About';
import Projects from './components/Projects';

function App() {
  return (
    <main className='bg-gray-900 text-white'>
      <MyNavigation />
      <About id='about' />
      <Projects id='projects' />
    </main>
  );
}

export default App;
