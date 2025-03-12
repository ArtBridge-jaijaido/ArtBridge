"use client";
import { useEffect } from "react";
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

  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth(); 
    const unsubscribeArtworks = subscribeToArtworks(); 
    const unsubscribeAllUsers = subscribeToAllUsers();
    const unsubscribePainterPortfolios = subscribeToPainterPortfolios();
    const unsubscribePainterArticles = subscribeToPainterArticles();
  
    return () => {
      unsubscribeAuth();        // 清除 Auth 訂閱
      unsubscribeArtworks();    // 清除 Artworks 訂閱
      unsubscribeAllUsers();    // 清除 Users 訂閱
      unsubscribePainterPortfolios(); // 清除 PainterPortfolios 訂閱
      unsubscribePainterArticles();   // 清除 PainterArticles 訂閱
    };
  }, []);

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
