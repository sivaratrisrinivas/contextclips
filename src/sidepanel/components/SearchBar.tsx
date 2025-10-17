import React from "react";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    selectedDomain: string;
    onDomainChange: (domain: string) => void;
    domains: string[];
    totalClips: number;
    filteredClips: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    selectedDomain,
    onDomainChange,
    domains,
    totalClips,
    filteredClips,
}) => {
    return (
        <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search clips..."
                    className="w-full px-4 py-3 pl-11 pr-11 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent transition-all text-sm"
                />
                <svg
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Domain Filter */}
            {domains.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                    <button
                        onClick={() => onDomainChange("all")}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                            selectedDomain === "all"
                                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                        }`}
                    >
                        All
                        {selectedDomain === "all" && (
                            <span className="ml-1.5 opacity-60">
                                {totalClips}
                            </span>
                        )}
                    </button>
                    {domains.map((domain) => (
                        <button
                            key={domain}
                            onClick={() => onDomainChange(domain)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                                selectedDomain === domain
                                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                                    : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                            }`}
                        >
                            {domain}
                        </button>
                    ))}
                </div>
            )}

            {/* Results count */}
            {(value || selectedDomain !== "all") && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                    {filteredClips === totalClips ? (
                        <span>{totalClips} clips</span>
                    ) : (
                        <span>
                            {filteredClips} of {totalClips} clips
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
