import React, { useState, useEffect } from 'react';
import type { Case, GlobalSearchResult, FocusRequest } from './types';
import { MOCK_CASES } from './constants';
import Dashboard from './components/Dashboard';
import CaseDetail from './components/CaseDetail';
import GlobalSearchBar from './components/GlobalSearchBar';

const App: React.FC = () => {
    const [selectedCase, setSelectedCase] = useState<Case | null>(MOCK_CASES[0]);
    const [focusRequest, setFocusRequest] = useState<FocusRequest | null>(null);

    // This effect makes the focus request a one-shot event.
    useEffect(() => {
        if (focusRequest) {
            const timer = setTimeout(() => setFocusRequest(null), 50);
            return () => clearTimeout(timer);
        }
    }, [focusRequest]);
    
    const handleSearchResultClick = (result: GlobalSearchResult, query: string) => {
        const caseToSelect = MOCK_CASES.find(c => c.id === result.caseId);
        if (caseToSelect) {
            setSelectedCase(caseToSelect);
        }

        if (result.docId) {
             setFocusRequest({
                tab: 'documents',
                docId: result.docId,
                query: query,
            });
        } else {
            setFocusRequest({ tab: 'summary' });
        }
    };

    return (
        <div className="bg-brand-gray min-h-screen font-sans text-brand-text">
            <header className="bg-brand-blue shadow-md text-white">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold tracking-wider">G-TAX Co-pilot (稅務智慧副駕)</h1>
                     <div className="flex items-center space-x-6">
                        <GlobalSearchBar cases={MOCK_CASES} onResultClick={handleSearchResultClick} />
                        <div className="flex items-center space-x-4">
                            <span>張審計員</span>
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue font-bold">
                                張
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-6">
                <div className="flex space-x-6">
                    <div className="w-1/3">
                        <Dashboard cases={MOCK_CASES} selectedCase={selectedCase} onSelectCase={setSelectedCase} />
                    </div>
                    <div className="w-2/3">
                        {selectedCase ? (
                            <CaseDetail caseData={selectedCase} focusRequest={focusRequest} />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-md p-6">
                                <p className="text-lg text-gray-500">請從左側選擇一個案件以開始審理。</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;