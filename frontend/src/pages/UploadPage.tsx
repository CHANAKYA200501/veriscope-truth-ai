import { useState } from "react";
import AnalysisInput, { InputType } from "@/components/AnalysisInput";
import AnalysisResults from "@/components/AnalysisResults";
import ScanOverlay from "@/components/ScanOverlay";
import LanguageSelector from "@/components/LanguageSelector";
import { AnalysisResult, generateMockResult } from "@/lib/analysis";
import { Language, t } from "@/lib/i18n";

const UploadPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState<Language>("en");

  const i = t(language);

  const handleAnalyze = async (type: InputType, content: string) => {
    setIsAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2500));
    const mockResult = generateMockResult(type, content);
    setResult(mockResult);
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-fade-in-up">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-wider">{i.contentAnalyzer.split(" ")[0]} <span className="text-gradient-primary">{i.contentAnalyzer.split(" ").slice(1).join(" ")}</span></h1>
          <p className="text-sm text-muted-foreground mt-1">{i.uploadDescription}</p>
        </div>
        <LanguageSelector language={language} onChange={setLanguage} />
      </div>

      <div className="relative">
        {isAnalyzing && <ScanOverlay />}
        <AnalysisInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} language={language} />
      </div>

      {result && <AnalysisResults result={result} language={language} />}
    </div>
  );
};

export default UploadPage;
