
import React, { useState } from 'react';
import { MOCK_REGULATIONS } from '../constants';
import { runWhatIfAnalysis } from '../services/geminiService';
import { BookMarked, FlaskConical, Send, Loader, Sparkles } from 'lucide-react';

const RegulationSandbox: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>('');

    const handleQuery = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setResult('');
        const response = await runWhatIfAnalysis(query);
        setResult(response);
        setIsLoading(false);
    };
    
    return (
        <div className="space-y-6 animate-fade-in">
            {/* What-if Analysis */}
            <div>
                <h4 className="text-lg font-semibold text-brand-blue mb-2 flex items-center">
                    <FlaskConical size={18} className="mr-2"/> "假如分析" (What-if Analysis)
                </h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 mb-2">輸入情境以模擬稅務判斷，例如：「假如將這筆費用認定為廣告費，稅額會如何變化？並列出支持與反對的論點。」</p>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                            placeholder="輸入您的指令..."
                            className="flex-grow p-2 border rounded-md focus:ring-2 focus:ring-brand-blue-light focus:outline-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleQuery}
                            disabled={isLoading}
                            className="bg-brand-blue-light text-white px-4 py-2 rounded-md hover:bg-brand-blue transition-colors disabled:bg-gray-400 flex items-center justify-center w-28"
                        >
                            {isLoading ? <Loader className="animate-spin" size={20}/> : <><Send size={16} className="mr-2"/>分析</>}
                        </button>
                    </div>
                </div>
                {result && (
                    <div className="mt-4 p-4 bg-brand-blue-lighter rounded-lg border-l-4 border-brand-blue-light prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: result.replace(/### (.*)/g, '<h3 class="text-brand-blue">$1</h3>') }} />
                    </div>
                )}
            </div>

            {/* Contextual Regulations */}
            <div>
                <h4 className="text-lg font-semibold text-brand-blue mb-2 flex items-center">
                    <BookMarked size={18} className="mr-2"/> 情境化法規推薦
                </h4>
                <div className="space-y-3">
                    {MOCK_REGULATIONS.map((reg, index) => (
                        <div key={index} className="bg-white p-3 rounded-lg border">
                            <p className="font-semibold text-gray-800">{reg.title}</p>
                            <p className="text-sm text-gray-600 mt-1 flex">
                                <Sparkles size={14} className="mr-2 mt-0.5 text-brand-blue-light flex-shrink-0"/>
                                <span className="font-bold text-brand-blue-light mr-1">AI總結:</span>
                                {reg.summary}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegulationSandbox;
