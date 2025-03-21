import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoading } from "@/app/contexts/LoadingContext.js";


const useAuthLoading = () => {
    const { isAuthLoading } = useSelector((state) => state.user);
    const { setIsLoading } = useLoading();

    useEffect(() => {
        let timeout;
     
        if (isAuthLoading) {
            setIsLoading(true);
            
        } else {
            timeout = setTimeout(() => setIsLoading(false), 500);
        }

        

        return () => clearTimeout(timeout);
    }, [isAuthLoading, setIsLoading]);

    
};

export default useAuthLoading;
