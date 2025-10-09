import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Image, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProgressSteps } from "@/components/ProgressSteps";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Voice" },
  { number: 4, label: "Avatar" },
  { number: 5, label: "Preview" },
  { number: 6, label: "Export" },
];

const SCENES = [
  { id: "1", title: "Scene 1", duration: "0:00-0:15" },
  { id: "2", title: "Scene 2", duration: "0:15-0:33" },
  { id: "3", title: "Scene 3", duration: "0:33-0:49" },
];

const Preview = () => {
  const navigate = useNavigate();
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoUploaded(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={5} steps={STEPS} />

        <div className="max-w-6xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-3">Video Preview & Edit</h1>
          <p className="text-muted-foreground mb-12">
            Review your video and make final adjustments
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Video Preview */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden mb-6">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <Play className="w-20 h-20 text-muted-foreground opacity-50" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                      <div className="h-1.5 bg-muted rounded-full mb-2">
                        <div className="h-full bg-primary rounded-full w-1/3" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>0:16</span>
                        <span>0:49</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Timeline */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Timeline</h3>
                <div className="space-y-3">
                  {SCENES.map((scene) => (
                    <div
                      key={scene.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{scene.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{scene.duration}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="captions">Show Captions</Label>
                    <Switch
                      id="captions"
                      checked={captionsEnabled}
                      onCheckedChange={setCaptionsEnabled}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Branding</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Logo</Label>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Image className="w-4 h-4" />
                      {logoUploaded ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                    <input
                      id="logo-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Background</Label>
                    <Button variant="outline" className="w-full gap-2">
                      <Image className="w-4 h-4" />
                      Change Background
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Regenerate Audio
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate("/script")}
                  >
                    Edit Script
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-between">
            <Button variant="outline" onClick={() => navigate("/avatar")}>
              Back
            </Button>
            <Button size="lg" onClick={() => navigate("/export")} className="px-8">
              Confirm and Export
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
