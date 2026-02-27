import { useState } from "react";
import { FileText, Image, Mic, Video, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type InputType = "text" | "image" | "audio" | "video" | "camera";

interface AnalysisInputProps {
  onAnalyze: (type: InputType, content: string) => void;
  isAnalyzing: boolean;
}

const tabs: { type: InputType; icon: typeof FileText; label: string }[] = [
  { type: "text", icon: FileText, label: "News Text" },
  { type: "image", icon: Image, label: "Image" },
  { type: "audio", icon: Mic, label: "Audio" },
  { type: "video", icon: Video, label: "Video" },
  { type: "camera", icon: Camera, label: "Camera" },
];

const AnalysisInput = ({ onAnalyze, isAnalyzing }: AnalysisInputProps) => {
  const [activeTab, setActiveTab] = useState<InputType>("text");
  const [textInput, setTextInput] = useState("");
  const [fileInput, setFileInput] = useState<string>("");

  const handleSubmit = () => {
    const content = activeTab === "text" ? textInput : fileInput || `Sample ${activeTab} input`;
    if (!content.trim()) return;
    onAnalyze(activeTab, content);
  };

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 px-2 text-sm font-medium transition-all",
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
            className="min-h-[140px] bg-background border-border font-mono text-sm resize-none focus:border-primary focus:ring-primary/20"
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[140px] border-2 border-dashed border-border rounded-lg bg-background/50 hover:border-primary/50 transition-colors">
            <div className="text-center p-6">
              {tabs.find((t) => t.type === activeTab)?.icon && (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  {(() => {
                    const TabIcon = tabs.find((t) => t.type === activeTab)!.icon;
                    return <TabIcon className="w-6 h-6 text-primary" />;
                  })()}
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-3">
                {activeTab === "camera"
                  ? "Capture a frame from your camera for analysis"
                  : `Upload ${activeTab} file or paste URL`}
              </p>
              <Input
                type="text"
                placeholder={activeTab === "camera" ? "Camera capture (demo)" : `Paste ${activeTab} URL...`}
                value={fileInput}
                onChange={(e) => setFileInput(e.target.value)}
                className="max-w-sm mx-auto bg-background border-border text-sm"
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isAnalyzing || (activeTab === "text" ? !textInput.trim() : false)}
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold tracking-wide animate-pulse-glow disabled:animate-none"
        >
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
