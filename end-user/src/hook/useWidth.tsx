"use client";
import { useEffect, useState } from 'react';

export default function useWidth() {
    const [width, setWidth] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        // Jalankan pertama kali
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
}
