"use client";
import { useState, useEffect } from "react";
import "./HomeImageSlider.css"
import '@fortawesome/fontawesome-free/css/all.min.css';


const HomeImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageNum, setCurrentImageNum] = useState(5);

  const images = ["/images/testing-Arkwork-image.png",
    "/images/testing-Arkwork-image-1.png",
    "/images/testing-Arkwork-image-2.png",
    "/images/testing-Arkwork-image-3.png",
    "/images/testing-Arkwork-image-4.png",
    "/images/testing-Arkwork-image-5.png",
    "/images/testing-Arkwork-image-6.png",
    "/images/testing-Arkwork-image-7.png",
    "/images/testing-Arkwork-image-8.png",
    "/images/testing-Arkwork-image-9.png",
    "/images/testing-Arkwork-image-10.png"
  ];

  // 當窗口大小變化時，如果寬度小於 320px 畫面只顯示三個繪師
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth <= 320) setCurrentImageNum(3);
        else setCurrentImageNum(5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const setCurrentState = (direction) => {
    if (direction === 'previous') setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    else if (direction === 'next') setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="home-image-slider">
      <button className="home-image-slider-controls left" onClick={() => setCurrentState('previous')}>
        <img src="images/previous-icon.png"></img>
      </button>
      <div className="home-image-slider-container">
        { currentImageNum == 5 ? 
          <div className="gallery-item-container" style={{zIndex: 0, opacity: 0.4}}>
            <img className="gallery-item gallery-item-1" src={images[(currentIndex - 2 + images.length) % images.length]} />
            <span className="gallery-item-painter gallery-item-painter-1">繪師名稱</span>
          </div> : null }
        <div className="gallery-item-container" style={{zIndex: 1, opacity: 0.8}}>
          <img className="gallery-item gallery-item-2" src={images[(currentIndex - 1 + images.length) % images.length]} />
          <span className="gallery-item-painter gallery-item-painter-2">繪師名稱</span>
        </div>
        <div className="gallery-item-container" style={{zIndex: 2}}>
          <img className="gallery-item gallery-item-3" src={images[currentIndex]} />
          <span className="gallery-item-painter gallery-item-painter-3">繪師名稱</span>
        </div>
        <div className="gallery-item-container" style={{zIndex: 1, opacity: 0.8}}>
          <img className="gallery-item gallery-item-4" src={images[(currentIndex + 1) % images.length]} />
          <span className="gallery-item-painter gallery-item-painter-4">繪師名稱</span>
        </div>
        { currentImageNum == 5 ? 
          <div className="gallery-item-container" style={{zIndex: 0, opacity: 0.4}}>
            <img className="gallery-item gallery-item-5" src={images[(currentIndex + 2) % images.length]} />
            <span className="gallery-item-painter gallery-item-painter-5">繪師名稱</span>
          </div> : null }
      </div>
      <button className="home-image-slider-controls right" onClick={() => setCurrentState('next')}>
        <img src="images/next-icon.png"></img>
      </button>
    </div>
  );
}

export default HomeImageSlider;