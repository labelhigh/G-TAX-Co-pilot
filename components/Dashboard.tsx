
import React from 'react';
import type { Case } from '../types';
import { RiskLevel } from '../types';
import { FileText, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface DashboardProps {
    cases: Case[];
    selectedCase: Case | null;
    onSelectCase: (caseData: Case) => void;
}

const RiskIndicator: React.FC<{ level: RiskLevel }> = ({ level }) => {
    const baseClasses = "w-3 h-3 rounded-full";
    switch (level) {
        case RiskLevel.High:
            return <div className={`${baseClasses} bg-risk-high`} title="高風險"></div>;
        case RiskLevel.Medium:
            return <div className={`${baseClasses} bg-risk-medium`} title="中風險"></div>;
        case RiskLevel.Low:
            return <div className={`${baseClasses} bg-risk-low`} title="低風險"></div>;
        default:
            return null;
    }
};


const Dashboard: React.FC<DashboardProps> = ({ cases, selectedCase, onSelectCase }) => {
    
    const sortedCases = [...cases].sort((a, b) => b.riskScore - a.riskScore);
    
    return (
        <div className="bg-white rounded-lg shadow-md p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-brand-blue flex items-center">
                    <Zap size={20} className="mr-2 text-brand-blue-light" />
                    主動式案件儀表板
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    共 {cases.length} 件
                </span>
            </div>
            <div className="space-y-2">
                {sortedCases.map((caseItem) => (
                    <div
                        key={caseItem.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedCase?.id === caseItem.id
                                ? 'bg-brand-blue-lighter shadow-inner'
                                : 'hover:bg-gray-50'
                        }`}
                        onClick={() => onSelectCase(caseItem)}
                    >
                        <div className="flex justify-between items-start">
                           <div className="flex items-center">
                                <RiskIndicator level={caseItem.riskLevel} />
                                <div className="ml-3">
                                    <p className={`font-semibold ${selectedCase?.id === caseItem.id ? 'text-brand-blue' : 'text-brand-text'}`}>{caseItem.companyName}</p>
                                    <p className="text-xs text-gray-500">{caseItem.taxId}</p>
                                </div>
                           </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">{caseItem.riskScore}</p>
                                <p className="text-xs text-gray-400">風險分</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
