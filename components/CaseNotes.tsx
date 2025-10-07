import React, { useState, useEffect } from 'react';
import { Save, CheckCircle } from 'lucide-react';

interface CaseNotesProps {
    caseId: string;
}

const CaseNotes: React.FC<CaseNotesProps> = ({ caseId }) => {
    const storageKey = `case-note-${caseId}`;
    const [note, setNote] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    useEffect(() => {
        const savedNote = localStorage.getItem(storageKey);
        if (savedNote) {
            setNote(savedNote);
        } else {
            setNote('');
        }
    }, [caseId, storageKey]);

    const handleSave = () => {
        localStorage.setItem(storageKey, note);
        setShowConfirmation(true);
        setTimeout(() => {
            setShowConfirmation(false);
        }, 2000);
    };

    return (
        <div className="space-y-4 animate-fade-in h-full flex flex-col">
            <div className="flex-shrink-0">
                <h4 className="text-lg font-semibold text-brand-blue">案件筆記</h4>
                <p className="text-sm text-gray-600 mt-1">
                    您在此處輸入的筆記將會自動儲存於您的瀏覽器中，僅供您個人參考。
                </p>
            </div>
            <div className="flex-grow flex flex-col">
                 <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="在此輸入您的審核筆記、待辦事項或任何想法..."
                    className="w-full flex-grow p-3 border rounded-md focus:ring-2 focus:ring-brand-blue-light focus:outline-none resize-none"
                />
            </div>
           
            <div className="flex items-center justify-end space-x-4 flex-shrink-0">
                 {showConfirmation && (
                    <div className="flex items-center text-green-600 transition-opacity duration-300 animate-fade-in">
                        <CheckCircle size={18} className="mr-2" />
                        <span>筆記已儲存！</span>
                    </div>
                )}
                <button
                    onClick={handleSave}
                    className="bg-brand-blue-light text-white px-4 py-2 rounded-md hover:bg-brand-blue transition-colors flex items-center justify-center"
                >
                    <Save size={16} className="mr-2" />
                    儲存筆記
                </button>
            </div>
        </div>
    );
};

export default CaseNotes;
