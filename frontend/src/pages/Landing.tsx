import { Shield, FileText, Image, Mic, Video, Globe, Zap, Database, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: FileText, title: "Fake News Detection", desc: "AI-powered text analysis with Google News verification" },
  { icon: Image, title: "Image Analysis", desc: "Detect AI-generated and manipulated images" },
  { icon: Mic, title: "Audio Deepfake", desc: "Identify AI voice clones and synthetic audio" },
  { icon: Video, title: "Video Deepfake", desc: "EfficientNet-based deepfake video detection" },
  { icon: Globe, title: "URL Scanner", desc: "Verify URL trustworthiness and domain safety" },
  { icon: Database, title: "Dataset Comparison", desc: "Cross-reference with verified news databases" },
];

const stats = [
  { value: "2.4M+", label: "Analyses Run" },
  { value: "847K", label: "Deepfakes Caught" },
  { value: "97.3%", label: "Accuracy Rate" },
  { value: "< 3s", label: "Avg Response" },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, hsl(0 84% 50% / 0.15) 0%, transparent 60%)' }} />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-mono text-primary mb-6">
            <Eye className="w-3.5 h-3.5" />
            HACKATHON-WINNING DETECTION PLATFORM
          </div>

          <h1 className="font-display text-6xl sm:text-8xl tracking-wide text-foreground mb-4">
            <span className="text-gradient-primary">VERI</span>SCOPE
          </h1>
          <h2 className="font-display text-3xl sm:text-4xl tracking-wider text-muted-foreground mb-6">
            AI DETECTION SYSTEM
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm leading-relaxed">
            Multimodal deepfake and fake content detection powered by AI.
            Analyze text, images, audio, video, and URLs with real-time
            verification against trusted news sources.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate("/upload")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-semibold glow-primary"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Analyzing
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="border-border hover:bg-secondary px-8 py-6 text-base"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="glass-card rounded-lg p-6 text-center glass-card-hover">
              <div className="text-3xl font-display text-primary tracking-wider">{value}</div>
              <div className="text-[10px] font-mono text-muted-foreground tracking-wider mt-2">{label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h3 className="font-display text-3xl tracking-wider text-center mb-2">DETECTION <span className="text-gradient-primary">CAPABILITIES</span></h3>
        <p className="text-muted-foreground text-center text-sm mb-10">Complete multimodal analysis suite</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card-hover rounded-lg p-6 group cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Landing;
