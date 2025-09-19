import MyNavigation from './components/MyNavigation';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Blog from './components/Blog';
import Contact from './components/Contact';

function App() {
  return (
    <main className='bg-gray-900 text-white'>
      <MyNavigation />
      <About id='about' />
      <Projects id='projects' />
      <Experience id='experience' />
      <Blog id='blog' />
      <Contact id='contact' />
    </main>
  );
}

export default App;
