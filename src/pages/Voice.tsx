import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressSteps } from "@/components/ProgressSteps";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Voice" },
  { number: 4, label: "Avatar" },
  { number: 5, label: "Preview" },
  { number: 6, label: "Export" },
];

const VOICES = [
  { id: "alex", name: "Alex", tone: "Conversational", recommended: true },
  { id: "dana", name: "Dana", tone: "Professional", recommended: true },
  { id: "sam", name: "Sam", tone: "Energetic", recommended: false },
  { id: "morgan", name: "Morgan", tone: "Warm", recommended: false },
  { id: "jordan", name: "Jordan", tone: "Authoritative", recommended: false },
  { id: "casey", name: "Casey", tone: "Friendly", recommended: false },
];

const Voice = () => {
  const navigate = useNavigate();
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

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
            {VOICES.map((voice) => (
              <Card
                key={voice.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-medium ${
                  selectedVoice === voice.id ? 'ring-2 ring-primary' : ''
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

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Play className="w-4 h-4" />
                  Preview
                </Button>
              </Card>
            ))}
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
