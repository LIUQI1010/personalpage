import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='relative min-h-screen flex items-center justify-center text-white'>
      <div className='relative z-10 text-center px-4'>
        <h1 className='text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent'>
          404
        </h1>
        <p className='text-2xl text-gray-300 mb-8'>Page not found</p>
        <Link
          href='/'
          className='inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300'
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
