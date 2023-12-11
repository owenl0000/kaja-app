import Header from '../components/Header.js';
import Slideshow from '../components/Slideshow.js';
import Footer from "../components/Footer";
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Header page="Home"/>
      
      <main className="bg-off-white">
          {/* Welcome Section */}
          <div className="relative h-[1200px]">
            <Slideshow />

            <section className="absolute top-0 left-0 right-0 h-full flex flex-col justify-start items-center text-center p-5">
              <div className={"flex flex-col justify-center items-center h-screen"}>
                <h4 className="font-trend text-[45px] lg:text-[45px] md:text-[35px] sm:text-[30px] text-off-white mb-4 shadow-text" style={{ textShadow: '3px 4px 7px #000' }}>
                  Welcome to Kaja
                </h4>
                <p className="font-pop-sbold font-semibold text-2xl lg:text-2xl md:text-xl sm:text-lg text-off-white mb-5 shadow-text lg:w-[600px] md:w-[500px] sm:w-[400px]" style={{ textShadow: '3px 4px 7px #000' }}>
                Turn Your Travel Dreams into Reality with Kaja!

                </p>
                <Link
                  href="/Planner"
                  className="font-trend bg-coral active:bg-[var(--dark-coral)] text-off-white px-6 py-2 rounded-md text-center hover:bg-turquoise-dark inline-block pb-3 text-select border"
                >
                  Start Planning
                </Link>
              </div>
            </section>
          </div>
      </main>

      {/*<Footer />*/}

    </>
  )
}
