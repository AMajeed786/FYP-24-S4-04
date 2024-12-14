import { useState } from 'react';
import Footer from '../component/footer';
import Header from '../component/header';
import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.jpg';
import img3 from '../assets/img3.jpeg';
import Chat from '../component/Chat';

const Home: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const slides: string[] = [img1, img2, img3]; 

  const showSlide = (index: number): void => {
    if (index < 0) {
      setSlideIndex(slides.length - 1);
    } else if (index >= slides.length) {
      setSlideIndex(0);
    } else {
      setSlideIndex(index);
    }
  };

  const nextSlide = (): void => showSlide(slideIndex + 1);
  const prevSlide = (): void => showSlide(slideIndex - 1);

  return (
    <>
      <Header />
      <main style={{ flex: '1' }}>
      <div className="slideshow-container">
        <div
          className="arrow left"
          onClick={prevSlide}
          role="button"
          aria-label="Previous Slide"
        >
          &#9664;
        </div>

        {slides.map((slide, index) => (
          <div
            key={index}
            className="slide"
            style={{
              display: slideIndex === index ? 'flex' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            aria-hidden={slideIndex !== index}
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        ))}

        <div
          className="arrow right"
          onClick={nextSlide}
          role="button"
          aria-label="Next Slide"
        >
          &#9654;
        </div>
      </div>
      </main>
      <Chat />
      <Footer />
    </>
  );
};

export default Home;
