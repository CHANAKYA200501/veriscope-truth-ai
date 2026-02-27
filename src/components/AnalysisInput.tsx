import { useState, useRef } from "react";
import { FileText, Image, Mic, Video, Camera, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type InputType = "text" | "image" | "audio" | "video" | "camera";

interface AnalysisInputProps {
  onAnalyze: (type: InputType, content: string) => void;
  isAnalyzing: boolean;
}

const tabs: { type: InputType; icon: typeof FileText; label: string; accept?: string }[] = [
  { type: "text", icon: FileText, label: "News Text" },
  { type: "image", icon: Image, label: "Image", accept: "image/*" },
  { type: "audio", icon: Mic, label: "Audio", accept: "audio/*" },
  { type: "video", icon: Video, label: "Video", accept: "video/*" },
  { type: "camera", icon: Camera, label: "Camera" },
];

const AnalysisInput = ({ onAnalyze, isAnalyzing }: AnalysisInputProps) => {
  const [activeTab, setActiveTab] = useState<InputType>("text");
  const [textInput, setTextInput] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const content = activeTab === "text" ? textInput : fileName || `Sample ${activeTab} input`;
    if (!content.trim()) return;
    onAnalyze(activeTab, content);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const currentTab = tabs.find(t => t.type === activeTab);

  return (
    <div className="glass-card rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => { setActiveTab(type); setFileName(""); }}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3.5 px-2 text-sm font-medium transition-all",
              activeTab === type
                ? "text-primary bg-primary/10 border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-5">
        {activeTab === "text" ? (
          <Textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste news article, headline, or suspicious text here for analysis..."
            className="min-h-[160px] bg-background border-border font-mono text-sm resize-none focus:border-primary focus:ring-primary/20"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center min-h-[160px] border-2 border-dashed border-border rounded-lg bg-background/50 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => activeTab !== "camera" && fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept={currentTab?.accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              {fileName ? (
                <p className="text-sm text-foreground font-mono">{fileName}</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {activeTab === "camera"
                    ? "Capture a frame from your camera for analysis"
                    : `Click to upload ${activeTab} file or drag & drop`}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                {activeTab === "image" ? "PNG, JPG, WEBP" : activeTab === "audio" ? "MP3, WAV, M4A" : activeTab === "video" ? "MP4, WEBM, AVI" : "LIVE CAPTURE"}
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isAnalyzing || (activeTab === "text" ? !textInput.trim() : false)}
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide animate-pulse-glow disabled:animate-none py-6 text-base"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              SCANNING...
            </span>
          ) : (
            "▶ ANALYZE"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisInput;
