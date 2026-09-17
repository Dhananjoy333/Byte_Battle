import Hero from '@/app/_components/main_page/Hero'
import About from './_components/main_page/About';
import Navbar from './_components/main_page/Navbar';
import Features from './_components/main_page/Features';
import Story from './_components/main_page/Story';
import Contact from './_components/main_page/Contact';
import Footer from './_components/main_page/Footer';

export default function Home() {
  return (
    <main className='relative min-h-screen w-screen overflow-x-hidden'>
      <Navbar/>
      <Hero/>
      <About/>
      <Features/>
      <Story/>
      <Contact/>
      <Footer/>
    </main>
  );
}
