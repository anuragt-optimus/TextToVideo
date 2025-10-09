import { useEffect, useState } from "react";

interface VoiceWaveformProps {
  isPlaying: boolean;
  progress: number;
  bars?: number;
}

const VoiceWaveform = ({ isPlaying, progress, bars = 25 }: VoiceWaveformProps) => {
  const [barHeights, setBarHeights] = useState<number[]>([]);

  useEffect(() => {
    // Generate random heights for bars
    const heights = Array.from({ length: bars }, () => Math.random() * 60 + 20);
    setBarHeights(heights);
  }, [bars]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setBarHeights(prev => 
        prev.map(() => Math.random() * 60 + 20)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-2">
      {/* Waveform */}
      <div className="flex items-center justify-center gap-[2px] h-[50px]">
        {barHeights.map((height, index) => (
          <div
            key={index}
            className={`w-[3px] rounded-full transition-all duration-150 ${
              isPlaying 
                ? 'bg-gradient-to-t from-primary to-primary/60' 
                : 'bg-muted'
            }`}
            style={{ 
              height: `${isPlaying ? height : height * 0.4}%`,
              opacity: index / bars < progress ? 1 : 0.3
            }}
          />
        ))}
      </div>

      {/* Progress bar and duration */}
      <div className="space-y-1">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-100 rounded-full"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{Math.floor(progress * 8)}s</span>
          <span>8s</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceWaveform;
