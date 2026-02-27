import { AnalysisResult } from "@/lib/analysis";
import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, ExternalLink, ArrowRight } from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const verdictConfig = {
  Real: { icon: ShieldCheck, color: "text-success", bg: "bg-success/10", border: "border-success/30", label: "VERIFIED REAL" },
  Fake: { icon: ShieldX, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "FAKE DETECTED" },
  "AI Generated": { icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "AI GENERATED" },
  Deepfake: { icon: ShieldX, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", label: "DEEPFAKE" },
};

const ScoreBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs font-mono">
      <span className="text-muted-foreground">{label}</span>
      <span className={color}>{value}%</span>
    </div>
    <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
      <div
        className={cn("h-full rounded-full transition-all duration-1000 ease-out", color.replace("text-", "bg-"))}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const verdict = verdictConfig[result.prediction];
  const VerdictIcon = verdict.icon;

  const confidenceColor = result.confidence >= 70 ? "text-success" : result.confidence >= 40 ? "text-warning" : "text-destructive";
  const trustColor = result.trust_score >= 70 ? "text-success" : result.trust_score >= 40 ? "text-warning" : "text-destructive";

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Verdict Banner */}
      <div className={cn("glass-card rounded-lg p-6 flex items-center gap-4", verdict.bg, verdict.border, "border")}>
        <VerdictIcon className={cn("w-12 h-12", verdict.color)} />
        <div>
          <div className={cn("font-display text-2xl tracking-wider", verdict.color)}>
            {verdict.label}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{result.summary}</p>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-lg p-4">
          <ScoreBar label="CONFIDENCE" value={result.confidence} color={confidenceColor} />
        </div>
        <div className="glass-card rounded-lg p-4">
          <ScoreBar label="TRUST SCORE" value={result.trust_score} color={trustColor} />
        </div>
      </div>

      {/* URL Prediction */}
      {result.url_prediction && (
        <div className={cn("glass-card rounded-lg p-4 border", result.url_prediction === "Real URL" ? "border-success/30" : "border-destructive/30")}>
          <h3 className="text-xs font-mono text-muted-foreground tracking-wider mb-2">URL VERIFICATION</h3>
          <span className={cn("font-display text-xl tracking-wider", result.url_prediction === "Real URL" ? "text-success" : "text-destructive")}>
            {result.url_prediction}
          </span>
        </div>
      )}

      {/* Detection Details */}
      <div className="glass-card rounded-lg p-4 space-y-3">
        <h3 className="text-xs font-mono text-muted-foreground tracking-wider">DETECTION ANALYSIS</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type</span>
            <span className="font-mono text-primary">{result.type.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">AI Generated</span>
            <span className={cn("font-mono", result.ai_generated ? "text-warning" : "text-success")}>
              {result.ai_generated ? "YES" : "NO"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deepfake</span>
            <span className={cn("font-mono", result.deepfake_detected ? "text-destructive" : "text-success")}>
              {result.deepfake_detected ? "YES" : "NO"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Saved to DB</span>
            <span className="font-mono text-success">
              {result.database_saved ? "YES" : "NO"}
            </span>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">{result.reason}</p>
        </div>
      </div>

      {/* Verified Sources */}
      {result.verified_sources.length > 0 && (
        <div className="glass-card rounded-lg p-4 space-y-2">
          <h3 className="text-xs font-mono text-muted-foreground tracking-wider">VERIFIED SOURCES</h3>
          <div className="flex flex-wrap gap-2">
            {result.verified_sources.map((source) => (
              <span key={source} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-mono border border-success/20">
                <ExternalLink className="w-3 h-3" />
                {source}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fake News Comparison */}
      {result.fake_news_detected && result.corrected_title && (
        <div className="glass-card rounded-lg overflow-hidden border border-destructive/20">
          <div className="p-4 bg-destructive/5 border-b border-destructive/20">
            <h3 className="text-xs font-mono text-destructive tracking-wider">FAKE vs REAL — NEWS COMPARISON</h3>
          </div>
          <div className="grid md:grid-cols-2 divide-x divide-border">
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-mono text-destructive tracking-wider">❌ DETECTED FAKE</span>
              <p className="text-sm text-foreground font-medium">Original content flagged as {result.prediction.toLowerCase()}</p>
              <p className="text-xs text-muted-foreground">{result.comparison_summary}</p>
            </div>
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-mono text-success tracking-wider">✅ CORRECTED REAL</span>
              <p className="text-sm text-foreground font-medium">{result.corrected_title}</p>
              <p className="text-xs text-muted-foreground">{result.corrected_description}</p>
              <p className="text-[10px] font-mono text-primary mt-2">Source: {result.corrected_source}</p>
            </div>
          </div>
        </div>
      )}

      {/* Raw JSON */}
      <details className="glass-card rounded-lg overflow-hidden">
        <summary className="px-4 py-3 text-xs font-mono text-muted-foreground tracking-wider cursor-pointer hover:bg-secondary/50">
          RAW JSON OUTPUT
        </summary>
        <pre className="p-4 text-xs font-mono text-primary/80 overflow-x-auto border-t border-border bg-background/50">
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default AnalysisResults;
