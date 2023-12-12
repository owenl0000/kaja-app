import Header from '../components/Header.js';
import Slideshow from '../components/Slideshow.js';
import Footer from "../components/Footer";
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header page="Home"/>
      
      <main className="bg-off-white font-mont">
          {/* Welcome Section */}
          <div className="relative font-mont h-[1200px]">
            <Slideshow />
          </div>
      </main>

      {/*<Footer />*/}

    </>
  )
}
