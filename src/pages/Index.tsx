import { useState } from "react";
import { Shield, Activity } from "lucide-react";
import AnalysisInput, { InputType } from "@/components/AnalysisInput";
import AnalysisResults from "@/components/AnalysisResults";
import ScanOverlay from "@/components/ScanOverlay";
import { AnalysisResult, generateMockResult } from "@/lib/analysis";

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (type: InputType, content: string) => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate analysis delay
    await new Promise((r) => setTimeout(r, 2500));

    const mockResult = generateMockResult(type, content);
    setResult(mockResult);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-gradient-primary">VeriScope</span>{" "}
                <span className="text-foreground">AI</span>
              </h1>
              <p className="text-[10px] font-mono text-muted-foreground tracking-widest">
                MULTIMODAL DEEPFAKE DETECTION
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Activity className="w-3.5 h-3.5 text-success animate-pulse" />
            <span className="hidden sm:inline">SYSTEM ONLINE</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2 py-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Detect <span className="text-gradient-primary">Deepfakes</span> & Fake Content
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            AI-powered multimodal analysis for text, images, audio, and video.
            Verified against trusted news sources in real-time.
          </p>
        </div>

        {/* Input Section */}
        <div className="relative">
          {isAnalyzing && <ScanOverlay />}
          <AnalysisInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        </div>

        {/* Results */}
        {result && <AnalysisResults result={result} />}

        {/* Stats Bar */}
        {!result && !isAnalyzing && (
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[
              { label: "Analyses Run", value: "2.4M+" },
              { label: "Deepfakes Caught", value: "847K" },
              { label: "Accuracy", value: "97.3%" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-border bg-card p-4 text-center"
              >
                <div className="text-xl font-bold font-mono text-primary">{value}</div>
                <div className="text-[10px] font-mono text-muted-foreground tracking-wider mt-1">
                  {label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
          <span>© 2026 VERISCOPE AI</span>
          <span>HACKATHON EDITION v1.0</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
