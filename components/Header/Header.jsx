"use client";
import { useState, useEffect } from "react";
import { notoSansTCClass } from "../../app/layout.js";
import CustomButton from "../CustomButton/CustomButton.jsx";
import { useNavigation } from "@/lib/functions.js";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./headerButton.module.css";
import "./Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // 使用 usePathname 獲取當前路徑
    const pathname = usePathname();

    // 指定不需要顯示 Header 的路徑
    const noHeaderRoutes = ["/login", "/register", "/emailValidation"];
    const showHeader = !noHeaderRoutes.includes(pathname);
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const navigate = useNavigation();

    const handleUserLogin = () => {
       
        navigate("/login");
    };

    const handleUserRegister = () => {
        navigate("/register");
    };

    // when the window is resized, close the menu if the window is wider than 768px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false); 
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!showHeader) return null;

    return (
        <header className="header">
            <div className={`header-logo ${notoSansTCClass}`}>LOGO</div>
            <button
                className="hamburger-menu"
                onClick={toggleMenu}
                aria-label="Toggle navigation menu" 
                aria-expanded={isMenuOpen} 
            >
                ☰
            </button>
            <nav className={`header-nav ${isMenuOpen ? "open" : ""} ${notoSansTCClass}`}>
                <div className="header-nav-options">
                    <Link href="/painter">繪師</Link>
                    <Link href="/artMarket">市集</Link>
                    <Link href="/artCommunity">交流版</Link>
                    <Link href="/artShowcaseLobby">展示大廳</Link>
                    <Link href="/artApply">委託大廳</Link>
                </div>
                <div className="header-auth-buttons">
                    <CustomButton title="登入" className={styles.headerBtn} onClick={handleUserLogin} />
                    <CustomButton title="註冊" className={styles.headerBtn} onClick={handleUserRegister} />
                </div>
            </nav>
        </header>
    );
};

export default Header;
