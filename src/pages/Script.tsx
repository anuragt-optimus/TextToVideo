import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wand2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ProgressSteps } from "@/components/ProgressSteps";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Voice" },
  { number: 4, label: "Avatar" },
  { number: 5, label: "Preview" },
  { number: 6, label: "Export" },
];

interface Scene {
  id: string;
  text: string;
  duration: number;
}

const Script = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [scenes, setScenes] = useState<Scene[]>([
    { id: "1", text: "Welcome to our revolutionary AI video platform. Today, we're going to show you how easy it is to transform any content into professional talking-head videos.", duration: 15 },
    { id: "2", text: "With our advanced AI technology, you can upload documents, paste text, or even start from scratch. The platform automatically generates a natural-sounding script optimized for video.", duration: 18 },
    { id: "3", text: "Choose from multiple AI voices, customize your avatar, and export in any format you need. It's that simple to create engaging video content at scale.", duration: 16 },
  ]);

  const uploadedContent = location.state?.content || "";
  const uploadedTone = location.state?.tone || "Professional";

  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const totalWords = scenes.reduce((sum, scene) => sum + scene.text.split(' ').length, 0);

  const updateScene = (id: string, text: string) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, text, duration: Math.ceil(text.split(' ').length * 0.4) } : scene
    ));
  };

  const addScene = () => {
    const newScene: Scene = {
      id: String(scenes.length + 1),
      text: "",
      duration: 0,
    };
    setScenes([...scenes, newScene]);
  };

  const deleteScene = (id: string) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter(scene => scene.id !== id));
    }
  };

  const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSceneId, setCurrentSceneId] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [selectedToneOverride, setSelectedToneOverride] = useState<string>("default");
  const [selectedLength, setSelectedLength] = useState<string>("medium");

  const generateWithAI = async () => {
    if (!uploadedContent) {
      toast({
        title: "No content available",
        description: "Please upload or paste content first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: { content: uploadedContent, tone: uploadedTone },
      });

      if (error) {
        throw error;
      }

      if (data?.scenes) {
        setScenes(data.scenes);
        toast({
          title: "Script generated!",
          description: "Your AI-generated script is ready to edit",
        });
      }
    } catch (error) {
      console.error("Error generating script:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate script",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSceneWithAI = async (
    sceneId: string, 
    sceneIndex: number,
    customPrompt?: string,
    toneOverride?: string,
    lengthPreference?: string
  ) => {
    setGeneratingSceneId(sceneId);
    setIsDialogOpen(false);
    
    try {
      const context = uploadedContent || scenes.map(s => s.text).join(' ');
      
      // Build enhanced prompt
      let enhancedPrompt = `Generate content for scene ${sceneIndex + 1} of a video script.`;
      
      if (customPrompt) {
        enhancedPrompt += ` User instructions: ${customPrompt}.`;
      }
      
      if (lengthPreference) {
        const lengthMap: Record<string, string> = {
          short: "Keep it brief, around 10 seconds",
          medium: "Make it medium length, around 15 seconds",
          long: "Make it detailed, around 20 seconds"
        };
        enhancedPrompt += ` ${lengthMap[lengthPreference]}.`;
      }
      
      enhancedPrompt += ` Context: ${context}`;
      
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: { 
          content: enhancedPrompt,
          tone: toneOverride && toneOverride !== "default" ? toneOverride : uploadedTone 
        },
      });

      if (error) {
        throw error;
      }

      if (data?.scenes && data.scenes.length > 0) {
        const generatedScene = data.scenes[0];
        setScenes(scenes.map(scene => 
          scene.id === sceneId 
            ? { ...scene, text: generatedScene.text, duration: generatedScene.duration }
            : scene
        ));
        toast({
          title: "Scene generated!",
          description: "AI has generated content for this scene",
        });
      }
    } catch (error) {
      console.error("Error generating scene:", error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate scene",
        variant: "destructive",
      });
    } finally {
      setGeneratingSceneId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={2} steps={STEPS} />

        <div className="max-w-5xl mx-auto mt-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Script Editor</h1>
            <p className="text-muted-foreground">
              Review and edit your AI-generated script
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Editor */}
            <div className="lg:col-span-3 space-y-6">
              {scenes.map((scene, index) => (
                <Card key={scene.id} className="p-6 hover:shadow-medium transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Scene {index + 1} • ~{scene.duration}s
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentSceneId(scene.id);
                              setUserPrompt("");
                              setSelectedToneOverride("default");
                              setSelectedLength("medium");
                            }}
                            disabled={generatingSceneId === scene.id}
                            className="gap-2"
                          >
                            <Wand2 className="w-4 h-4" />
                            {generatingSceneId === scene.id ? "Generating..." : "Generate with AI"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Generate Scene Content with AI</DialogTitle>
                            <DialogDescription>
                              Provide instructions to customize how AI generates this scene
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="prompt">Custom Instructions (Optional)</Label>
                              <Textarea
                                id="prompt"
                                placeholder="e.g., Make it more technical, focus on benefits, add a call-to-action..."
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="tone">Tone</Label>
                              <Select value={selectedToneOverride} onValueChange={setSelectedToneOverride}>
                                <SelectTrigger id="tone">
                                  <SelectValue placeholder={`Use uploaded tone (${uploadedTone})`} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="default">Use uploaded tone ({uploadedTone})</SelectItem>
                                  <SelectItem value="Professional">Professional</SelectItem>
                                  <SelectItem value="Casual">Casual</SelectItem>
                                  <SelectItem value="Friendly">Friendly</SelectItem>
                                  <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                                  <SelectItem value="Narrative">Narrative</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="length">Preferred Length</Label>
                              <Select value={selectedLength} onValueChange={setSelectedLength}>
                                <SelectTrigger id="length">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="short">Short (~10s)</SelectItem>
                                  <SelectItem value="medium">Medium (~15s)</SelectItem>
                                  <SelectItem value="long">Long (~20s)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {scene.text && (
                              <div className="space-y-2">
                                <Label>Current Scene</Label>
                                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md max-h-[100px] overflow-y-auto">
                                  {scene.text}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              onClick={() => {
                                if (currentSceneId) {
                                  const sceneIndex = scenes.findIndex(s => s.id === currentSceneId);
                                  generateSceneWithAI(
                                    currentSceneId, 
                                    sceneIndex, 
                                    userPrompt, 
                                    selectedToneOverride, 
                                    selectedLength
                                  );
                                }
                              }}
                              disabled={generatingSceneId === scene.id}
                            >
                              Generate
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {scenes.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteScene(scene.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={scene.text}
                    onChange={(e) => updateScene(scene.id, e.target.value)}
                    className="min-h-[120px] resize-none"
                    placeholder="Enter scene dialogue..."
                  />
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={addScene}
                className="w-full gap-2 border-dashed"
              >
                <Plus className="w-4 h-4" />
                Add Scene
              </Button>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Script Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Word Count</div>
                    <div className="text-2xl font-bold">{totalWords}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Estimated Length</div>
                    <div className="text-2xl font-bold">{totalDuration}s</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Scenes</div>
                    <div className="text-2xl font-bold">{scenes.length}</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-between">
            <Button variant="outline" onClick={() => navigate("/upload")}>
              Back
            </Button>
            <Button size="lg" onClick={() => navigate("/voice")} className="px-8">
              Next: Choose Voice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Script;
