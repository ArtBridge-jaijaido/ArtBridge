"use client";
import React from "react";
import { FadeLoader } from "react-spinners";
import "./loadingButton.css";

const LoadingButton = ({ isLoading, onClick, children, disabled, className }) => {
    return (
        <button
            className={`loading-button ${isLoading ? "loading" : ""} ${className || ""}`}
            onClick={!isLoading ? onClick : undefined}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <div className="loading-content">
                    <span>儲存中...</span>
                    <div className="loading-spinner-container">

                        <FadeLoader
                            color="white"
                            height={12}
                            width={3}
                            radius={5}
                            margin={-4}
                        />
                       
                    </div>
                  
                  
                </div>
            ) : (
                children
            )}
        </button>
    );
};

export default LoadingButton;