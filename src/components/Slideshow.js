import React, { useState, useEffect } from 'react';
import Footer from "@/components/Footer";
import Link from 'next/link';

export default function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState([0, 0, 0]);
  const [disableTransition, setDisableTransition] = useState(false);
  const images = [
    '/images/slideshow1.webp',
    '/images/slideshow2.webp',
    '/images/slideshow3.webp',
  ];

  useEffect(() => {
    console.log('Use Effect');
    const timer = setInterval(() => {
      setSlideIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % images.length;
        if (newIndex === 0) {
          setDisableTransition(true);
          setProgress([0, 0, 0]);
          setTimeout(() => setDisableTransition(false), 50);
        }
        return newIndex;
      });
    }, 5000);
  
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = [...prevProgress];
        newProgress[slideIndex] = Math.min(newProgress[slideIndex] + 1, 100);
        return newProgress;
      });
    }, 50);  
  
    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [images.length, slideIndex]);

  const handleBarClick = (index) => {
    setDisableTransition(true);
    setSlideIndex(index);
    const newProgress = [0, 0, 0];
    for (let i = 0; i <= index; i++) {
      newProgress[i] = i < index ? 100 : 0;
    }
    setProgress(newProgress);
    setTimeout(() => setDisableTransition(false), 50);
  };

  return (
    <div className="slideshow-container pb-12">
      {images.map((image, index) => (
        <div className={`absolute top-0 h-full w-full mySlides ${index === slideIndex ? 'show' : ''}`} key={index}>
          <img src={image} alt={`Slide ${index + 1}`} />
        </div>
      ))}
  
      {/* Section to be inserted */}
      <div className="flex relative justify-center h-screen items-center pointer-events-none">
        {/* Centered Section */}
        <section className="flex flex-col justify-center items-center text-center p-5 ">
          <div className="flex flex-col justify-center items-center text-center max-w-md mx-auto p-5">
            <h4 className="font-mont text-[12px] lg:text-[45px] md:text-[35px] sm:text-[30px] text-off-white mb-4 shadow-text" style={{ textShadow: '3px 4px 7px #000' }}>
              Welcome to Kaja
            </h4>
            <p className="font-mont text-[10px] lg:text-2xl md:text-xl sm:text-lg text-off-white mb-5 shadow-text" style={{ textShadow: '3px 4px 7px #000' }}>
              Turn Your Travel Dreams into Reality with Kaja!
            </p>
            <Link
              href="/Planner"
              className="pointer-events-auto font-mont bg-coral active:bg-[var(--dark-coral)] text-off-white px-6 py-2 rounded-md text-center hover:bg-turquoise-dark inline-block text-select "
            >
              Start Planning
            </Link>
          </div>
        </section>
      </div>

      <div className={"relative z-0 lg:max-h-[100000000000000000000000000000000px] sm:max-h-0 w-full"}>
        <Footer/>
      </div>
  
      <div className="progress-container w-[150px] small:w-[250px] lg:pb-0  pb-7">
        {images.map((_, index) => (
          <div 
            className={`progress-bar ${disableTransition ? 'no-transition' : ''}`}
            key={index} 
            onClick={() => handleBarClick(index)}
          >
            <div 
              style={{
                width: `${index === slideIndex ? progress[slideIndex] : (index < slideIndex ? 100 : 0)}%`,
                height: '100%',
                backgroundColor: 'white',
                transition: index === slideIndex && !disableTransition ? 'width 0.15s linear' : 'none'
              }}
            ></div>
          </div>
        ))}
      </div>
  

    </div>
  );
}
