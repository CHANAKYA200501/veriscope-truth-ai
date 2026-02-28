const ScanOverlay = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-10">
    <div className="scan-line absolute inset-x-0 h-24" />
    <div className="absolute inset-0 animate-shimmer rounded-lg" />
  </div>
);

export default ScanOverlay;
