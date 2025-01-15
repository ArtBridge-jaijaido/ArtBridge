"use client";

import React, { createContext, useContext, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

 
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && (
        <div style={styles.loaderContainer}>
          <PacmanLoader color="#8DD7FF" size={25} />
          <span>讀取中...請稍候</span>
        </div>
      
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

const styles = {
  loaderContainer: {
    display:"flex",
    flexDirection: "column",
    fontSize: "1rem",
    fontWeight: "600",
    gap: 10,
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#ffffff" ,
    zIndex: 9999,
  },
};
