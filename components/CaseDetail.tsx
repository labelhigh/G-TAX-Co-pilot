import React, { useState, useEffect } from 'react';
import type { Case, FocusRequest } from '../types';
import CaseSummary from './CaseSummary';
import DocumentProcessor from './DocumentProcessor';
import RegulationSandbox from './RegulationSandbox';
import ReportGenerator from './ReportGenerator';
import CaseNotes from './CaseNotes';
import { BookOpen, FileCheck2, FlaskConical, BotMessageSquare, Notebook } from 'lucide-react';


interface CaseDetailProps {
    caseData: Case;
    focusRequest: FocusRequest | null;
}

type ActiveTab = 'summary' | 'documents' | 'sandbox' | 'reports' | 'notes';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none ${
                active
                    ? 'bg-white border-b-2 border-brand-blue-light text-brand-blue-light'
                    : 'text-gray-500 hover:text-brand-blue'
            }`}
        >
            {children}
        </button>
    );
};

const CaseDetail: React.FC<CaseDetailProps> = ({ caseData, focusRequest }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('summary');

    useEffect(() => {
        if (focusRequest) {
            setActiveTab(focusRequest.tab);
        }
    }, [focusRequest]);

    const renderContent = () => {
        switch (activeTab) {
            case 'summary':
                return <CaseSummary caseData={caseData} />;
            case 'documents':
                return <DocumentProcessor 
                            caseData={caseData} 
                            focusRequest={focusRequest?.tab === 'documents' ? focusRequest : null} 
                       />;
            case 'sandbox':
                return <RegulationSandbox />;
            case 'reports':
                return <ReportGenerator />;
            case 'notes':
                return <CaseNotes caseId={caseData.id} />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            <header className="px-6 pt-4 border-b">
                <h3 className="text-2xl font-bold text-brand-blue">{caseData.companyName}</h3>
                <p className="text-sm text-gray-500 mb-4">統編: {caseData.taxId} | 申報日期: {caseData.filingDate}</p>
                <div className="flex border-b -mb-px">
                     <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
                        <BotMessageSquare size={16} className="mr-2"/> 案件摘要
                    </TabButton>
                    <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
                        <FileCheck2 size={16} className="mr-2"/> 智慧文件審理器
                    </TabButton>
                    <TabButton active={activeTab === 'sandbox'} onClick={() => setActiveTab('sandbox')}>
                        <FlaskConical size={16} className="mr-2"/> 法規模擬
                    </TabButton>
                    <TabButton active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>
                       <BookOpen size={16} className="mr-2"/> 報告生成
                    </TabButton>
                    <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')}>
                       <Notebook size={16} className="mr-2"/> 案件筆記
                    </TabButton>
                </div>
            </header>
            <div className="p-6 flex-grow overflow-hidden">
                {renderContent()}
            </div>
        </div>
    );
};

export default CaseDetail;