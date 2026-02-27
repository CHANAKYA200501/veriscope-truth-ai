import { BarChart3, TrendingUp, PieChart } from "lucide-react";

const typeBreakdown = [
  { type: "Text", count: 5420, pct: 42 },
  { type: "Image", count: 3210, pct: 25 },
  { type: "Video", count: 1840, pct: 14 },
  { type: "Audio", count: 1290, pct: 10 },
  { type: "URL", count: 1087, pct: 9 },
];

const weeklyData = [
  { day: "Mon", scans: 1820 },
  { day: "Tue", scans: 2100 },
  { day: "Wed", scans: 1950 },
  { day: "Thu", scans: 2340 },
  { day: "Fri", scans: 2780 },
  { day: "Sat", scans: 1560 },
  { day: "Sun", scans: 1290 },
];

const maxScans = Math.max(...weeklyData.map(d => d.scans));

const Analytics = () => (
  <div className="p-6 space-y-6 animate-fade-in-up">
    <div>
      <h1 className="font-display text-3xl tracking-wider">DETECTION <span className="text-gradient-primary">ANALYTICS</span></h1>
      <p className="text-sm text-muted-foreground mt-1">Performance metrics and detection statistics</p>
    </div>

    <div className="grid lg:grid-cols-2 gap-4">
      {/* Weekly Chart */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-mono text-muted-foreground tracking-wider">WEEKLY SCAN VOLUME</h3>
        </div>
        <div className="flex items-end gap-2 h-40">
          {weeklyData.map(({ day, scans }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-mono text-muted-foreground">{scans}</span>
              <div className="w-full rounded-t bg-primary/20 relative overflow-hidden" style={{ height: `${(scans / maxScans) * 100}%` }}>
                <div className="absolute inset-0 bg-primary/60" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Type Breakdown */}
      <div className="glass-card rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-primary" />
          <h3 className="text-xs font-mono text-muted-foreground tracking-wider">ANALYSIS BY TYPE</h3>
        </div>
        <div className="space-y-3">
          {typeBreakdown.map(({ type, count, pct }) => (
            <div key={type}>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-foreground">{type}</span>
                <span className="text-muted-foreground">{count.toLocaleString()} ({pct}%)</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Prediction Distribution */}
    <div className="glass-card rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-mono text-muted-foreground tracking-wider">PREDICTION DISTRIBUTION</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Real", value: "65.6%", count: "8,432", color: "text-success" },
          { label: "Fake", value: "18.7%", count: "2,403", color: "text-destructive" },
          { label: "AI Generated", value: "8.7%", count: "1,124", color: "text-warning" },
          { label: "Deepfake", value: "6.9%", count: "888", color: "text-destructive" },
        ].map(({ label, value, count, color }) => (
          <div key={label} className="text-center p-4 rounded-lg bg-secondary/30">
            <div className={`font-display text-2xl tracking-wider ${color}`}>{value}</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">{label}</div>
            <div className="text-[10px] font-mono text-muted-foreground">{count} scans</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Analytics;
