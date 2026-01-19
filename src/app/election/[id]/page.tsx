"use client";

import React, { useState, useMemo } from 'react';
import {
    Clock,
    Calendar,
    Users,
    Search,
    ChevronDown,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    UserX
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { Navbar } from '../../../components/Navbar';
import { LanguageProvider, useLanguage } from '../../../components/LanguageContext';
import { ConfirmVotesModal, VerifyMobileModal, VotingSuccessModal } from './VotingModals';
import { RequireAuth } from '../../components/RequireAuth';
import { fetchApi } from '../../../lib/api';

// --- Types ---
interface Candidate {
    id: string;
    name: { en: string; hi: string };
    role: { en: string; hi: string };
    image: string | null; // null for NOTA
    selected: boolean;
    ageGroup: string;
    region: string;
    gender: string;
    isNota: boolean;
}

// --- Static Filter Options ---
const AGE_GROUPS: string[] = ["18-25", "26-35", "36-45", "46-60", "60+"];
const REGIONS: string[] = ["North", "South", "East", "West", "Central"];
const GENDERS: string[] = ["Male", "Female", "Other"];

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
        submit: "Submit",
        notaSubtitle: "Submit without selecting any candidate",
        prev: "Prev",
        next: "Next",
        noResults: "No candidates found matching your criteria."
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
        submit: "जमा करें",
        notaSubtitle: "किसी भी उम्मीदवार का चयन किए बिना जमा करें",
        prev: "पिछला",
        next: "अगला",
        noResults: "आपकी खोज के अनुसार कोई उम्मीदवार नहीं मिला।"
    }
};

// --- Filter Bar Component ---
interface FilterBarProps {
    searchQuery: string;
    setSearchQuery: (s: string) => void;
    ageFilter: string;
    setAgeFilter: (s: string) => void;
    regionFilter: string;
    setRegionFilter: (s: string) => void;
    genderFilter: string;
    setGenderFilter: (s: string) => void;
}

const FilterBar = ({ searchQuery, setSearchQuery, ageFilter, setAgeFilter, regionFilter, setRegionFilter, genderFilter, setGenderFilter }: FilterBarProps) => {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.en;

    return (
        <div className="w-full max-w-[1320px] flex flex-col lg:flex-row gap-[16px]">
            {/* Search */}
            <div className="w-full lg:w-[576px] h-[46px] relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full h-full rounded-[8px] border border-[#B9D3C4] bg-white pt-[12px] pr-[16px] pb-[12px] pl-[16px] text-[#587E67] text-[16px] leading-[22px] font-['Familjen_Grotesk'] font-semibold focus:outline-none placeholder-[#587E67] focus:border-[#04330B] transition-colors"
                />
            </div>

            {/* Dropdowns */}
            <div className="flex flex-col lg:flex-row gap-[16px] w-full lg:w-auto">
                <div className="w-full lg:w-[232px] h-[46px] relative">
                    <select
                        value={ageFilter}
                        onChange={(e) => setAgeFilter(e.target.value)}
                        className="w-full h-full rounded-[8px] border border-[#B9D3C4] bg-white appearance-none px-[16px] text-[#587E67] text-[16px] font-['Familjen_Grotesk'] font-semibold focus:outline-none cursor-pointer focus:border-[#04330B]"
                    >
                        <option value="">{t.ageGroup}</option>
                        {AGE_GROUPS.map((g: string) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#587E67] pointer-events-none" />
                </div>

                <div className="w-full lg:w-[232px] h-[46px] relative">
                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="w-full h-full rounded-[8px] border border-[#B9D3C4] bg-white appearance-none px-[16px] text-[#587E67] text-[16px] font-['Familjen_Grotesk'] font-semibold focus:outline-none cursor-pointer focus:border-[#04330B]"
                    >
                        <option value="">{t.region}</option>
                        {REGIONS.map((r: string) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#587E67] pointer-events-none" />
                </div>

                <div className="w-full lg:w-[232px] h-[46px] relative">
                    <select
                        value={genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        className="w-full h-full rounded-[8px] border border-[#B9D3C4] bg-white appearance-none px-[16px] text-[#587E67] text-[16px] font-['Familjen_Grotesk'] font-semibold focus:outline-none cursor-pointer focus:border-[#04330B]"
                    >
                        <option value="">{t.gender}</option>
                        {GENDERS.map((g: string) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown className="absolute right-[16px] top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#587E67] pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

// --- Candidate Card Component ---
const CandidateCard = ({ candidate, onToggle }: { candidate: Candidate, onToggle: (id: string) => void }) => {
    const { language } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.en;
    const safeLang = (language === 'hi' || language === 'en') ? (language as 'en' | 'hi') : 'en';

    // NOTA Card
    if (candidate.isNota) {
        return (
            <div
                onClick={() => onToggle(candidate.id)}
                className={`relative w-[208px] h-[252px] rounded-[8px] bg-white p-[12px] flex flex-col items-center justify-center gap-[12px] transition-all cursor-pointer group
                ${candidate.selected
                        ? 'border border-[#0D5229] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]'
                        : 'border border-[#E4F2EA] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] hover:border-[#B9D3C4]'}`}
            >
                <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center border-2 transition-colors
                    ${candidate.selected ? 'bg-[#0D5229] border-[#0D5229]' : 'bg-gray-50 border-[#B9D3C4] group-hover:border-[#0D5229]'}`}>
                    <UserX size={40} className={candidate.selected ? 'text-white' : 'text-[#587E67] group-hover:text-[#0D5229]'} />
                </div>
                <div className="text-center flex flex-col items-center justify-center w-full px-1">
                    <h3 className={`font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px]
                        ${candidate.selected ? 'text-[#0D5229]' : 'text-[#04330B]'}`}>
                        None of the Above
                    </h3>
                    <span className={`font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] mb-2
                        ${candidate.selected ? 'text-[#0D5229]' : 'text-[#04330B]'}`}>
                        (NOTA)
                    </span>
                    <p className="text-[12px] text-[#587E67] leading-4 text-center max-w-[150px]">
                        {t.notaSubtitle}
                    </p>
                </div>

                {/* Selection Checkbox for NOTA */}
                <div
                    className={`absolute top-[12px] right-[12px] w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-all
                    ${candidate.selected
                            ? 'bg-[#0D5229]'
                            : 'bg-white border border-[#B9D3C4] group-hover:border-[#0D5229]'
                        }`}
                >
                    {candidate.selected && <Check className="w-[18px] h-[18px] text-white" strokeWidth={4} />}
                </div>
            </div>
        );
    }

    // Standard Candidate Card
    const hasImage = !!candidate.image;

    return (
        <div
            className={`relative w-[208px] h-[252px] rounded-[8px] bg-white p-[12px] flex flex-col gap-[4px] transition-all
            ${candidate.selected
                    ? 'border border-[#0D5229] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]'
                    : 'border border-[#E4F2EA] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] hover:border-[#B9D3C4]'}`}
        >
            {/* Image Container 184x184 */}
            <div className="relative w-[184px] h-[184px] rounded-[8px] overflow-hidden shrink-0 bg-gray-100">
                {hasImage ? (
                    <img
                        src={candidate.image as string}
                        alt={candidate.name[safeLang]}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[18px]">
                        {candidate.name[safeLang].charAt(0)}
                    </div>
                )}

                {/* L-Curve Cutout Mask */}
                <div className="absolute top-0 right-0 w-[44px] h-[44px] bg-white rounded-bl-[44px] z-10" />

                {/* Selection Checkbox */}
                <button
                    onClick={() => onToggle(candidate.id)}
                    className={`absolute top-0 right-0 w-[28px] h-[28px] rounded-[8px] flex items-center justify-center transition-all z-20
                    ${candidate.selected
                            ? 'bg-[#0D5229] p-[8px]'
                            : 'bg-white border border-[#B9D3C4] hover:bg-gray-50'
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
    const safeLang = (language === 'hi' || language === 'en') ? (language as 'en' | 'hi') : 'en';

    const count = selectedCandidates.length;
    const max = 21;

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
                {count === 0 ? (
                    <div className="flex flex-col h-full items-center justify-center p-4">
                        <p className="font-['Familjen_Grotesk'] font-semibold text-[16px] leading-[22px] tracking-[-0.3px] text-center text-[#587E67] max-w-[344px]">
                            You haven’t selected anyone yet. Choose your preferred candidates to continue.
                        </p>
                    </div>
                ) : (
                    selectedCandidates.map(candidate => (
                        candidate.isNota ? (
                            <div key={candidate.id} className="flex items-center justify-between shrink-0 bg-gray-50 p-2 rounded">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#EAF7EE] flex items-center justify-center">
                                        <UserX size={20} className="text-[#0D5229]" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-bold text-[#04330B] font-['Familjen_Grotesk']">None of the Above</p>
                                        <p className="text-xs text-[#587E67] font-['Familjen_Grotesk']">(NOTA)</p>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(candidate.id)} className="text-[#587E67] hover:text-red-500 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        ) : (
                            <div key={candidate.id} className="flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3">
                                    <img src={candidate.image!} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                                    <div>
                                        <p className="text-sm font-bold text-[#04330B] font-['Familjen_Grotesk']">{candidate.name[safeLang]}</p>
                                        <p className="text-xs text-[#587E67] font-['Familjen_Grotesk']">{candidate.role[safeLang]}</p>
                                    </div>
                                </div>
                                <button onClick={() => onRemove(candidate.id)} className="text-[#587E67] hover:text-red-500 transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        )
                    ))
                )}
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
    const { language, t: navT } = useLanguage();
    const t = translations[language as keyof typeof translations] || translations.en;
    const safeLang = (language === 'hi' || language === 'en') ? (language as 'en' | 'hi') : 'en';

    const params = useParams<{ id: string }>();
    const electionId = params?.id;

    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [votingState, setVotingState] = useState<'selection' | 'confirm' | 'verify' | 'success'>('selection');
    const [isLoading, setIsLoading] = useState(true);

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [ageFilter, setAgeFilter] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 4 columns x 3 rows ideally

    // --- Effects ---
    React.useEffect(() => {
        let cancelled = false;

        const loadCandidates = async () => {
            if (!electionId) {
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const res: any = await fetchApi(`elections/${electionId}`);
                const apiCandidates = Array.isArray(res?.candidates) ? res.candidates : [];

                const mapped: Candidate[] = apiCandidates.map((c: any) => ({
                    id: String(c.user?.id ?? c.id),
                    name: { en: c.user?.name ?? '', hi: c.user?.name ?? '' },
                    role: { en: '', hi: '' },
                    image: null,
                    selected: false,
                    ageGroup: '',
                    region: '',
                    gender: '',
                    isNota: false,
                }));

                const withNota: Candidate[] = [
                    ...mapped,
                    {
                        id: 'nota',
                        name: { en: 'None of the Above (NOTA)', hi: 'इनमें से कोई नहीं (NOTA)' },
                        role: { en: '', hi: '' },
                        image: null,
                        selected: false,
                        ageGroup: '',
                        region: '',
                        gender: '',
                        isNota: true,
                    },
                ];

                if (!cancelled) {
                    setCandidates(withNota);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Failed to load election candidates:', err);
                if (!cancelled) {
                    setCandidates([]);
                    setIsLoading(false);
                }
            }
        };

        loadCandidates();

        return () => {
            cancelled = true;
        };
    }, [electionId]);

    // --- Logic ---

    // 1. Filtering Logic (Memoized)
    const filteredCandidates = useMemo(() => {
        if (isLoading) return [];

        return candidates.filter(c => {
            // NOTA is always included in the list, typically at the end. 
            // However, filters usually shouldn't hide NOTA unless we decide so.
            // But if I search "Ram", NOTA shouldn't show up usually, unless search is empty.
            // Let's apply filters to NOTA too? 
            // Better: Apply filters to standard candidates, and ALWAYS append NOTA if it matches filters or just keep it at the end of the full list?
            // The requirement says NOTA is the "last profile". 
            // If I filter by "Female", NOTA isn't female. 
            // Let's exclude NOTA from standard filters except maybe search if it matches "Select None" etc.
            // Actually, simpler: Treat NOTA as a candidate. If queries don't match it, it disappears.
            // BUT user said "sabse last wali profile None Of The Obove ...". This usually implies on the last page of the ENTIRE list selection.
            // If I filter, the list shrinks. NOTA should probably stick around or be filtered like others.
            // Let's filter it normally. So searching "Ram" hides NOTA.

            if (c.isNota) return true; // Keep NOTA always? Or filterable? 
            // If I keep NOTA always, it might look weird if I search "Ram" and get "Ram" and "NOTA".
            // Let's filter NOTA based on search too (e.g. if user searches "None").

            // Search Query Logic (Prefix ignore)
            if (searchQuery) {
                const q = searchQuery.toLowerCase().trim();
                const nameEn = c.name.en.toLowerCase();
                // Remove prefixes for checking start
                const cleanName = nameEn.replace(/^(dr\.|mr\.|mrs\.|ms\.|prof\.)\s*/, '');

                // Matches if: full name includes query OR clean name starts with query
                const matchesName = nameEn.includes(q) || cleanName.startsWith(q);
                if (!matchesName) return false;
            }

            if (ageFilter && c.ageGroup !== ageFilter) return false;
            if (regionFilter && c.region !== regionFilter) return false;
            if (genderFilter && c.gender !== genderFilter) return false;

            return true;
        });
    }, [candidates, searchQuery, ageFilter, regionFilter, genderFilter, isLoading]);

    // 2. Pagination Logic
    const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

    const paginatedCandidates = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredCandidates.slice(start, start + itemsPerPage);
    }, [filteredCandidates, currentPage]);

    // Reset to page 1 if filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, ageFilter, regionFilter, genderFilter]);

    // Toggle Handler
    const toggleCandidate = (id: string) => {
        setCandidates(prev => {
            const candidate = prev.find(c => c.id === id);
            if (!candidate) return prev;

            // If selecting NOTA, deselect everyone else
            if (candidate.isNota && !candidate.selected) {
                return prev.map(c => c.id === id ? { ...c, selected: true } : { ...c, selected: false });
            }

            // If selecting a normal candidate, deselect NOTA if it was selected
            // Also enforce max 21 limit
            if (!candidate.isNota && !candidate.selected) {
                const currentCount = prev.filter(c => c.selected && !c.isNota).length;
                if (currentCount >= 21) {
                    alert("You can only select up to 21 candidates.");
                    return prev;
                }
                return prev.map(c => {
                    if (c.id === id) return { ...c, selected: true };
                    if (c.isNota) return { ...c, selected: false }; // deselect NOTA
                    return c;
                });
            }

            // Deselecting logic
            return prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c);
        });
    };

    const selectedCandidates = candidates.filter(c => c.selected);

    const dashboardLinks = [
        { name: navT.nav.dashboard, href: '/dashboard' },
        { name: navT.nav.election, href: '/election' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">
                <Navbar links={dashboardLinks} showAuthButtons={false} showProfileButton={true} isDashboard={true} />
                <main className="w-full flex flex-col items-center pt-[104px] pb-[60px] px-4 lg:px-0">
                    <div className="w-full max-w-[1320px] flex items-center justify-center h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C36]"></div>
                    </div>
                </main>
            </div>
        );
    }

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
                        <div className="flex items-center gap-[8px] text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px]">
                            <Clock size={18} />
                            <span>{t.date}</span>
                        </div>
                        <div className="w-[6px] h-[6px] rounded-full bg-[#587E67] hidden md:block" />
                        <div className="flex items-center gap-[8px] text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px]">
                            <Calendar size={18} />
                            <span>{t.timeRemaining}</span>
                        </div>
                        <div className="w-[6px] h-[6px] rounded-full bg-[#587E67] hidden md:block" />
                        <div className="flex items-center gap-[8px] text-[#587E67] font-['Familjen_Grotesk'] font-semibold text-[14px] lg:text-[16px]">
                            <Users size={18} />
                            <span>{filteredCandidates.length} potential candidates</span>
                        </div>
                    </div>
                </div>

                <div className="h-[28px]" />

                <div className="w-full max-w-[1320px] flex flex-col gap-[16px]">
                    <FilterBar
                        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                        ageFilter={ageFilter} setAgeFilter={setAgeFilter}
                        regionFilter={regionFilter} setRegionFilter={setRegionFilter}
                        genderFilter={genderFilter} setGenderFilter={setGenderFilter}
                    />

                    <div className="w-full flex flex-col lg:flex-row gap-[16px]">
                        {/* Candidates Grid */}
                        <div className="w-full lg:w-[904px]">
                            {paginatedCandidates.length === 0 ? (
                                <div className="w-full p-8 text-center text-[#587E67] font-semibold bg-gray-50 rounded-lg border border-[#E4F2EA]">
                                    {t.noResults}
                                </div>
                            ) : (
                                <div className="flex flex-wrap justify-center lg:justify-start gap-[16px]">
                                    {paginatedCandidates.map(candidate => (
                                        <CandidateCard
                                            key={candidate.id}
                                            candidate={candidate}
                                            onToggle={toggleCandidate}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-10 flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>

                                    {/* Smart Pagination Dots logic could be here, but simple listing for now */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        // Show pages around current
                                        let p = i + 1;
                                        if (totalPages > 5) {
                                            if (currentPage > 3) p = currentPage - 2 + i;
                                            if (p > totalPages) p = totalPages - (4 - i);
                                        }
                                        return p;
                                    }).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors border
                                                ${currentPage === p
                                                    ? 'bg-[#E8F3EF] text-[#04330B] font-bold border-[#0D5229]'
                                                    : 'text-gray-500 hover:bg-gray-50 font-medium border-gray-200'}`}
                                        >
                                            {p}
                                        </button>
                                    ))}

                                    {totalPages > 5 && currentPage < totalPages - 2 && <span className="text-gray-400 px-1">...</span>}
                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium rounded text-sm border border-gray-200"
                                        >
                                            {totalPages}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-700 disabled:opacity-50"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Selected Sidebar */}
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
