export enum RiskLevel {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
}

export interface Case {
    id: string;
    companyName: string;
    taxId: string;
    filingDate: string;
    riskScore: number;
    riskLevel: RiskLevel;
    summary: string;
    linkedCases: LinkedCase[];
    documents: CaseDocument[];
    crossDocumentFindings?: CrossDocumentFinding[];
}

export interface LinkedCase {
    companyName: string;
    taxId: string;
    reason: string;
    date: string;
}

export interface ExtractedData {
    [key: string]: string;
}

export interface CrossDocumentFinding {
    type: 'Consistency';
    text: string;
    recommendation: string;
    documentIds: string[];
}

export interface CaseDocument {
    id: string;
    name: string;
    type: 'Contract' | 'Invoice' | 'Customs Declaration';
    uploadDate: string;
    content: string;
    findings: DocumentFinding[];
    extractedData?: ExtractedData;
}

export interface DocumentFinding {
    type: 'Consistency' | 'Anomalous Clause';
    text: string;
    recommendation: string;
    highlightedContent: string;
}

export interface GlobalSearchResult {
    caseId: string;
    caseName: string;
    docId?: string;
    docName?: string;
    matchType: 'Case' | 'Document';
    snippet: React.ReactNode;
}

export interface FocusRequest {
    tab: 'summary' | 'documents';
    docId?: string;
    query?: string;
}