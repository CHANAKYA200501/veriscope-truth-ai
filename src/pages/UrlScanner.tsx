import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AnalysisResults from "@/components/AnalysisResults";
import ScanOverlay from "@/components/ScanOverlay";
import { AnalysisResult, generateUrlResult } from "@/lib/analysis";

const UrlScanner = () => {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleScan = async () => {
    if (!url.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 2000));
    setResult(generateUrlResult(url));
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-display text-3xl tracking-wider">URL <span className="text-gradient-primary">SCANNER</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Verify URL trustworthiness, domain safety, and news authenticity</p>
      </div>

      <div className="glass-card rounded-lg p-6 relative">
        {isAnalyzing && <ScanOverlay />}
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <span className="text-xs font-mono text-muted-foreground tracking-wider">ENTER URL TO SCAN</span>
        </div>
        <div className="flex gap-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/news-article..."
            className="bg-background border-border font-mono text-sm flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
          />
          <Button
            onClick={handleScan}
            disabled={isAnalyzing || !url.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 animate-pulse-glow disabled:animate-none"
          >
            {isAnalyzing ? (
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-[10px] font-mono text-muted-foreground">CHECKS:</span>
          {["HTTPS", "Domain Trust", "Google News", "Spam Patterns", "Domain Age"].map(c => (
            <span key={c} className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">{c}</span>
          ))}
        </div>
      </div>

      {result && <AnalysisResults result={result} />}
    </div>
  );
};

export default UrlScanner;
