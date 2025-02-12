"use client";
import { useRouter } from 'next/navigation';



// function to navigate to a different page
export const useNavigation = () => {
    const router = useRouter();

    const navigate = (path) => {
        router.push(path);
    };

    return navigate;
};
