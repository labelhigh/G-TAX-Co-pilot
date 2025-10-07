
import React, { useState, useMemo } from 'react';
import { generateAuditReport } from '../services/geminiService';
import { Edit, Settings, Loader, FileSignature } from 'lucide-react';

const ReportGenerator: React.FC = () => {
    const [findings, setFindings] = useState<string[]>([]);
    const [tone, setTone] = useState<string>('標準');
    const [template, setTemplate] = useState<string>('初次通知');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [report, setReport] = useState<string>('');

    const availableFindings = useMemo(() => [
        '進項發票與行業別不符',
        '短期內銷售額劇烈波動',
        '海外勞務費用合理性存疑',
        '發票金額與合約金額不一致',
        '關聯企業交易價格異常'
    ], []);

    const handleFindingChange = (finding: string, checked: boolean) => {
        if (checked) {
            setFindings(prev => [...prev, finding]);
        } else {
            setFindings(prev => prev.filter(f => f !== finding));
        }
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setReport('');
        const response = await generateAuditReport(findings, tone, template);
        setReport(response);
        setIsLoading(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Configuration */}
            <div>
                <h4 className="text-lg font-semibold text-brand-blue mb-2 flex items-center">
                    <Settings size={18} className="mr-2"/> 1. 設定報告參數
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 border rounded-lg">
                    <div>
                        <label className="font-semibold text-gray-700 block mb-2">勾選關鍵查核發現</label>
                        <div className="space-y-2">
                            {availableFindings.map(f => (
                                <label key={f} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-brand-blue-light focus:ring-brand-blue-light"
                                        onChange={(e) => handleFindingChange(f, e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-800">{f}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                           <label className="font-semibold text-gray-700 block mb-2">選擇語氣</label>
                           <select value={tone} onChange={e => setTone(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-brand-blue-light focus:outline-none">
                               <option>標準</option>
                               <option>嚴厲</option>
                               <option>輔導性</option>
                           </select>
                        </div>
                         <div>
                           <label className="font-semibold text-gray-700 block mb-2">選擇範本</label>
                           <select value={template} onChange={e => setTemplate(e.target.value)} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-brand-blue-light focus:outline-none">
                               <option>初次通知</option>
                               <option>審查報告</option>
                               <option>最終警告</option>
                           </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generation Button */}
            <div className="text-center">
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-brand-blue-light text-white px-6 py-3 rounded-lg hover:bg-brand-blue transition-colors disabled:bg-gray-400 flex items-center justify-center w-48 mx-auto text-lg"
                >
                    {isLoading ? <Loader className="animate-spin" size={24}/> : <><Edit size={20} className="mr-2"/>草擬報告</>}
                </button>
            </div>


            {/* Output */}
            {report && (
                 <div>
                    <h4 className="text-lg font-semibold text-brand-blue mb-2 flex items-center">
                       <FileSignature size={18} className="mr-2"/> 2. 審查報告草稿
                    </h4>
                    <textarea
                        readOnly
                        value={report}
                        className="w-full h-80 p-4 border rounded-md bg-white font-mono text-sm focus:ring-2 focus:ring-brand-blue-light focus:outline-none"
                    />
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;
