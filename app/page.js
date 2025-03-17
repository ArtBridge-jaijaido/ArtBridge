import { notoSansTCClass } from '@/app/layout.js';
import "./home/home.css";
import Link from "next/link";
import HomeImageSlider from '@/components/HomeImageSlider/HomeImageSlider';
import Footer from '@/components/Footer/Footer';


export default function Home() {
  const imgUrl = 'images/pngtree-anime-anime-girl-by-kyuuya-yoshito-and-her-three-friends-image_2951481-1.png';

  return (
    <div className={`home-page ${notoSansTCClass}`}>
      <div className="home-page-promotion-image-container">
        <img src={imgUrl} alt="宣傳圖"/>
      </div>
      <div className="home-page-wave-container">
        <img src="images/home-page-wave.png" alt="波浪"/>
      </div>
      <div className="home-page-news-and-event-container">
        <p>網站最新消息/活動專區</p>
      </div>
      <div className="home-page-advertisement-container">
        廣告商專用區
      </div>
      <div className="home-page-image-slider-container">
        <p className="home-page-image-slider-entrust">
          委託最高人氣繪師<img src="images/fire-icon.png" alt="fire"/>
        </p>
        <p className="home-page-image-slider-register">
          多種風格任你挑選，<Link href="/register" className="login-highlight-blue">立即註冊</Link>
        </p>
        <HomeImageSlider></HomeImageSlider>
      </div>
      <Footer />
    </div>
  );
}
