import { Shield, ShieldX, ShieldCheck, ShieldAlert, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

const recentAnalyses = [
  { id: 1, type: "text", prediction: "Fake", confidence: 87, time: "2 min ago", title: "Breaking: Shocking claim about..." },
  { id: 2, type: "image", prediction: "Real", confidence: 94, time: "5 min ago", title: "Press conference photo" },
  { id: 3, type: "video", prediction: "Deepfake", confidence: 91, time: "12 min ago", title: "Celebrity video clip" },
  { id: 4, type: "text", prediction: "AI Generated", confidence: 82, time: "18 min ago", title: "Product review article" },
  { id: 5, type: "url", prediction: "Fake", confidence: 76, time: "25 min ago", title: "http://free-news-win.xyz/..." },
  { id: 6, type: "audio", prediction: "Real", confidence: 96, time: "30 min ago", title: "Interview recording" },
];

const predictionColors: Record<string, string> = {
  Real: "text-success",
  Fake: "text-destructive",
  "AI Generated": "text-warning",
  Deepfake: "text-destructive",
};

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-display text-3xl tracking-wider">DETECTION <span className="text-gradient-primary">DASHBOARD</span></h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time monitoring and analysis overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Shield, label: "Total Scans", value: "12,847", color: "text-primary" },
          { icon: ShieldX, label: "Fakes Detected", value: "3,291", color: "text-destructive" },
          { icon: ShieldCheck, label: "Verified Real", value: "8,432", color: "text-success" },
          { icon: ShieldAlert, label: "AI Generated", value: "1,124", color: "text-warning" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className="text-xs font-mono text-muted-foreground">{label.toUpperCase()}</span>
            </div>
            <div className={`text-2xl font-display tracking-wider ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Detection Accuracy */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-xs font-mono text-muted-foreground tracking-wider mb-4">DETECTION ACCURACY BY TYPE</h3>
        <div className="space-y-3">
          {[
            { label: "Text Analysis", value: 97, color: "bg-primary" },
            { label: "Image Detection", value: 94, color: "bg-primary" },
            { label: "Video Deepfake", value: 91, color: "bg-warning" },
            { label: "Audio Analysis", value: 89, color: "bg-warning" },
            { label: "URL Verification", value: 96, color: "bg-primary" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="text-foreground">{value}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="glass-card rounded-lg p-5">
        <h3 className="text-xs font-mono text-muted-foreground tracking-wider mb-4">RECENT ANALYSES</h3>
        <div className="space-y-2">
          {recentAnalyses.map((a) => (
            <div key={a.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground uppercase">{a.type}</span>
                <span className="text-sm text-foreground truncate max-w-[200px] sm:max-w-none">{a.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-mono ${predictionColors[a.prediction]}`}>{a.prediction}</span>
                <span className="text-xs font-mono text-muted-foreground">{a.confidence}%</span>
                <span className="text-[10px] text-muted-foreground hidden sm:inline">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
