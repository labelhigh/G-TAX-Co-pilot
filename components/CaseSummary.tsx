
import React from 'react';
import type { Case } from '../types';
import { Link, AlertTriangle } from 'lucide-react';


const CaseSummary: React.FC<{ caseData: Case }> = ({ caseData }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h4 className="text-lg font-semibold text-brand-blue mb-2">AI 案件摘要</h4>
                <div className="bg-brand-blue-lighter p-4 rounded-lg border-l-4 border-brand-blue-light">
                    <p className="text-gray-800 whitespace-pre-line">{caseData.summary}</p>
                </div>
            </div>

            {caseData.linkedCases.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-brand-blue mb-2 flex items-center">
                        <Link size={18} className="mr-2" />
                        關聯案件網絡
                    </h4>
                    <div className="space-y-2">
                        {caseData.linkedCases.map((linkedCase, index) => (
                            <div key={index} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start">
                                <AlertTriangle className="text-yellow-500 h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-yellow-800">注意：交易對象 {linkedCase.companyName}</p>
                                    <p className="text-sm text-yellow-700">曾於 {linkedCase.date} 因 "{linkedCase.reason}" 被裁罰。</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseSummary;
