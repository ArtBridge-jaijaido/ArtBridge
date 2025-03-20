"use client"
import { useSwiper } from "swiper/react";

const HomeImageSliderButton = ({ children, direction }) => {
  const swiper = useSwiper();

  return direction == 'previous' ? 
    <button className="swiper-button-prev home-image-slider-btn" onClick={() => swiper.slideNext()}>
        <img src="images/previous-icon.png" alt="previous-icon"></img>
    </button> : 
    <button className="swiper-button-next home-image-slider-btn" onClick={() => swiper.slidePrev()}>
        <img src="images/next-icon.png" alt="next-icon"></img>
    </button>;
};

export default HomeImageSliderButton;