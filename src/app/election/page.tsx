"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { LanguageProvider, useLanguage } from '../../components/LanguageContext';
import { fetchApi } from '../../lib/api';
import { RequireAuth } from '../components/RequireAuth';

// --- Table Component ---
const ElectionTable = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadElections = async () => {
            try {
                setError(null);
                const result = await fetchApi('elections');
                const formatted = result.map((e: any) => ({
                    id: e.id,
                    name: e.position,
                    candidates: "N/A",
                    start: new Date(e.openedAt).toLocaleDateString('en-GB').replace(/\//g, '-'),
                    end: e.closedAt ? new Date(e.closedAt).toLocaleDateString('en-GB').replace(/\//g, '-') : t.election.table.ongoing,
                    status: e.status,
                    vote: false
                }));
                setData(formatted);
            } catch (err: any) {
                console.error("Failed to fetch elections:", err);
                setError('Failed to load elections. Please try again later.');
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        loadElections();
    }, [t]);

    if (loading) {
        return <div className="w-full text-center py-8 text-[#587E67]">Loading elections...</div>;
    }

    if (error) {
        return <div className="w-full text-center py-8 text-red-600">{error}</div>;
    }

    return (

        <div className="w-full">
            {/* Desktop View (Table) */}
            <div className="hidden lg:flex flex-col gap-[20px] rounded-[8px] border border-[#B9D3C4] overflow-hidden overflow-x-auto">
                <div className="min-w-[1000px]">
                    {/* Header Row */}
                    <div className="w-full h-[64px] flex items-center px-[24px] py-[20px] border-b border-[#B9D3C4] bg-white gap-[67.67px]">
                        <div style={{ width: '38px' }} className="shrink-0 font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                            {t.election.table.sno}
                        </div>
                        <div style={{ flex: 1 }} className="font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                            {t.election.table.name}
                        </div>
                        <div className="w-[120px] text-center font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                            {t.election.table.candidates}
                        </div>
                        <div className="w-[140px] font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                            {t.election.table.startDate}
                        </div>
                        <div className="w-[140px] font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                            {t.election.table.endDate}
                        </div>
                        <div className="w-[100px] font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                            {t.election.table.status}
                        </div>
                        <div className="w-[120px] font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67]">
                            {t.election.table.vote}
                        </div>
                    </div>

                    {/* Rows Container */}
                    <div className="flex flex-col w-full px-[8px] pb-[20px] gap-[12px]">
                        {data.map((row, idx) => (
                            <div
                                key={idx}
                                onClick={() => router.push(`/election/${row.id}`)}
                                className={`w-full h-[54px] flex items-center px-[16px] rounded-[8px] border border-transparent hover:border-[#B9D3C4] transition-all group bg-transparent gap-[66.33px] cursor-pointer`}
                            >
                                <div style={{ width: '46px' }} className="shrink-0 font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] group-hover:text-[#04330B] transition-colors">
                                    {idx + 1}
                                </div>
                                <div style={{ flex: 1 }} className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] group-hover:text-[#04330B] transition-colors">
                                    {row.name}
                                </div>
                                <div className="w-[120px] text-center font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] group-hover:text-[#04330B] transition-colors">
                                    {row.candidates}
                                </div>
                                <div className="w-[140px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] group-hover:text-[#04330B] transition-colors">
                                    {row.start}
                                </div>
                                <div className="w-[140px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] group-hover:text-[#04330B] transition-colors">
                                    {row.end}
                                </div>
                                <div className="w-[100px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] group-hover:text-[#04330B] transition-colors">
                                    {row.status}
                                </div>
                                <div className="w-[120px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67] group-hover:text-[#04330B] transition-colors">
                                    {row.vote ? t.election.table.voted : t.election.table.notVoted}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile View (Vertical Cards) */}
            <div className="flex lg:hidden flex-col gap-[16px] w-full px-4">
                {data.map((row, idx) => (
                    <div
                        key={idx}
                        onClick={() => router.push(`/election/${row.id}`)}
                        className="w-full bg-white rounded-[8px] border border-[#B9D3C4] p-[16px] flex flex-col gap-[12px] shadow-sm active:scale-[0.98] transition-transform"
                    >
                        <div className="flex justify-between items-start border-b border-[#E4F2EA] pb-[12px]">
                            <div className="flex flex-col gap-[4px]">
                                <span className="text-[12px] font-bold text-[#587E67] uppercase tracking-wider">{t.election.table.name}</span>
                                <span className="text-[18px] font-bold text-[#04330B] font-['Familjen_Grotesk']">{row.name}</span>
                            </div>
                            <span className="bg-[#EAF7EE] text-[#0D5229] text-[12px] font-bold px-2 py-1 rounded">
                                #{idx + 1}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-[12px] gap-x-[8px]">
                            <div className="flex flex-col">
                                <span className="text-[12px] font-semibold text-[#587E67]">{t.election.table.candidates}</span>
                                <span className="text-[14px] font-medium text-[#04330B]">{row.candidates}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-semibold text-[#587E67]">{t.election.table.status}</span>
                                <span className="text-[14px] font-medium text-[#04330B]">{row.status}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-semibold text-[#587E67]">{t.election.table.startDate}</span>
                                <span className="text-[14px] font-medium text-[#04330B]">{row.start}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[12px] font-semibold text-[#587E67]">{t.election.table.endDate}</span>
                                <span className="text-[14px] font-medium text-[#04330B]">{row.end}</span>
                            </div>
                        </div>

                        <div className={`mt-[4px] w-full py-2 text-center rounded text-[14px] font-bold ${row.vote ? 'bg-[#EAF7EE] text-[#0D5229]' : 'bg-gray-100 text-gray-500'}`}>
                            {row.vote ? t.election.table.voted : t.election.table.notVoted}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Page Component ---
const ElectionPageContent = () => {
    const { t } = useLanguage();
    const [isYearOpen, setIsYearOpen] = React.useState(false);
    const [selectedYear, setSelectedYear] = React.useState<number | null>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

    const dashboardLinks = [
        { name: t.nav.dashboard, href: '/dashboard' },
        { name: t.nav.election, href: '/election' }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 pt-[104px] overflow-x-hidden">
            <Navbar links={dashboardLinks} showAuthButtons={false} showProfileButton={true} isDashboard={true} />

            <main className="max-w-[1320px] mx-auto px-4 lg:px-0">

                {/* HERO SECTION (Matches Home Page Layout exactly) */}
                <section className="w-full flex justify-center mt-[12px]">
                    <div className="w-full relative flex flex-col lg:flex-row gap-4 lg:gap-0">

                        {/* Header Text - Left Column */}
                        <div className="flex flex-col w-full lg:w-[703px] shrink-0 lg:justify-between">
                            <div className="flex flex-col gap-[12px] lg:gap-[16px] w-full mb-[24px] lg:mb-0">
                                <h1 className="font-['Familjen_Grotesk'] font-semibold text-[32px] md:text-[40px] lg:text-[64px] leading-[1.1] lg:leading-[72px] tracking-[-0.3px] text-[#04330B]">
                                    {t.election.title}
                                </h1>
                                <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] lg:text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] max-w-[476px]">
                                    {t.election.subtitle}
                                </p>
                            </div>

                            <div className="w-full h-[200px] lg:h-[342px] rounded-[8px] overflow-hidden bg-gray-100">
                                <img src="/herosection/hero1.svg" alt="Hero 1" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="hidden lg:block w-[34px] shrink-0"></div>

                        {/* Middle Column Images */}
                        <div className="flex flex-col w-full lg:w-[291px] shrink-0 gap-[16px] lg:gap-[24px] mt-[16px] lg:mt-0">
                            <div className="w-full h-[200px] lg:h-[256px] rounded-[8px] overflow-hidden bg-gray-100">
                                <img src="/herosection/hero2.svg" alt="Hero 2" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-[200px] lg:h-[222px] rounded-[8px] overflow-hidden bg-gray-100 hidden lg:block">
                                <img src="/herosection/hero3.svg" alt="Hero 3" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="hidden lg:block w-[24px] shrink-0"></div>

                        {/* Right Column Images */}
                        <div className="flex flex-col w-full lg:w-[278px] shrink-0 gap-[24px] mt-[16px] lg:mt-0 hidden lg:flex">
                            <div className="w-full h-[230px] rounded-[8px] overflow-hidden bg-gray-100">
                                <img src="/herosection/hero4.svg" alt="Hero 4" className="w-full h-full object-cover" />
                            </div>
                            <div className="w-full h-[246px] rounded-[8px] overflow-hidden bg-gray-100">
                                <img src="/herosection/hero5.svg" alt="Hero 5" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Election Table Section */}
                <section className="mt-[60px] lg:mt-[120px] w-full max-w-[1320px] mx-auto flex flex-col">
                    {/* Header Texts */}
                    <div className="flex flex-col gap-[0px]">
                        <h2 className="font-['Familjen_Grotesk'] font-semibold text-[64px] leading-[72px] tracking-[-0.3px] text-[#04330B] mb-0 h-[72px] flex items-center">
                            {t.election.tableTitle}
                        </h2>
                        <p className="font-['Familjen_Grotesk'] font-semibold text-[20px] leading-[24px] tracking-[-0.3px] text-[#587E67] h-[24px] flex items-center">
                            {t.election.tableSubtitle}
                        </p>
                    </div>

                    {/* Gap 40px */}
                    <div className="h-[40px]" />

                    {/* Select Year Dropdown */}
                    <div className="relative w-[160px]">
                        <button
                            onClick={() => setIsYearOpen(!isYearOpen)}
                            className="w-full h-[46px] flex items-center justify-between px-[16px] py-[12px] rounded-[8px] border border-[#B9D3C4] bg-white group hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#587E67]">
                                {selectedYear || t.election.selectYear}
                            </span>
                            <ChevronDown size={20} className={`text-[#587E67] transition-transform ${isYearOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isYearOpen && (
                            <div className="absolute top-[50px] left-0 w-full max-h-[200px] overflow-y-auto bg-white border border-[#B9D3C4] rounded-[8px] shadow-lg z-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            setSelectedYear(year);
                                            setIsYearOpen(false);
                                        }}
                                        className="w-full text-left px-[16px] py-[8px] hover:bg-[#EAF7EE] text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[16px] transition-colors first:rounded-t-[8px] last:rounded-b-[8px]"
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Gap 40px */}
                    <div className="h-[40px]" />

                    <ElectionTable />
                </section>

                {/* Adding spacing before footer */}
                <div className="h-[60px]" />
            </main>

            <Footer />
        </div>
    );
};

export default function ElectionPage() {
    return (
        <RequireAuth>
            <LanguageProvider>
                <ElectionPageContent />
            </LanguageProvider>
        </RequireAuth>
    );
}
