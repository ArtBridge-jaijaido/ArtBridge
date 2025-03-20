"use client";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import { ToastProvider } from "@/app/contexts/ToastContext.js";
import { LoadingProvider } from "@/app/contexts/LoadingContext.js";
import {ImageLoadingProvider} from "@/app/contexts/ImageLoadingContext.js";
import { subscribeToAuth } from "@/lib/authListener"; 
import { subscribeToArtworks} from "@/lib/artworkListener";
import { subscribeToAllUsers } from "@/lib/userListener";
import {subscribeToPainterPortfolios} from "@/lib/painterPortfolioListener";
import { subscribeToPainterArticles } from "@/lib/painterArticleListener";
import {store} from "@/app/redux/store.js";
import {Provider } from "react-redux";
import Header from "@/components/Header/Header.jsx";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'chinese-traditional'],
  variable: "--font-noto-sans-tc",
});





export default function RootLayout({ children }) {
  const [token, setToken] = useState(null);
  const [unsubscribeAllUsers, setUnsubscribeAllUsers] = useState(null);

  //  透過 API 獲取 HttpOnly Cookie 內的 token
  const fetchToken = async () => {
    try {
      const response = await fetch("/api/getToken", { credentials: "include" }); // ✅ 從後端獲取 token
      const { token } = await response.json();
      setToken(token);
    } catch (error) {
      
      setToken(null);
    }
  };

  // 監聽 Firebase Auth 狀態變更，並確保 token 最新
  useEffect(() => {
    fetchToken(); 

    const unsubscribeAuthState = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const newToken = await user.getIdToken();
        if (!token || token !== newToken) {      
          fetchToken(); 
        }
      } else {
        setToken(null);
      }
    });

    return () => unsubscribeAuthState();
  }, []);

  //  當 Token 變更時，重新訂閱 Firestore 監聽
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth();
    const unsubscribeArtworks = subscribeToArtworks();
    const unsubscribePainterPortfolios = subscribeToPainterPortfolios();
    const unsubscribePainterArticles = subscribeToPainterArticles();

    //  先取消舊的 Users 訂閱，然後重新訂閱
    if (unsubscribeAllUsers) {
      unsubscribeAllUsers();
    }
    const newUnsubscribeAllUsers = subscribeToAllUsers();
    setUnsubscribeAllUsers(() => newUnsubscribeAllUsers);

    return () => {
      unsubscribeAuth();
      unsubscribeArtworks();
      newUnsubscribeAllUsers();
      unsubscribePainterPortfolios();
      unsubscribePainterArticles();
    };
  }, [token]); //  當 Token 變更時，重新執行


  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body

        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        <Provider store={store}>
         
          <LoadingProvider>
            <Header />
            <main>
              <ImageLoadingProvider>
              <ToastProvider>{children}</ToastProvider>
              </ImageLoadingProvider>
            </main>
          </LoadingProvider>
        </Provider>
      </body>
    </html>
  );
}

export const notoSansTCClass = notoSansTC.className; // "noto-sans-tc" 字體
