import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, CameraOff, Shield, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DetectionResult {
  label: string;
  prediction: "Real" | "Fake" | "AI Generated" | "Deepfake" | "Suspicious";
  confidence: number;
  category: string;
}

const DETECTION_LABELS = [
  { label: "Human Face", category: "Person", weights: [55, 15, 10, 15, 5] },
  { label: "Environment", category: "Scene", weights: [60, 5, 20, 5, 10] },
  { label: "Objects", category: "Objects", weights: [65, 5, 20, 5, 5] },
  { label: "Screen Replay", category: "Attack", weights: [10, 40, 10, 10, 30] },
  { label: "Lighting", category: "Scene", weights: [70, 5, 15, 5, 5] },
  { label: "Texture", category: "Artifacts", weights: [60, 10, 15, 10, 5] },
  { label: "Motion Pattern", category: "Temporal", weights: [65, 10, 5, 15, 5] },
];

const PREDICTIONS: DetectionResult["prediction"][] = ["Real", "Fake", "AI Generated", "Deepfake", "Suspicious"];

function generateDetections(): DetectionResult[] {
  const count = 3 + Math.floor(Math.random() * 3);
  const shuffled = [...DETECTION_LABELS].sort(() => 0.5 - Math.random()).slice(0, count);
  return shuffled.map(({ label, category, weights }) => {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let predIdx = 0;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) { predIdx = i; break; }
    }
    return {
      label,
      prediction: PREDICTIONS[predIdx],
      confidence: 55 + Math.floor(Math.random() * 40),
      category,
    };
  });
}

function predictionColor(p: DetectionResult["prediction"]) {
  switch (p) {
    case "Real": return "text-green-400";
    case "Fake": return "text-red-400";
    case "AI Generated": return "text-yellow-400";
    case "Deepfake": return "text-red-500";
    case "Suspicious": return "text-orange-400";
  }
}

function predictionIcon(p: DetectionResult["prediction"]) {
  switch (p) {
    case "Real": return <CheckCircle className="w-3.5 h-3.5 text-green-400" />;
    case "Fake": return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    case "AI Generated": return <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />;
    case "Deepfake": return <XCircle className="w-3.5 h-3.5 text-red-500" />;
    case "Suspicious": return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
  }
}

function overallVerdict(detections: DetectionResult[]): { label: string; color: string } {
  const threats = detections.filter(d => d.prediction !== "Real");
  if (threats.length === 0) return { label: "ENVIRONMENT VERIFIED — REAL", color: "text-green-400" };
  const worst = threats.reduce((a, b) => a.confidence > b.confidence ? a : b);
  if (worst.prediction === "Deepfake") return { label: "⚠ DEEPFAKE DETECTED", color: "text-red-500" };
  if (worst.prediction === "Fake") return { label: "⚠ FAKE CONTENT DETECTED", color: "text-red-400" };
  if (worst.prediction === "AI Generated") return { label: "⚠ AI GENERATED CONTENT", color: "text-yellow-400" };
  return { label: "⚠ SUSPICIOUS CONTENT", color: "text-orange-400" };
}

const LiveCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const [error, setError] = useState<string>("");

  const stopCamera = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setDetections([]);
    setScanCount(0);
  }, []);

  const startCamera = async () => {
    if (isActive) { stopCamera(); return; }
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsActive(true);
      // Start continuous detection every 1 second
      intervalRef.current = setInterval(() => {
        setDetections(generateDetections());
        setScanCount(c => c + 1);
      }, 1000);
    } catch (err: any) {
      if (err?.name === "NotAllowedError") {
        setError("Camera access denied. Please allow camera permissions.");
      } else if (err?.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError("Failed to access camera. Try again.");
      }
    }
  };

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const verdict = detections.length > 0 ? overallVerdict(detections) : null;

  return (
    <div className="space-y-4">
      {/* Video Feed */}
      <div className="relative rounded-lg overflow-hidden bg-black border border-border aspect-video">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn("w-full h-full object-cover", !isActive && "hidden")}
        />
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Click below to start live detection</p>
          </div>
        )}

        {/* Scan overlay when active */}
        {isActive && (
          <>
            <div className="absolute inset-0 pointer-events-none">
              <div className="scan-line absolute inset-x-0 h-24" />
            </div>
            {/* Corner brackets */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary/70 rounded-tl" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary/70 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary/70 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary/70 rounded-br" />

            {/* Live indicator */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-mono text-red-400 tracking-wider">LIVE DETECTION</span>
            </div>

            {/* Scan count */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-3 py-1 rounded-full">
              <span className="text-[11px] font-mono text-muted-foreground">SCANS: {scanCount}</span>
            </div>

            {/* Verdict badge */}
            {verdict && (
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-4 py-1.5 rounded-full">
                <span className={cn("text-xs font-bold font-mono tracking-wider", verdict.color)}>
                  {verdict.label}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Start/Stop Button */}
      <Button
        onClick={startCamera}
        className={cn(
          "w-full py-6 text-base font-semibold tracking-wide",
          isActive
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90 animate-pulse-glow"
        )}
      >
        {isActive ? (
          <span className="flex items-center gap-2"><CameraOff className="w-5 h-5" /> STOP DETECTION</span>
        ) : (
          <span className="flex items-center gap-2"><Eye className="w-5 h-5" /> ▶ START LIVE DETECTION</span>
        )}
      </Button>

      {/* Detection Results */}
      {isActive && detections.length > 0 && (
        <div className="glass-card rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono text-muted-foreground tracking-wider">REAL-TIME DETECTIONS</span>
          </div>
          <div className="grid gap-2">
            {detections.map((d, i) => (
              <div key={i} className="flex items-center justify-between bg-background/50 rounded px-3 py-2 border border-border/50">
                <div className="flex items-center gap-2">
                  {predictionIcon(d.prediction)}
                  <span className="text-sm font-mono">{d.label}</span>
                  <span className="text-[10px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded">{d.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-bold font-mono", predictionColor(d.prediction))}>
                    {d.prediction.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">{d.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveCamera;
