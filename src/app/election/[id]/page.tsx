"use client";

import React, { useState } from 'react';
import {
    Clock,
    Calendar,
    Users,
    Search,
    ChevronDown,
    Check,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Navbar } from '../../../components/Navbar';
import { LanguageProvider, useLanguage } from '../../../components/LanguageContext';
import { ConfirmVotesModal, VerifyMobileModal, VotingSuccessModal } from './VotingModals';
import { RequireAuth } from '../../components/RequireAuth';

// --- Types ---
interface Candidate {
    id: string;
    name: { en: string; hi: string };
    role: { en: string; hi: string };
    image: string;
    selected: boolean;
}

// --- Mock Data ---
const initialCandidates: Candidate[] = [
    {
        id: '1',
        name: { en: 'Dr. Sudhanshu Sharma', hi: 'डॉ. सुधांशु शर्मा' },
        role: { en: 'President', hi: 'अध्यक्ष' },
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
        selected: true
    },
    {
        id: '2',
        name: { en: 'Savitri Roy', hi: 'सावित्री रॉय' },
        role: { en: 'Vice President', hi: 'उपाध्यक्ष' },
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        selected: false
    },
    {
        id: '3',
        name: { en: 'Ram Kumar', hi: 'राम कुमार' },
        role: { en: 'Secretary', hi: 'सचिव' },
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80',
        selected: false
    },
    {
        id: '4',
        name: { en: 'Alok Mathur', hi: 'आलोक माथुर' },
        role: { en: 'Chairperson', hi: 'सभापति' },
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        selected: true
    },
    {
        id: '5',
        name: { en: 'Sameer Shah', hi: 'समीर शाह' },
        role: { en: 'Legal Advisor', hi: 'कानूनी सलाहकार' },
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
        selected: true
    },
    {
        id: '6',
        name: { en: 'Yash Gupta', hi: 'यश गुप्ता' },
        role: { en: 'Treasurer', hi: 'कोषाध्यक्ष' },
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
        selected: false
    },
    {
        id: '7',
        name: { en: 'Mamta Pandey', hi: 'ममता पांडेय' },
        role: { en: 'Chief Spokesperson', hi: 'मुख्य प्रवक्ता' },
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
        selected: true
    },
    {
        id: '8',
        name: { en: 'Harsh Jaat', hi: 'हर्ष जाट' },
        role: { en: 'Convenor', hi: 'संयोजक' },
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
        selected: false
    },
    {
        id: '9',
        name: { en: 'Harsh Jaat', hi: 'हर्ष जाट' },
        role: { en: 'Convenor', hi: 'संयोजक' },
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        selected: false
    },
    {
        id: '10',
        name: { en: 'Harsh Jaat', hi: 'हर्ष जाट' },
        role: { en: 'Convenor', hi: 'संयोजक' },
        image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80',
        selected: false
    },
    {
        id: '11',
        name: { en: 'Harsh Jaat', hi: 'हर्ष जाट' },
        role: { en: 'Convenor', hi: 'संयोजक' },
        image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80',
        selected: false
    },
    {
        id: '12',
        name: { en: 'Harsh Jaat', hi: 'हर्ष जाट' },
        role: { en: 'Convenor', hi: 'संयोजक' },
        image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80',
        selected: false
    },
];

// --- Translations ---
const translations = {
    en: {
        election: "Election Name",
        date: "Nov 1 - Nov 15",
        timeRemaining: "5 days remaining",
        candidateCount: "300 candidates",
        searchPlaceholder: "Search by Name",
        ageGroup: "Age Group",
        region: "Region",
        gender: "Gender",
        selectedTitle: "Selected Candidates",
        selectedSubtitle: (max: number) => `You can select up to ${max} candidates.`,
        submit: "Submit"
    },
    hi: {
        election: "चुनाव का नाम",
        date: "1 नवंबर - 15 नवंबर",
        timeRemaining: "5 दिन शेष",
        candidateCount: "300 उम्मीदवार",
        searchPlaceholder: "नाम से खोजें",
        ageGroup: "आयु वर्ग",
        region: "क्षेत्र",
        gender: "लिंग",
        selectedTitle: "चयनित उम्मीदवार",
        selectedSubtitle: (max: number) => `आप ${max} उम्मीदवारों का चयन कर सकते हैं।`,
        submit: "जमा करें"
    }
};

// --- Filter Bar Component ---
const FilterBar = () => {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.en;

    return (
        <div className="w-full max-w-[1320px] flex flex-col lg:flex-row gap-[16px]">
            {/* Search - Width 576 or full on mobile */}
            <div className="w-full lg:w-[576px] h-[46px] relative">
                <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    className="w-full h-full rounded-[8px] border border-[#B9D3C4] bg-white pt-[12px] pr-[16px] pb-[12px] pl-[16px] text-[#587E67] text-[16px] leading-[22px] font-['Familjen_Grotesk'] font-semibold focus:outline-none placeholder-[#587E67]"
                />
            </div>

            {/* Dropdowns - Flex wrap on mobile */}
            <div className="flex flex-col lg:flex-row gap-[16px] w-full lg:w-auto">
                {[t.ageGroup, t.region, t.gender].map((placeholder) => (
                    <div key={placeholder} className="w-full lg:w-[232px] h-[46px] relative">
                        <select className="w-full h-full rounded-[8px] border border-[#B9D3C4] bg-white appearance-none pt-[12px] pr-[16px] pb-[12px] pl-[16px] text-[#587E67] text-[16px] leading-[22px] font-['Familjen_Grotesk'] font-semibold focus:outline-none cursor-pointer">
                            <option>{placeholder}</option>
                        </select>
                        <ChevronDown className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#587E67] pointer-events-none" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Candidate Card Component ---
const CandidateCard = ({ candidate, onToggle }: { candidate: Candidate, onToggle: (id: string) => void }) => {
    const { language } = useLanguage();
    // Safety check for language or defaulting
    const safeLang = (language === 'hi' || language === 'en') ? (language as 'en' | 'hi') : 'en';

    return (
        <div
            className={`relative w-[208px] h-[252px] rounded-[8px] bg-white p-[12px] flex flex-col gap-[4px] transition-all
            ${candidate.selected
                    ? 'border border-[#0D5229] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]'
                    : 'border border-[#E4F2EA] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] hover:border-[#B9D3C4]'}`}
        >
            {/* Image Container 184x184 */}
            <div className="relative w-[184px] h-[184px] rounded-[8px] overflow-hidden shrink-0">
                <img
                    src={candidate.image}
                    alt={candidate.name[safeLang]}
                    className="w-full h-full object-cover"
                />

                {/* L-Curve Cutout Mask - Smoother large curve */}
                <div className="absolute top-0 right-0 w-[44px] h-[44px] bg-white rounded-bl-[44px] z-10" />

                {/* Selection Checkbox */}
                <button
                    onClick={() => onToggle(candidate.id)}
                    className={`absolute top-0 right-0 w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-all z-20
                    ${candidate.selected
                            ? 'bg-[#0D5229] p-[8px]'
                            : 'bg-white border border-[#B9D3C4]'
                        }`}
                >
                    {candidate.selected && <Check className="w-full h-full text-white" strokeWidth={4} />}
                </button>
            </div>

            {/* Text Section 184x40 */}
            <div className="w-[184px] h-[40px] flex flex-col">
                <h3 className="w-[184px] h-[22px] font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-[#04330B] truncate">
                    {candidate.name[safeLang]}
                </h3>
                <p className="w-[184px] h-[18px] font-['Familjen_Grotesk'] font-semibold text-[14px] leading-[18px] tracking-[-0.3px] text-[#587E67] truncate">
                    {candidate.role[safeLang]}
                </p>
            </div>
        </div>
    );
};

// --- Selected Candidates Sidebar ---
const SelectedSidebar = ({ selectedCandidates, onRemove, onSubmit }: { selectedCandidates: Candidate[], onRemove: (id: string) => void, onSubmit: () => void }) => {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.en;

    const count = selectedCandidates.length;
    const max = 21; // From image text "up to 21 candidates"

    // Calculate width for progress bar (clamped 0-100%)
    const progressWidth = `${Math.min((count / max) * 100, 100)}%`;

    return (
        <div className="w-full lg:w-[392px] h-auto lg:h-[486px] pt-[16px] pr-[24px] pb-[24px] pl-[24px] rounded-[8px] bg-white border border-[#B9D3C4] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] sticky top-24 flex flex-col gap-[16px]">
            <div>
                <h2 className="text-[20px] leading-[24px] tracking-[-0.3px] font-semibold text-[#04330B] font-['Familjen_Grotesk'] mb-1">{t.selectedTitle}</h2>
                <p className="text-[14px] text-[#587E67] font-['Familjen_Grotesk'] font-medium">{t.selectedSubtitle(max)}</p>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-8 bg-[#C6E0D1] rounded-md overflow-hidden flex items-center shrink-0">
                <div className="absolute left-0 top-0 h-full bg-[#65A27F] transition-all duration-300" style={{ width: progressWidth }}></div>
                <span className={`relative z-10 pl-3 text-xs font-bold ${count > 0 ? 'text-white' : 'text-[#587E67]'}`}>
                    {count.toString().padStart(2, '0')}/{max}
                </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[12px] max-h-[300px] lg:max-h-none">
                {selectedCandidates.map(candidate => (
                    <div key={candidate.id} className="flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-3">
                            <img src={candidate.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                                <p className="text-sm font-bold text-[#04330B] font-['Familjen_Grotesk']">{candidate.name[language === 'hi' ? 'hi' : 'en']}</p>
                                <p className="text-xs text-[#587E67] font-['Familjen_Grotesk']">{candidate.role[language === 'hi' ? 'hi' : 'en']}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(candidate.id)}
                            className="text-[#587E67] hover:text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button
                onClick={onSubmit}
                disabled={count === 0}
                className={`w-full h-[46px] font-['Familjen_Grotesk'] font-semibold text-[16px] rounded-[8px] transition-colors shrink-0 
                    ${count > 0 ? 'bg-[#0F4C36] hover:bg-green-900 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
                {t.submit}
            </button>
        </div>
    );
};

// --- Main Page Component ---
const ElectionVotingContent = () => {
    const { language, t: navT } = useLanguage(); // navT is original context t if needed for Nav
    const t = translations[language as keyof typeof translations] || translations.en;

    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
    const [votingState, setVotingState] = useState<'selection' | 'confirm' | 'verify' | 'success'>('selection');

    const toggleCandidate = (id: string) => {
        setCandidates(prev => prev.map(c =>
            c.id === id ? { ...c, selected: !c.selected } : c
        ));
    };

    const selectedCandidates = candidates.filter(c => c.selected);

    const dashboardLinks = [
        { name: navT.nav.dashboard, href: '/dashboard' },
        { name: navT.nav.election, href: '/election' }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">
            <Navbar links={dashboardLinks} showAuthButtons={false} showProfileButton={true} isDashboard={true} />

            <main className="w-full flex flex-col items-center pt-[104px] pb-[60px] px-4 lg:px-0">

                {/* Header Section */}
                <div className="w-full max-w-[1320px] flex flex-col gap-[16px] px-0 lg:px-0">
                    <h1 className="w-full h-auto lg:w-[575px] lg:h-[72px] font-['Familjen_Grotesk'] font-semibold text-[32px] lg:text-[64px] leading-tight lg:leading-[72px] tracking-[-0.3px] text-[#04330B] whitespace-normal lg:whitespace-nowrap">
                        {t.election}
                    </h1>

                    <div className="flex flex-wrap items-center gap-[16px] h-auto lg:h-[24px]">
                        {/* Section 1 */}
                        <div className="flex items-center gap-[8px] text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px]">
                            <Clock size={18} />
                            <span>{t.date}</span>
                        </div>

                        {/* Dot Separator */}
                        <div className="w-[6px] h-[6px] rounded-full bg-[#587E67] hidden md:block" />

                        {/* Section 2 */}
                        <div className="flex items-center gap-[8px] text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px]">
                            <Calendar size={18} />
                            <span>{t.timeRemaining}</span>
                        </div>

                        {/* Dot Separator */}
                        <div className="w-[6px] h-[6px] rounded-full bg-[#587E67] hidden md:block" />

                        {/* Section 3 */}
                        <div className="flex items-center gap-[8px] text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px]">
                            <Users size={18} />
                            <span>{t.candidateCount}</span>
                        </div>
                    </div>
                </div>

                {/* Gap 28px */}
                <div className="h-[28px]" />

                {/* Big Section Content */}
                <div className="w-full max-w-[1320px] flex flex-col gap-[16px]">
                    <FilterBar />

                    {/* Main Grid */}
                    <div className="w-full flex flex-col lg:flex-row gap-[16px]">

                        {/* Left Column: Candidates Grid */}
                        <div className="w-full lg:w-[904px]">
                            <div className="flex flex-wrap justify-center lg:justify-start gap-[16px]">
                                {/* Assuming grid matches width approx, tweaked columns to fit 3 in 904px nicely ~290px each */}
                                {candidates.map(candidate => (
                                    <CandidateCard
                                        key={candidate.id}
                                        candidate={candidate}
                                        onToggle={toggleCandidate}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-10 flex items-center gap-2">
                                <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="w-8 h-8 flex items-center justify-center bg-[#E8F3EF] text-[#04330B] font-bold rounded text-sm">1</button>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium rounded text-sm border border-gray-200">2</button>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium rounded text-sm border border-gray-200">3</button>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium rounded text-sm border border-gray-200">4</button>
                                <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-700">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>


                        {/* Right Column: Selected Sidebar */}
                        <div className="w-full lg:w-[392px]">
                            <SelectedSidebar
                                selectedCandidates={selectedCandidates}
                                onRemove={toggleCandidate}
                                onSubmit={() => setVotingState('confirm')}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Voting Flow Modals */}
            {votingState === 'confirm' && (
                <ConfirmVotesModal
                    selectedCandidates={selectedCandidates}
                    onCancel={() => setVotingState('selection')}
                    onConfirm={() => setVotingState('verify')}
                />
            )}

            {votingState === 'verify' && (
                <VerifyMobileModal
                    onCancel={() => setVotingState('confirm')}
                    onVerify={() => setVotingState('success')}
                />
            )}

            {votingState === 'success' && (
                <VotingSuccessModal />
            )}
        </div>
    );
};

export default function ElectionVotingPage() {
    return (
        <RequireAuth>
            <LanguageProvider>
                <ElectionVotingContent />
            </LanguageProvider>
        </RequireAuth>
    );
}
