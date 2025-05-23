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
import NotificationDropdown from "@/components/NotificationDropdown/NotificationDropdown.jsx";

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

    const handleNavigateToDashboard = (e) =>{
       
        const profilePath = "/artworkDashboard";
        navigate(profilePath);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        setIsMenuOpen(false); // 關閉菜單
    }
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notificationDropdownRef = useRef(null);
    const notificationDropdownRefmobile = useRef(null); //  手機版
    const [notifications, setNotifications] = useState([]);



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
    
    //控制傳入通知panel 的資料數量與內容
    useEffect(() => {
        const personal = Array.from({ length: 5 }).map((_, i) => ({
          id: `personal-${i}`,
          title: '【個人通知】',
          content: `這是個人通知 ${i + 1}`,
          read: false,
        }));
        const system = Array.from({ length: 5 }).map((_, i) => ({
          id: `system-${i}`,
          title: '【系統通知】',
          content: `這是系統通知 ${i + 1}`,
          read: true,
        }));
        setNotifications([...personal, ...system]);
      }, []);
      
      const markAsRead = (id) => {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      };
    
    //點擊外部關閉通知小視窗
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            (!notificationDropdownRef.current || !notificationDropdownRef.current.contains(event.target)) &&
            (!notificationDropdownRefmobile.current || !notificationDropdownRefmobile.current.contains(event.target))
          ) {
            setIsNotificationOpen(false);
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
      
      

    if (!showHeader || isLoading) return null; //如果還在 loading，完全不渲染 Header

    return (
        <header className={`header ${notoSansTCClass}`}>
            <div className="header-logo"
                onClick={() => navigateWithLoading("/")}
            >

                <img src="/images/header-logo.png" alt="ArtBridge" />
            </div>


            <div className="header-loginUser-buttons-container">
                {user&&<div className="header-loginUser-buttons-mobile">
                    <div
                        className="header-notification-wrapper-mobile" // 可以新加這層 class
                        ref={notificationDropdownRefmobile}
                    >
                    <div
                        className="header-notification-bell"
                        onClick={() => setIsNotificationOpen(prev => !prev)}
                    >
                        <img src="/images/icons8-bell-96-1.png" alt="通知" />
                        <span className="header-notification-badge">
                            {notifications.filter(n => !n.read).length}
                        </span>
                    </div>

                        {isNotificationOpen && (
                            <div className="header-notification-dropdown-container-mobile">
                            <NotificationDropdown
                                notifications={notifications}
                                markAsRead={markAsRead}
                            />
                            </div>
                        )}
                    </div>

                    <div className="header-user-avatar" onClick={handleNavigateToDashboard}>
                        <img src={user?.profileAvatar || "/images/kv-min-4.png"} alt="使用者頭像" />
                    </div>
                    <div className="header-user-dropdownMenu-container-mobile" ref={mobileDropdownRef }>
                        <span onClick={toggleDropdown} >⌵</span>
                        {isDropdownOpen && <UserDropdownMenu toggleDropdown={toggleDropdown} toggleMenu={toggleMenu}  setIsMenuOpen={setIsMenuOpen}  />}
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
                        <div
                            className="header-notification-wrapper" // ✅ 新加這層
                            ref={notificationDropdownRef}
                        >
                        <div
                            className="header-notification-bell"
                            onClick={() => setIsNotificationOpen(prev => !prev)}
                        >
                            <img src="/images/icons8-bell-96-1.png" alt="通知" />
                            <span className="header-notification-badge">
                                {notifications.filter(n => !n.read).length}
                            </span>
                        </div>

                        {isNotificationOpen && (
                            <div className="header-notification-dropdown-container">
                            <NotificationDropdown
                                notifications={notifications}
                                markAsRead={markAsRead}
                            />
                            </div>
                        )}
                        </div>

                        <div className="header-user-avatar" onClick={handleNavigateToDashboard}>
                            <img src={user?.profileAvatar || "/images/kv-min-4.png"} alt="使用者頭像" />
                        </div>
                        <div className="header-user-dropdownMenu-container" ref={dropdownRef} >
                            <span onClick={toggleDropdown} >⌵</span>
                            {isDropdownOpen && <UserDropdownMenu toggleDropdown={toggleDropdown} setIsMenuOpen={setIsMenuOpen} />}
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