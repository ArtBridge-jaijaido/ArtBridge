"use client";
import { useState, useEffect } from "react";
import { notoSansTCClass } from "../../app/layout.js";
import useAuthLoading from "@/hooks/useAuthLoading";
import { useNavigation } from "@/lib/functions.js";
import "./Footer.css";

const Footer = () => {
    const [isMounted, setIsMounted] = useState(false); // 判斷是否已加載客戶端
    const isLoading = useAuthLoading();

    // 僅在客戶端加載後執行路徑判斷，避免 SSR 和 CSR 不一致
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const navigate = useNavigation();

    // 先用href="#" 之後再看要連去哪
    const navigateTo = (path) => {
        navigate(path);
    }

    const showFooter = isMounted;

    if (!showFooter || isLoading) return null; //如果還在 loading，完全不渲染 Footer

    return (
        <footer className={`footer ${notoSansTCClass}`}>
            <div className="footer-logo">
                <img src="/images/footer-image.png" alt="ArtBridgeLogo"></img>
            </div>
            <div className="footer-about-us">
                <div className="footer-about-us-button-container">
                    <div className="footer-about-us-button-top">
                        <a href="#" className="footer-about-us-link">Q&A</a>
                        <a href="#" className="footer-about-us-link">企業諮詢</a>
                        <a href="#" className="footer-about-us-link">廣告合作</a>
                    </div>
                    <div className="footer-about-us-button-bottom">
                        <a href="#" className="footer-about-us-link">使用教學</a>
                        <a href="#" className="footer-about-us-link">聯絡我們</a>
                        <a href="#" className="footer-about-us-link">使用者條款</a>
                    </div>
                </div>
                <div className="footer-about-us-social-media-container">
                    <div className="footer-about-us-social-media-icon">
                        <a href="#" className="footer-about-us-social-media-link">
                            <img src="/images/line-icon.png"/>
                        </a>
                        <a href="#" className="footer-about-us-social-media-link">
                            <img src="/images/fb-icon.png"/>
                        </a>
                        <a href="#" className="footer-about-us-social-media-link">
                            <img src="/images/ig-icon.png"/>
                        </a>
                    </div>
                    <div className="footer-about-us-social-media-mail">12345678@gmail.com</div>
                </div>
            </div>
            <div className="footer-copyright">©版權</div>
        </footer>
    );
};

export default Footer;
