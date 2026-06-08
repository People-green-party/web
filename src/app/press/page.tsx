"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PressRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/news?tab=press");
    }, [router]);

    return (
        <div className="bg-[#F4F7F5] min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#0D5229] border-t-transparent animate-spin"></div>
                <p className="text-gray-500 font-['Familjen_Grotesk'] font-medium">Redirecting to Media Hub...</p>
            </div>
        </div>
    );
}
