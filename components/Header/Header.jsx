"use client";
import { useState, useEffect, useRef } from "react";
import { notoSansTCClass } from "../../app/layout.js";
import CustomButton from "../CustomButton/CustomButton.jsx";
import UserDropdownMenu from "@/components/UserDropdownMenu/UserDropdownMenu.jsx";
import { useNavigation } from "@/lib/functions.js";
import useAuthLoading from "@/hooks/useAuthLoading";
import { useLoading } from "@/app/contexts/LoadingContext.js";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import styles from "./headerButton.module.css";
import "./Header.css";

const Header = () => {
    const [isMounted, setIsMounted] = useState(false); // 判斷是否已加載客戶端
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileDropdownRef = useRef(null);
    const { setIsLoading } = useLoading();
    const pathname = usePathname();
    const isLoading = useAuthLoading();
    const { user } = useSelector((state) => state.user);
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

    const toggleDropdown = (e) => {
    
        setIsDropdownOpen((prev) => !prev);
    };
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


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
        setTimeout(() => setIsLoading(false), 1000);
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

    if (!showHeader || isLoading) return null; //如果還在 loading，完全不渲染 Header

    return (
        <header className="header">
            <div className={`header-logo ${notoSansTCClass}`}>LOGO</div>


            <div className="header-loginUser-buttons-container">
                {user&&<div className="header-loginUser-buttons-mobile">
                    <div className="header-notification-bell">
                        <img src="/images/icons8-bell-96-1.png" alt="通知" />
                        <span className="header-notification-badge">9+</span> {/*未讀訊息 */}
                    </div>
                    <div className="header-user-avatar">
                        <img src={"/images/kv-min-4.png"} alt="使用者頭像" />
                    </div>
                    <div className="header-user-dropdownMenu-container-mobile" ref={mobileDropdownRef }>
                        <span onClick={toggleDropdown} >⌵</span>
                        {isDropdownOpen && <UserDropdownMenu toggleDropdown={toggleDropdown} toggleMenu={toggleMenu}/>}
                    </div>
                </div>}
                <button
                    className="hamburger-menu"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                >
                    ☰
                </button>
            </div>
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
                {user ? (
                    <div className="header-loginUser-buttons" >
                        <div className="header-notification-bell">
                            <img src="/images/icons8-bell-96-1.png" alt="通知" />
                            <span className="header-notification-badge">9+</span> {/*未讀訊息 */}
                        </div>
                        <div className="header-user-avatar">
                            <img src={user.profilePicture || "/images/kv-min-4.png"} alt="使用者頭像" />
                        </div>
                        <div className="header-user-dropdownMenu-container" ref={dropdownRef} >
                            <span onClick={toggleDropdown} >⌵</span>
                            {isDropdownOpen && <UserDropdownMenu toggleDropdown={toggleDropdown} />}
                        </div>
                    </div>
                ) : (
                    /* 如果未登入，顯示「註冊 / 登入」 */
                    <div className="header-auth-buttons">
                        <CustomButton title="註冊" className={styles.headerBtn} onClick={handleUserRegister} />
                        <CustomButton title="登入" className={styles.headerBtn} onClick={handleUserLogin} />
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
