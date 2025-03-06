"use client";

import React, { createContext, useContext, useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";

const ImageLoadingContext = createContext();

export const ImageLoadingProvider = ({ children }) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  return (
    <ImageLoadingContext.Provider value={{ isImageLoading, setIsImageLoading , isEmpty, setIsEmpty }}>
      {isImageLoading && !isEmpty &&(
        <div style={styles.loaderContainer}>
          <FadeLoader color="#8DD7FF" size={25} />
          <span>圖片載入中...</span>
        </div>
      )}
      {children}
    </ImageLoadingContext.Provider>
  );
};

export const useImageLoading = () => useContext(ImageLoadingContext);

const styles = {
    loaderContainer: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      padding: "20px",
      borderRadius: "10px",
      zIndex: 10,
    },
  };