"use client";
import { useState, useEffect } from "react";
import { notoSansTCClass } from "../../app/layout.js";
import CustomButton from "../CustomButton/CustomButton.jsx";
import { useNavigation } from "@/lib/functions.js";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./headerButton.module.css";
import "./Header.css";

const Header = () => {
    const [isMounted, setIsMounted] = useState(false); // 判斷是否已加載客戶端
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setIsLoading } = useLoading();
    const pathname = usePathname();

    // 指定不需要顯示 Header 的路徑
    const noHeaderRoutes = ["/login", "/register", "/emailValidation"];

    // 僅在客戶端加載後執行路徑判斷，避免 SSR 和 CSR 不一致
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const showHeader = isMounted && !noHeaderRoutes.includes(pathname);

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

    const navigateWithLoading = (path) => {
        navigate(path);
        setIsLoading(true);
        setTimeout(() => {

            setIsLoading(false);

        }, 2000);
        setIsMenuOpen((prev) => !prev); // 關閉菜單
    };



    // 當窗口大小變化時，如果寬度大於 768px，關閉菜單
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
                    <a
                        onClick={() => navigateWithLoading("/artworkPainter")}
                        className={pathname === "/artworkPainter" ? "active" : ""}
                    >
                        繪師
                    </a>
                    <a
                        onClick={() => navigateWithLoading("/artworkMarket")}
                        className={pathname === "/artworkMarket" ? "active" : ""}
                    >
                        市集
                    </a>
                    <a
                        onClick={() => navigateWithLoading("/artworkCommunity")}
                        className={pathname === "/artworkCommunity" ? "active" : ""}
                    >
                        交流版
                    </a>
                    <a
                        onClick={() => navigateWithLoading("/artworkShowcaseLobby")}
                        className={pathname === "/artworkShowcaseLobby" ? "active" : ""}
                    >
                        展示大廳
                    </a>
                    <a
                        onClick={() => navigateWithLoading("/artworkEntrustLobby")}
                        className={pathname === "/artworkEntrustLobby" ? "active" : ""}
                    >
                       委託大廳
                    </a>
                </div>
                <div className="header-auth-buttons">
                    <CustomButton title="註冊" className={styles.headerBtn} onClick={handleUserRegister} />
                    <CustomButton title="登入" className={styles.headerBtn} onClick={handleUserLogin} />
                </div>
            </nav>
        </header>
    );
};

export default Header;
