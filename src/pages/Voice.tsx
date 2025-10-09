import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressSteps } from "@/components/ProgressSteps";
import VoiceWaveform from "@/components/VoiceWaveform";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Voice" },
  { number: 4, label: "Avatar" },
  { number: 5, label: "Preview" },
  { number: 6, label: "Export" },
];

const VOICE_CONFIG: Record<string, { preferredNames: string[], pitch: number, rate: number, gender: string }> = {
  alex: { 
    preferredNames: ['Google US English', 'Microsoft David', 'Alex'],
    pitch: 1.0,
    rate: 1.0,
    gender: 'male'
  },
  dana: { 
    preferredNames: ['Google UK English Female', 'Microsoft Zira', 'Samantha'],
    pitch: 1.1,
    rate: 0.95,
    gender: 'female'
  },
  sam: { 
    preferredNames: ['Google US English', 'Microsoft Mark'],
    pitch: 1.2,
    rate: 1.1,
    gender: 'male'
  },
  morgan: { 
    preferredNames: ['Google UK English Female', 'Microsoft Hazel'],
    pitch: 0.9,
    rate: 0.9,
    gender: 'female'
  },
  jordan: { 
    preferredNames: ['Google US English', 'Microsoft David'],
    pitch: 0.8,
    rate: 0.95,
    gender: 'male'
  },
  casey: { 
    preferredNames: ['Google UK English Female', 'Microsoft Zira'],
    pitch: 1.0,
    rate: 1.0,
    gender: 'female'
  }
};

const VOICES = [
  { id: "alex", name: "Alex", tone: "Conversational", recommended: true },
  { id: "dana", name: "Dana", tone: "Professional", recommended: true },
  { id: "sam", name: "Sam", tone: "Energetic", recommended: false },
  { id: "morgan", name: "Morgan", tone: "Warm", recommended: false },
  { id: "jordan", name: "Jordan", tone: "Authoritative", recommended: false },
  { id: "casey", name: "Casey", tone: "Friendly", recommended: false },
];

const SAMPLE_TEXT = "Welcome to your AI video creator. This is how your voice will sound in the final video. Let's create something amazing together!";

const Voice = () => {
  const navigate = useNavigate();
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const findBestVoiceMatch = (
    voiceId: string,
    voices: SpeechSynthesisVoice[]
  ): SpeechSynthesisVoice | null => {
    const config = VOICE_CONFIG[voiceId];
    if (!config) return null;

    for (const name of config.preferredNames) {
      const match = voices.find(v => v.name.includes(name));
      if (match) return match;
    }
    
    const genderMatches = voices.filter(v => 
      v.lang.startsWith('en') && 
      (config.gender === 'female' ? v.name.toLowerCase().includes('female') : true)
    );
    
    return genderMatches[0] || voices.find(v => v.lang.startsWith('en')) || voices[0];
  };

  const handlePlayPause = (voiceId: string) => {
    if (playingVoice === voiceId) {
      window.speechSynthesis.cancel();
      setPlayingVoice(null);
      return;
    }
    
    if (playingVoice) {
      window.speechSynthesis.cancel();
    }
    
    const newUtterance = new SpeechSynthesisUtterance(SAMPLE_TEXT);
    
    const voiceConfig = VOICE_CONFIG[voiceId];
    const bestVoice = findBestVoiceMatch(voiceId, availableVoices);
    
    if (bestVoice) {
      newUtterance.voice = bestVoice;
    }
    
    newUtterance.pitch = voiceConfig.pitch;
    newUtterance.rate = voiceConfig.rate;
    
    const estimatedDuration = (SAMPLE_TEXT.length / 15) * 1000;
    let startTime = Date.now();
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(elapsed / estimatedDuration, 1);
      setProgress(prev => ({ ...prev, [voiceId]: currentProgress }));
      
      if (currentProgress >= 1 || playingVoice !== voiceId) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    newUtterance.onstart = () => {
      setPlayingVoice(voiceId);
      setProgress(prev => ({ ...prev, [voiceId]: 0 }));
    };
    
    newUtterance.onend = () => {
      setPlayingVoice(null);
      setProgress(prev => ({ ...prev, [voiceId]: 0 }));
      clearInterval(progressInterval);
    };
    
    newUtterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setPlayingVoice(null);
      setProgress(prev => ({ ...prev, [voiceId]: 0 }));
      clearInterval(progressInterval);
    };
    
    window.speechSynthesis.speak(newUtterance);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={3} steps={STEPS} />

        <div className="max-w-5xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-3">Choose AI Voice</h1>
          <p className="text-muted-foreground mb-12">
            Select the perfect voice for your video
          </p>

          {/* Recommendations */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-12">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">AI Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Based on your script tone, we recommend: <strong>Alex</strong> or <strong>Dana</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Voice Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {VOICES.map((voice) => {
              const isPlaying = playingVoice === voice.id;
              const voiceProgress = progress[voice.id] || 0;
              
              return (
                <Card
                  key={voice.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-medium ${
                    selectedVoice === voice.id ? 'ring-2 ring-primary' : ''
                  } ${
                    isPlaying ? 'ring-2 ring-primary/50 shadow-lg shadow-primary/20' : ''
                  }`}
                  onClick={() => setSelectedVoice(voice.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{voice.name}</h3>
                      <p className="text-sm text-muted-foreground">{voice.tone}</p>
                    </div>
                    {voice.recommended && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        Recommended
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4">
                    <VoiceWaveform 
                      isPlaying={isPlaying}
                      progress={voiceProgress}
                    />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayPause(voice.id);
                    }}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Play
                      </>
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/script")}>
              Back
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/avatar")} 
              disabled={!selectedVoice}
              className="px-8"
            >
              Next: Add Avatar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voice;
