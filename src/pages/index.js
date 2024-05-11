import Header from '../components/Header.js';
import Slideshow from '../components/Slideshow.js';

export default function Home() {

  return (
    <>
      <Header page="Home"/>
      
      <main className="bg-off-white font-mont">
          <div className={`relative font-mont`}>
            <Slideshow />
          </div>
      </main>

      {/*<Footer />*/}

    </>
  )
}
