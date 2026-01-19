"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Legacy demo page: simply redirect to the main election listing without any mock data.

export default function LegacyElectionPageRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/election');
    }, [router]);

    return null;
}