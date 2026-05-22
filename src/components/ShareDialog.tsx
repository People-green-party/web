"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Check, Link2 } from "lucide-react";

interface ShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
    image?: string;
    description?: string;
    type?: "news" | "video";
    language?: "en" | "hi";
}

const localTranslations = {
    en: {
        shareTitleNews: "Share this Article",
        shareTitleVideo: "Share this Video",
        copyLink: "Copy Link",
        copied: "Copied!",
        copy: "Copy",
        preview: "Preview",
        close: "Close",
        shareVia: "Share via social media"
    },
    hi: {
        shareTitleNews: "इस लेख को साझा करें",
        shareTitleVideo: "इस वीडियो को साझा करें",
        copyLink: "लिंक कॉपी करें",
        copied: "कॉपी किया गया!",
        copy: "कॉपी",
        preview: "पूर्वावलोकन",
        close: "बंद करें",
        shareVia: "सोशल मीडिया पर साझा करें"
    }
};

export const ShareDialog: React.FC<ShareDialogProps> = ({
    isOpen,
    onClose,
    url,
    title,
    image,
    description,
    type = "news",
    language = "en"
}) => {
    const [copied, setCopied] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const t = localTranslations[language === "hi" ? "hi" : "en"];

    useEffect(() => {
        if (isOpen) {
            // Slight delay to trigger animation
            const timer = setTimeout(() => setAnimateIn(true), 50);
            document.body.style.overflow = "hidden";
            return () => clearTimeout(timer);
        } else {
            setAnimateIn(false);
            // Wait for exit transition if any before unset
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    // Encoded text for sharing
    const shareText = encodeURIComponent(`${title}\n\n`);
    const shareUrl = encodeURIComponent(url);

    const shareLinks = {
        whatsapp: `https://api.whatsapp.com/send?text=${shareText}${shareUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
        telegram: `https://t.me/share/url?url=${shareUrl}&text=${shareText}`
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop with fade-in */}
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
                    animateIn ? "opacity-100" : "opacity-0"
                }`}
                onClick={onClose}
            ></div>

            {/* Modal Box with scale and slide-in */}
            <div
                className={`relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 ${
                    animateIn ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <h3 className="font-['Familjen_Grotesk'] font-bold text-xl md:text-2xl text-gray-900">
                        {type === "video" ? t.shareTitleVideo : t.shareTitleNews}
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors"
                        aria-label={t.close}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    {/* Visual Card Preview */}
                    {image && (
                        <div className="flex gap-4 p-4 bg-[#F4F7F5] border border-gray-100 rounded-2xl">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                                <img src={image} alt={title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-center min-w-0">
                                <span className="text-xs font-bold text-[#0D5229] uppercase tracking-wider mb-1">
                                    {type === "video" ? "Video" : "Article"}
                                </span>
                                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">
                                    {title}
                                </h4>
                                {description && (
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-light">
                                        {description}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Social Media Grid */}
                    <div className="space-y-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {t.shareVia}
                        </span>
                        <div className="grid grid-cols-4 gap-3">
                            {/* WhatsApp */}
                            <a
                                href={shareLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/50 hover:border-emerald-200 text-[#075E54] hover:scale-105 transition-all duration-300 group"
                            >
                                <svg
                                    className="w-7 h-7 fill-current group-hover:rotate-6 transition-transform"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.858.002-2.634-1.023-5.11-2.884-6.974C16.59 1.867 14.12 .84 11.49.84c-5.43 0-9.855 4.42-9.86 9.86-.001 1.745.474 3.447 1.378 4.947l-.99 3.616 3.7.971h.001-.002zm12.336-6.195c-.328-.164-1.942-.959-2.242-1.069-.3-.11-.518-.164-.736.164-.218.327-.844 1.069-1.036 1.288-.192.218-.383.245-.71.082-.328-.164-1.383-.509-2.637-1.627-.976-.87-1.635-1.946-1.826-2.273-.192-.328-.021-.505.143-.668.148-.147.328-.382.492-.573.164-.191.218-.328.328-.546.11-.219.055-.41-.027-.573-.082-.164-.736-1.775-1.009-2.43-.267-.64-.539-.554-.736-.564-.191-.01-.41-.01-.628-.01-.218 0-.573.082-.873.41-.3.327-1.146 1.12-1.146 2.73 0 1.61 1.173 3.166 1.336 3.385.164.218 2.307 3.524 5.59 4.945.78.337 1.39.54 1.86.689.784.249 1.498.214 2.062.13.629-.094 1.942-.793 2.216-1.558.273-.765.273-1.42.191-1.557-.081-.137-.3-.218-.628-.382z" />
                                </svg>
                                <span className="text-[11px] font-semibold mt-2 text-[#075E54]">WhatsApp</span>
                            </a>

                            {/* X / Twitter */}
                            <a
                                href={shareLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 text-gray-900 hover:scale-105 transition-all duration-300 group"
                            >
                                <svg
                                    className="w-6 h-6 fill-current group-hover:rotate-6 transition-transform"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                                <span className="text-[11px] font-semibold mt-3 text-gray-700">X</span>
                            </a>

                            {/* Facebook */}
                            <a
                                href={shareLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-100/50 hover:border-blue-200 text-[#1877F2] hover:scale-105 transition-all duration-300 group"
                            >
                                <svg
                                    className="w-7 h-7 fill-current group-hover:rotate-6 transition-transform"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                                <span className="text-[11px] font-semibold mt-2 text-[#1877F2]">Facebook</span>
                            </a>

                            {/* Telegram */}
                            <a
                                href={shareLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-100/50 hover:border-sky-200 text-[#0088cc] hover:scale-105 transition-all duration-300 group"
                            >
                                <svg
                                    className="w-7 h-7 fill-current group-hover:rotate-6 transition-transform"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.6 1.5-1.55 2.76-2.9 2.88-3.05.03-.04.05-.13-.01-.18s-.16-.03-.23-.01c-.1.02-1.69 1.07-4.77 3.15-.45.31-.86.46-1.23.45-.41-.01-1.2-.23-1.78-.42-.72-.23-1.29-.35-1.24-.74.03-.2.3-.4.81-.6 3.17-1.38 5.28-2.29 6.34-2.73 3.01-1.26 3.63-1.48 4.04-1.48.09 0 .29.02.42.13.11.09.14.22.15.31-.01.06 0 .14-.01.21z" />
                                </svg>
                                <span className="text-[11px] font-semibold mt-2 text-[#0088cc]">Telegram</span>
                            </a>
                        </div>
                    </div>

                    {/* Copy Link Input Section */}
                    <div className="space-y-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            {t.copyLink}
                        </span>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 flex-grow bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl px-4 py-3 min-w-0 transition-colors">
                                <Link2 size={18} className="text-gray-400 shrink-0" />
                                <input
                                    type="text"
                                    value={url}
                                    readOnly
                                    className="bg-transparent text-sm text-gray-600 outline-none w-full select-all font-light"
                                />
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold border transition-all duration-300 shadow-sm ${
                                    copied
                                        ? "bg-emerald-500 hover:bg-emerald-600 border-emerald-500 text-white"
                                        : "bg-white hover:bg-gray-50 border-gray-200 text-[#0D5229] hover:text-[#04330B]"
                                }`}
                            >
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                <span className="hidden sm:inline">{copied ? t.copied : t.copy}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
