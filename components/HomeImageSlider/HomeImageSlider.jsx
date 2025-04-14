"use client";
import { useState, useEffect } from "react";
import "./HomeImageSlider.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow } from 'swiper/modules';
import HomeImageSliderButton from './HomeImageSliderButton/HomeImageSliderButton';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';

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

  return (
    <div className="home-image-slider">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 400,
          modifier: 1,
          slideShadows: false,
        }}
        loop={true}
        loopAdditionalSlides={1}
        modules={[EffectCoverflow]}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
      >
        <HomeImageSliderButton direction="previous" />
        {images.map((src, index) => {
          const distanceFromCenter = (index - currentIndex + images.length) % images.length;
          const adjustedDistance = distanceFromCenter > images.length / 2 ? distanceFromCenter - images.length : distanceFromCenter;
          const opacity = 1 - Math.abs(adjustedDistance) * 0.2;

          return(
            <SwiperSlide key={index} className="home-image-slider-gallery-item-container"
              style={{ opacity: opacity, width: `${responsiveImageWidth}px` }}>
              <img 
                src={src} 
                alt={`Image_${index}`} 
                className="home-image-slider-gallery-item"
                style={{ width: `${responsiveImageWidth}px` }}
              />
              <span className="home-image-slider-gallery-item-painter">
                繪師名稱
              </span>
            </SwiperSlide>
          )
        })}
        <HomeImageSliderButton direction="next" />
      </Swiper>
    </div>
  );
}

export default HomeImageSlider;