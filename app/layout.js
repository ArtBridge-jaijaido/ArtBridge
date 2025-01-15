"use client";
import { Geist, Geist_Mono,Noto_Sans_TC  } from "next/font/google";
import { ToastProvider } from "@/app/contexts/ToastContext.js";
import {LoadingProvider} from "@/app/contexts/LoadingContext.js";
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

  

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />  
      </head>
      <body
      
        className={`${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
         <LoadingProvider>
        <Header />
        <main>
         
              <ToastProvider>{children}</ToastProvider>
          
        </main>
        </LoadingProvider>
       
      </body>
    </html>
  );
}

export const notoSansTCClass = notoSansTC.className; // "noto-sans-tc" 字體
