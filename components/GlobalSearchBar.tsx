import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import type { Case, GlobalSearchResult } from '../types';

interface GlobalSearchBarProps {
    cases: Case[];
    onResultClick: (result: GlobalSearchResult, query: string) => void;
}

const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({ cases, onResultClick }) => {
    const [query, setQuery] = useState('');
    const [isActive, setIsActive] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const results = useMemo<GlobalSearchResult[]>(() => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery || trimmedQuery.length < 2) {
            return [];
        }

        const allResults: GlobalSearchResult[] = [];
        const queryRegex = new RegExp(trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const highlightRegex = new RegExp(`(${trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        
        const createSnippet = (text: string) => {
            const match = text.match(queryRegex);
            if (!match || typeof match.index !== 'number') return null;

            const matchIndex = match.index;
            const snippetStart = Math.max(0, matchIndex - 40);
            const snippetEnd = Math.min(text.length, matchIndex + trimmedQuery.length + 40);
            let snippetText = text.substring(snippetStart, snippetEnd);

            if (snippetStart > 0) snippetText = '...' + snippetText;
            if (snippetEnd < text.length) snippetText = snippetText + '...';
            
             return (
                <span>
                    {snippetText.split(highlightRegex).map((part, i) =>
                        i % 2 === 1 ? <mark key={i} className="bg-yellow-200 text-black rounded px-1">{part}</mark> : part
                    )}
                </span>
            );
        };


        for (const caseItem of cases) {
            // Search case name
            if (caseItem.companyName.match(queryRegex)) {
                allResults.push({
                    caseId: caseItem.id,
                    caseName: caseItem.companyName,
                    matchType: 'Case',
                    snippet: <span>在 <span className="font-semibold">案件名稱</span> 中找到匹配</span>
                });
            }
            // Search case summary
            const summarySnippet = createSnippet(caseItem.summary);
            if (summarySnippet) {
                allResults.push({
                    caseId: caseItem.id,
                    caseName: caseItem.companyName,
                    matchType: 'Case',
                    snippet: summarySnippet
                });
            }

            // Search documents
            for (const doc of caseItem.documents) {
                const contentSnippet = createSnippet(doc.content);
                if (contentSnippet) {
                     allResults.push({
                        caseId: caseItem.id,
                        caseName: caseItem.companyName,
                        docId: doc.id,
                        docName: doc.name,
                        matchType: 'Document',
                        snippet: contentSnippet
                    });
                }
            }
        }

        return allResults.slice(0, 10); // Limit results
    }, [query, cases]);
    
    const handleSelect = (result: GlobalSearchResult) => {
        onResultClick(result, query);
        setQuery('');
        setIsActive(false);
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsActive(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    return (
        <div className="relative w-72" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input
                    type="text"
                    placeholder="搜尋所有案件與文件..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => setIsActive(true)}
                    className="w-full bg-brand-blue-light placeholder-gray-300 text-white pl-10 pr-8 py-2 border border-brand-blue-light rounded-md focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white">
                        <X size={18} />
                    </button>
                )}
            </div>

            {isActive && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto text-brand-text">
                    <ul>
                        {results.map((result, index) => (
                            <li key={index}>
                                <button onClick={() => handleSelect(result)} className="w-full text-left px-4 py-3 hover:bg-brand-blue-lighter transition-colors">
                                    <p className="font-semibold text-sm">{result.matchType === 'Document' ? result.docName : result.caseName}</p>
                                    {result.matchType === 'Document' && <p className="text-xs text-gray-500">{result.caseName}</p>}
                                    <p className="text-xs text-gray-600 mt-1">{result.snippet}</p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default GlobalSearchBar;
