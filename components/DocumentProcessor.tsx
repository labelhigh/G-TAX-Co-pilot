import React, { useState, useMemo, useEffect } from 'react';
import type { Case, CaseDocument, FocusRequest } from '../types';
import { FileText, Search, AlertCircle, CheckCircle, Cpu, FileScan, AlertTriangle } from 'lucide-react';

interface DocumentProcessorProps {
    caseData: Case;
    focusRequest: FocusRequest | null;
}

interface SearchResult {
    docId: string;
    docName: string;
    snippet: React.ReactNode;
}

const DocumentProcessor: React.FC<DocumentProcessorProps> = ({ caseData, focusRequest }) => {
    const { documents, crossDocumentFindings = [] } = caseData;
    const [selectedDoc, setSelectedDoc] = useState<CaseDocument | null>(documents.length > 0 ? documents[0] : null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (focusRequest?.docId) {
            const docToSelect = documents.find(d => d.id === focusRequest.docId);
            if (docToSelect) {
                setSelectedDoc(docToSelect);
            }
            if (focusRequest.query) {
                setSearchQuery(focusRequest.query);
            }
        }
    }, [focusRequest, documents]);
    
    // Reset selected doc if the case changes and the doc doesn't exist in the new case
    useEffect(() => {
        if (!documents.find(d => d.id === selectedDoc?.id)) {
            setSelectedDoc(documents.length > 0 ? documents[0] : null);
        }
    }, [documents, selectedDoc]);

    const searchResults = useMemo<SearchResult[]>(() => {
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) {
            return [];
        }

        const results: SearchResult[] = [];
        const queryRegex = new RegExp(trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const highlightRegex = new RegExp(`(${trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

        for (const doc of documents) {
            const match = doc.content.match(queryRegex);
            if (match && typeof match.index === 'number') {
                const matchIndex = match.index;
                const snippetStart = Math.max(0, matchIndex - 30);
                const snippetEnd = Math.min(doc.content.length, matchIndex + trimmedQuery.length + 30);
                let snippetText = doc.content.substring(snippetStart, snippetEnd);

                if (snippetStart > 0) snippetText = '...' + snippetText;
                if (snippetEnd < doc.content.length) snippetText = snippetText + '...';

                const highlightedSnippet = (
                    <span>
                        {snippetText.split(highlightRegex).map((part, i) =>
                            i % 2 === 1 ? (
                                <mark key={i} className="bg-cyan-200 rounded px-1">{part}</mark>
                            ) : (
                                part
                            )
                        )}
                    </span>
                );

                results.push({
                    docId: doc.id,
                    docName: doc.name,
                    snippet: highlightedSnippet,
                });
            }
        }
        return results;
    }, [searchQuery, documents]);
    
    const handleSelectDocFromSearch = (docId: string) => {
        const doc = documents.find(d => d.id === docId);
        if (doc) setSelectedDoc(doc);
    };

    const renderHighlightedContent = (content: string, findingHighlights: string[], searchHighlight: string) => {
        const allTerms = [...new Set([
            ...findingHighlights.filter(Boolean),
            ...(searchHighlight.trim() ? [searchHighlight.trim()] : [])
        ])];
    
        if (allTerms.length === 0) {
            return <span>{content}</span>;
        }
    
        const escapedTerms = allTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
        const parts = content.split(regex);
    
        const lowerSearch = searchHighlight.trim().toLowerCase();
        const lowerFindings = findingHighlights.map(f => f.toLowerCase());
    
        return (
            <span>
                {parts.map((part, i) => {
                    if (!part) return null;
                    const lowerPart = part.toLowerCase();
    
                    const isSearchMatch = lowerSearch && lowerPart === lowerSearch;
                    const isFindingMatch = !isSearchMatch && lowerFindings.includes(lowerPart);
                    
                    if (isSearchMatch) {
                        return <mark key={i} className="bg-cyan-200 rounded px-1">{part}</mark>;
                    } else if (isFindingMatch) {
                        return <mark key={i} className="bg-red-200 rounded px-1">{part}</mark>;
                    } else {
                        return part;
                    }
                })}
            </span>
        );
    };

    if (documents.length === 0) {
        return <div className="text-center text-gray-500 py-10">此案件無相關文件。</div>;
    }

    return (
        <div className="flex space-x-6 h-full animate-fade-in">
            {/* Document List & Search */}
            <div className="w-1/3 border-r pr-4 flex flex-col">
                <h4 className="text-lg font-semibold text-brand-blue mb-3 flex-shrink-0">案件文件</h4>
                 <div className="relative mb-3 flex-shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="在所有文件中搜尋..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-brand-blue-light focus:outline-none"
                    />
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    {searchQuery.trim() ? (
                        <div className="space-y-2">
                             <h5 className="text-sm font-semibold text-gray-600 px-2">搜尋結果 ({searchResults.length})</h5>
                             {searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                    <button
                                        key={`${result.docId}-${index}`}
                                        onClick={() => handleSelectDocFromSearch(result.docId)}
                                        className={`w-full text-left p-2 rounded-md transition-colors ${selectedDoc?.id === result.docId ? 'bg-brand-blue-lighter' : 'hover:bg-gray-100'}`}
                                    >
                                        <p className="font-semibold text-sm truncate text-brand-blue">{result.docName}</p>
                                        <p className="text-xs text-gray-600 mt-1">{result.snippet}</p>
                                    </button>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center p-4">找不到包含 "{searchQuery}" 的文件。</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {documents.map(doc => (
                                <button
                                    key={doc.id}
                                    onClick={() => setSelectedDoc(doc)}
                                    className={`w-full text-left flex items-center p-2 rounded-md transition-colors ${
                                        selectedDoc?.id === doc.id ? 'bg-brand-blue-lighter text-brand-blue font-semibold' : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <FileText size={16} className="mr-2 flex-shrink-0" />
                                    <span className="truncate">{doc.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Document Viewer */}
            <div className="w-2/3 space-y-4 overflow-y-auto">
                {crossDocumentFindings.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center text-orange-600">
                           <AlertTriangle size={18} className="mr-2" /> 跨文件一致性檢查
                        </h4>
                        {crossDocumentFindings.map((finding, index) => (
                             <div key={index} className={`p-3 rounded-lg flex items-start bg-orange-50 border border-orange-200`}>
                                <AlertCircle className={`h-5 w-5 mt-1 mr-3 flex-shrink-0 text-orange-500`} />
                                <div>
                                    <p className={`font-bold text-orange-800`}>{finding.text}</p>
                                    <p className={`text-sm text-orange-700`}>{finding.recommendation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {selectedDoc ? (
                    <div className="space-y-4">
                        <h4 className="text-xl font-bold text-brand-blue">{selectedDoc.name}</h4>
                        
                        {selectedDoc.extractedData && (
                            <div>
                                <h5 className="font-semibold mb-2 flex items-center"><Cpu size={16} className="mr-2" /> AI 資料萃取</h5>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 bg-gray-50 border rounded-lg">
                                    {Object.entries(selectedDoc.extractedData).map(([key, value]) => (
                                        <div key={key}>
                                            <p className="text-xs text-gray-500">{key}</p>
                                            <p className="font-medium text-gray-800">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                             <h5 className="font-semibold mb-2 flex items-center"><FileScan size={16} className="mr-2" /> 文件預覽</h5>
                             <div className="bg-white p-4 rounded-lg border max-h-60 overflow-y-auto font-mono text-sm">
                                <p className="whitespace-pre-line">
                                    {renderHighlightedContent(selectedDoc.content, selectedDoc.findings.map(f => f.highlightedContent), searchQuery)}
                                </p>
                            </div>
                        </div>

                        <div>
                             <h5 className="font-semibold mb-2 flex items-center">
                                <Search size={16} className="mr-2" /> Co-pilot 查核發現
                            </h5>
                             <div className="space-y-3">
                                {selectedDoc.findings.length > 0 ? selectedDoc.findings.map((finding, index) => (
                                    <div key={index} className={`p-3 rounded-lg flex items-start bg-red-50 border-red-200`}>
                                        <AlertCircle className={`h-5 w-5 mt-1 mr-3 flex-shrink-0 text-red-500`} />
                                        <div>
                                            <p className={`font-bold text-red-800`}>{finding.text}</p>
                                            <p className={`text-sm text-red-700`}>{finding.recommendation}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-3 rounded-lg flex items-center bg-green-50 border-green-200 text-green-800">
                                         <CheckCircle size={18} className="mr-2"/>
                                         <span>此文件未發現明顯異常條款。</span>
                                    </div>
                                )}
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">請從左側選擇一份文件以進行智慧審理。</div>
                )}
            </div>
        </div>
    );
};

export default DocumentProcessor;