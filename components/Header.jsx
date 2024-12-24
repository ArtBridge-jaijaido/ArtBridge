"use client";
import { useState, useEffect } from "react";
import { notoSansTCClass } from "../app/layout.js";
import CustomButton from "./CustomButton.jsx";
import { useNavigation } from "@/lib/functions.js";
import Link from "next/link";
import "./css/Header.css";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    const navigate = useNavigation();

    const handleUserLogin = () => {
        alert("user login");
        navigate("/login");
    };

    const handleUserRegister = () => {
        alert("user register");
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

    return (
        <header className="header">
            <div className={`header-logo ${notoSansTCClass}`}>LOGO</div>
            <button
                className="hamburger-menu"
                onClick={toggleMenu}
                aria-label="Toggle navigation menu" 
                aria-expanded={isMenuOpen} // 用於輔助技術 
            >
                ☰
            </button>
            <nav className={`header-nav ${isMenuOpen ? "open" : ""} ${notoSansTCClass}`}>
                <div className="header-nav-options">
                    <Link href="#">繪師</Link>
                    <Link href="#">市集</Link>
                    <Link href="#">交流版</Link>
                    <Link href="#">展示大廳</Link>
                    <Link href="#">委託大廳</Link>
                </div>
                <div className="header-auth-buttons">
                    <CustomButton title="登入" onClick={handleUserLogin} />
                    <CustomButton title="註冊" onClick={handleUserRegister} />
                </div>
            </nav>
        </header>
    );
};

export default Header;
