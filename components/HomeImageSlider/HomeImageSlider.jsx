"use client";
import { useState, useEffect } from "react";
import "./HomeImageSlider.css"
import '@fortawesome/fontawesome-free/css/all.min.css';


const HomeImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);

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

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    handleResize(); // 初始化的時候先執行一次
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const baseImageWidth = 1440; // 基準寬度，適用於大螢幕
  const responsiveImageWidth = Math.min(baseImageWidth, screenWidth * 0.3); // 根據螢幕寬度調整大小

  const setCurrentState = (direction) => {
    setTimeout(() => {
      if (direction === 'previous') setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      else  setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    }, 300);
};

  return (
    <div className="home-image-slider">
      <button className="home-image-slider-controls home-image-slider-controls-left" onClick={() => setCurrentState('previous')}>
        <img src="images/previous-icon.png" alt="previous-icon"></img>
      </button>
      <div className="home-image-slider-container">
        {images.map((src, index) => {
          const distanceFromCenter = (index - currentIndex + images.length) % images.length;
          const adjustedDistance = distanceFromCenter > images.length / 2 ? distanceFromCenter - images.length : distanceFromCenter;
          const scale = 1 - Math.abs(adjustedDistance) * 0.2;
          const angle = adjustedDistance * 30;
          const translateX = Math.sin(angle * (Math.PI / 180)) * responsiveImageWidth * 1.2;
          const translateZ = Math.max(0, 200 - Math.abs(adjustedDistance) * 100);
          const zIndex = 10 - Math.abs(adjustedDistance); 

          return (
            <div
              key={index}
              className="home-image-slider-gallery-item-container"
              style={{
                position: 'absolute',
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
                zIndex: zIndex,
                opacity: scale,
                transition: 'transform 0.7s',
              }}
            >
              <img 
                src={src} 
                alt={`Image_${index}`} 
                className="home-image-slider-gallery-item"
                style={{width: `${responsiveImageWidth}px`}}
              />
              <span className="home-image-slider-gallery-item-painter">
                繪師名稱
              </span>
            </div>
          );
        })}
      </div>
      <button className="home-image-slider-controls home-image-slider-controls-right" onClick={() => setCurrentState('next')}>
        <img src="images/next-icon.png" alt="next-icon"></img>
      </button>
    </div>
  );
}

export default HomeImageSlider;