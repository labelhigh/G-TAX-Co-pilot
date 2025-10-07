
// @ts-nocheck
// This is a mock service that simulates Gemini API calls.
// In a real application, this would use `@google/genai`.
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_LATENCY = 1500;

export const runWhatIfAnalysis = async (query: string): Promise<string> => {
    console.log("Simulating 'What-if Analysis' with query:", query);

    // This is a placeholder for a real API call.
    // const response = await ai.models.generateContent({
    //     model: 'gemini-2.5-flash',
    //     contents: `...`,
    // });
    
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));

    if (query.includes("廣告費")) {
        return `
### 模擬分析：將費用認定為「廣告費」

**稅額變化:**
預估營業稅額可扣抵增加 TWD 80,000，營所稅費用增加，淨稅額影響約減少 TWD 150,000。

**支持論點:**
1.  **廣泛性:** 該筆支出用於提升品牌對不特定大眾的知名度，符合廣告費之定義。
2.  **公開性:** 費用發生於公開媒體通路，有助於塑造公司公開形象。
3.  **對價關係:** 支出的效益及於不特定之潛在客戶，非針對特定對象。

**潛在挑戰:**
1.  **對象特定性:** 若被認定活動主要受益者為特定經銷商，可能被轉認為交際費。
2.  **效益證明:** 需準備能證明此活動對整體銷售有普遍性助益的文件。
        `;
    }
    return `
### 模擬分析：一般查詢

這是針對您的查詢「${query}」所生成的一般性模擬分析結果。請提供更具體的 "what-if" 情境以獲得詳細稅務影響評估。
    `;
};

export const generateAuditReport = async (findings: string[], tone: string, template: string): Promise<string> => {
    console.log("Simulating 'Generate Audit Report' with:", { findings, tone, template });
    
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY));

    const findingText = findings.length > 0
        ? findings.map((f, i) => `${i + 1}. ${f}`).join('\n')
        : '經查核，尚無發現重大異常情事。';

    return `
**稅務審查報告 (草稿)**

**受查核對象:** 無限創新科技 (統編: 87654321)
**查核期間:** 112 年度營利事業所得稅結算申報
**範本:** ${template}
**語氣:** ${tone}

**一、 案由:**
本案為對無限創新科技進行之例行性稅務審查，主要針對其申報之鉅額海外勞務費用進行核實。

**二、 查核過程:**
已調閱並審核該公司提供之海外技術服務合約、相關發票及進口報單等文件。

**三、 查核發現:**
${findingText}

**四、 法規依據:**
- 所得稅法 §14
- 函釋 台財稅字第0930454321號

**五、 結論與建議:**
建議針對上述發現事項，要求該公司提出進一步說明與補正文件。若無法提供合理解釋，將依相關法規進行稅額調整。
    `;
};
