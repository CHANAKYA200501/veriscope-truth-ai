import { useState } from "react";
import AnalysisInput, { InputType } from "@/components/AnalysisInput";
import AnalysisResults from "@/components/AnalysisResults";
import ScanOverlay from "@/components/ScanOverlay";
import { AnalysisResult, generateMockResult } from "@/lib/analysis";

const UploadPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

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
      <div>
        <h1 className="font-display text-3xl tracking-wider">CONTENT <span className="text-gradient-primary">ANALYZER</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Upload or paste content for deepfake and authenticity analysis</p>
      </div>

      <div className="relative">
        {isAnalyzing && <ScanOverlay />}
        <AnalysisInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
      </div>

      {result && <AnalysisResults result={result} />}
    </div>
  );
};

export default UploadPage;
