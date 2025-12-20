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
    ChevronRight,
    User
} from 'lucide-react';

// --- Types ---
interface Candidate {
    id: string;
    name: string;
    role: string;
    image: string;
    selected: boolean;
}

// --- Mock Data ---
const initialCandidates: Candidate[] = [
    { id: '1', name: 'Dr. Sudhanshu Sharma', role: 'President', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80', selected: true },
    { id: '2', name: 'Savitri Roy', role: 'Vice President', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', selected: false },
    { id: '3', name: 'Ram Kumar', role: 'Secretary', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&q=80', selected: false },
    { id: '4', name: 'Alok Mathur', role: 'Chairperson', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80', selected: true },
    { id: '5', name: 'Sameer Shah', role: 'Legal Advisor', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80', selected: true },
    { id: '6', name: 'Yash Gupta', role: 'Treasurer', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', selected: false },
    { id: '7', name: 'Mamta Pandey', role: 'Chief Spokesperson', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', selected: true },
    { id: '8', name: 'Harsh Jaat', role: 'Convenor', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', selected: false },
    { id: '9', name: 'Harsh Jaat', role: 'Convenor', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', selected: false },
    { id: '10', name: 'Harsh Jaat', role: 'Convenor', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&q=80', selected: false },
    { id: '11', name: 'Harsh Jaat', role: 'Convenor', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80', selected: false },
    { id: '12', name: 'Harsh Jaat', role: 'Convenor', image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80', selected: false },
];

// --- Navbar Component ---
const Navbar = () => (
    <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex flex-col items-center leading-none">
            <span className="text-4xl font-bold text-green-700 font-sans tracking-tight">pgp</span>
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Peoples Green Party</span>
        </div>
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">
            <a href="#" className="text-gray-500 hover:text-green-700">Dashboard</a>
            <a href="#" className="bg-green-50 text-green-800 px-4 py-2 rounded-md">Election</a>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden h-9">
                <button className="px-3 text-xs font-medium text-gray-400 hover:bg-gray-50 h-full">हि</button>
                <div className="w-px h-4 bg-gray-200" />
                <button className="px-3 text-xs font-bold bg-green-50 text-green-700 h-full">En</button>
            </div>
            <div className="p-2 border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50">
                <User size={20} className="text-gray-600" />
            </div>
        </div>
    </nav>
);

// --- Filter Bar Component ---
const FilterBar = () => (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
            <input
                type="text"
                placeholder="Search by Name"
                className="w-full pl-4 pr-10 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            {/* Search icon placeholder if needed, usually on right or left */}
        </div>
        <div className="flex gap-4">
            {['Age Group', 'Region', 'Gender'].map((placeholder) => (
                <div key={placeholder} className="relative min-w-[140px]">
                    <select className="w-full appearance-none bg-white border border-gray-300 px-4 py-3 rounded-lg text-sm text-gray-600 focus:outline-none focus:border-green-600 cursor-pointer">
                        <option>{placeholder}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            ))}
        </div>
    </div>
);

// --- Candidate Card Component ---
const CandidateCard = ({ candidate, onToggle }: { candidate: Candidate, onToggle: (id: string) => void }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow relative">
        {/* Selection Checkbox */}
        <button
            onClick={() => onToggle(candidate.id)}
            className={`absolute top-3 right-3 z-10 w-6 h-6 rounded flex items-center justify-center transition-colors border ${candidate.selected
                ? 'bg-green-800 border-green-800'
                : 'bg-white border-gray-300'
                }`}
        >
            {candidate.selected && <Check size={16} className="text-white" strokeWidth={3} />}
        </button>

        <div className="h-48 overflow-hidden">
            <img
                src={candidate.image}
                alt={candidate.name}
                className="w-full h-full object-cover object-top"
            />
        </div>
        <div className="p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-1">{candidate.name}</h3>
            <p className="text-xs text-gray-500 font-medium">{candidate.role}</p>
        </div>
    </div>
);

// --- Selected Candidates Sidebar ---
const SelectedSidebar = ({ selectedCandidates, onRemove }: { selectedCandidates: Candidate[], onRemove: (id: string) => void }) => {
    const count = selectedCandidates.length;
    const max = 21; // From image text "up to 21 candidates"

    // Calculate width for progress bar (clamped 0-100%)
    const progressWidth = `${Math.min((count / max) * 100, 100)}%`;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Selected Candidates</h2>
            <p className="text-xs text-gray-500 mb-4">You can select up to {max} candidates.</p>

            {/* Progress Bar */}
            <div className="relative w-full h-8 bg-green-50 rounded-md overflow-hidden mb-6 flex items-center">
                <div className="absolute left-0 top-0 h-full bg-[#5D9B85] transition-all duration-300" style={{ width: progressWidth }}></div>
                <span className="relative z-10 pl-3 text-xs font-bold text-white">09/{max}</span>
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedCandidates.map(candidate => (
                    <div key={candidate.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={candidate.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">{candidate.name}</p>
                                <p className="text-xs text-gray-500">{candidate.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(candidate.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            <button className="w-full mt-6 py-3 bg-[#0F4C36] hover:bg-green-900 text-white font-medium text-sm rounded-lg transition-colors">
                Submit
            </button>
        </div>
    );
};

// --- Main Page ---
export default function ElectionVotingPage() {
    const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

    const toggleCandidate = (id: string) => {
        setCandidates(prev => prev.map(c =>
            c.id === id ? { ...c, selected: !c.selected } : c
        ));
    };

    const selectedCandidates = candidates.filter(c => c.selected);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 pb-12">
            <Navbar />

            <main className="max-w-[1400px] mx-auto px-6 pt-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#0F392B] mb-4">Election Name</h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-gray-500" />
                            <span>Nov 1 - Nov 15</span>
                        </div>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-gray-500" />
                            <span>5 days remaining</span>
                        </div>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-gray-500" />
                            <span>300 candidates</span>
                        </div>
                    </div>
                </div>

                <FilterBar />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Candidates Grid */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
                            <button className="w-8 h-8 flex items-center justify-center bg-[#E8F3EF] text-[#0F392B] font-bold rounded text-sm">1</button>
                            <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium rounded text-sm border border-gray-200">2</button>
                            <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium rounded text-sm border border-gray-200">3</button>
                            <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium rounded text-sm border border-gray-200">4</button>
                            <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-700">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Selected Sidebar */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <SelectedSidebar
                            selectedCandidates={selectedCandidates}
                            onRemove={toggleCandidate}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}