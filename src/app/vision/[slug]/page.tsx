"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VisionRedirectPage() {
    const { slug } = useParams();
    const router = useRouter();
    const slugStr = (Array.isArray(slug) ? slug[0] : slug) || '';
    const cleanSlug = slugStr.toLowerCase().trim();

    useEffect(() => {
        let targetPage = '';

        if (cleanSlug.includes('entrepreneur') || cleanSlug.includes('youth') || cleanSlug.includes('job') || cleanSlug.includes('employment') || cleanSlug.includes('yuva') || cleanSlug.includes('rojgar')) {
            targetPage = 'entrepreneurship';
        } else if (cleanSlug.includes('farm') || cleanSlug.includes('agri') || cleanSlug.includes('kisan') || cleanSlug.includes('kheti') || cleanSlug.includes('new-farming')) {
            targetPage = 'farming';
        } else if (cleanSlug.includes('women') || cleanSlug.includes('safe') || cleanSlug.includes('empower') || cleanSlug.includes('mahila')) {
            targetPage = 'empowerment';
        } else if (cleanSlug.includes('urban') || cleanSlug.includes('rural') || cleanSlug.includes('develop') || cleanSlug.includes('vikas')) {
            targetPage = 'urban-rural';
        } else if (cleanSlug.includes('civil') || cleanSlug.includes('libert') || cleanSlug.includes('bhy') || cleanSlug.includes('culture') || cleanSlug.includes('heritage') || cleanSlug.includes('virasat')) {
            targetPage = 'civil-liberties';
        } else if (cleanSlug.includes('econom') || cleanSlug.includes('global') || cleanSlug.includes('market') || cleanSlug.includes('arth') || cleanSlug.includes('open')) {
            targetPage = 'open-economy';
        } else if (cleanSlug.includes('living') || cleanSlug.includes('standard') || cleanSlug.includes('health') || cleanSlug.includes('tary') || cleanSlug.includes('digit') || cleanSlug.includes('educat') || cleanSlug.includes('shiksha')) {
            targetPage = 'living-standards';
        } else if (cleanSlug.includes('nature') || cleanSlug.includes('green') || cleanSlug.includes('populat') || cleanSlug.includes('conserv') || cleanSlug.includes('jansankhya') || cleanSlug.includes('prakriti') || cleanSlug.includes('energy') || cleanSlug.includes('sustain')) {
            targetPage = 'nature';
        }

        if (targetPage) {
            router.replace(`/vision/${targetPage}`);
        }
    }, [cleanSlug, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
    );
}