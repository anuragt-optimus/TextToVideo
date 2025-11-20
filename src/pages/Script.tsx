import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wand2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ProgressSteps } from "@/components/ProgressSteps";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  { number: 3, label: "Preview" },
  { number: 4, label: "Export" },
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

  const restoredScenes = location.state?.scenes || null;

const apiScenes = location.state?.apiResponse?.data?.scenes || [];

const [scenes, setScenes] = useState<Scene[]>(() => {
  // If editing from preview → restore previous scenes
  if (restoredScenes) return restoredScenes;

  // Else load newly generated API scenes
  if (apiScenes.length > 0) {
    return apiScenes.map((s: any) => ({
      id: String(s.scene_number),
      text: s.scene_content,
      duration: Math.ceil((s.scene_content.split(" ").length || 0) * 0.4),
    }));
  }

  return [];
});



const uploadedContent = location.state?.content || location.state?.uploadedContent || "";
const uploadedTone = location.state?.tone || "Professional";
const uploadedFiles = location.state?.files || [];
const uploadedFormat = location.state?.format || "720×1280";
const uploadedDuration = location.state?.duration || 4;




  const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
  const totalWords = scenes.reduce((sum, scene) => sum + scene.text.split(' ').length, 0);

  const updateScene = (id: string, text: string) => {
    setScenes(scenes.map(scene => 
      scene.id === id ? { ...scene, text, duration: Math.ceil(text.split(' ').length * 0.4) } : scene
    ));
  };
  const handleNextPreview = async () => {
  setIsGenerating(true);

  try {
    const payload = {
      user_id: "string",
      session_id: crypto.randomUUID(),
      scenes: scenes.map((s, index) => ({
        scene_number: index + 1,
        scene_content: s.text,
      })),
      duration: location.state?.duration,
      aspect_ratio: location.state?.format,
      gender: location.state?.voice
    };
    console.log("------Video Generation Payload:", payload);

    const response = await fetch(
      "https://ca-texttovideo-prod-use2-1.jollygrass-c5390b44.eastus2.azurecontainerapps.io/api/v1/video/generate",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "Video generation failed",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }

    const videoUrl = result?.data?.video_file?.url;
    const videoId = videoUrl?.split("/").pop();

    navigate("/preview", {
  state: {
    videoId,
    scenes,
    content: uploadedContent,
    tone: uploadedTone,
    files: uploadedFiles,
    duration: location.state?.duration,
    format: uploadedFormat,
    voice: location.state?.voice
  },
});

  } catch (error) {
    console.error(error);
    toast({
      title: "Error",
      description: "Something went wrong while generating video.",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
};



  const addScene = () => {
  const newScene: Scene = {
    id: crypto.randomUUID(),
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

  

  const generateSceneWithAI = async (
  sceneId: string,
  sceneIndex: number,
  customPrompt?: string,
  toneOverride?: string,
  lengthPreference?: string
) => {
  setGeneratingSceneId(sceneId);
  setIsDialogOpen(false);


  console.log("------Selected Tone Override:", selectedToneOverride);

  try {
    const scene = scenes.find(s => s.id === sceneId);
    if (!scene) return;

    // Build request body EXACTLY as API expects
    const payload = {
      user_id: "string",
      session_id: crypto.randomUUID(),
      previous_prompt_content: scene.text,
      instruction_prompt: customPrompt || "",
      duration:
        lengthPreference === "short"
          ? 5
          : lengthPreference === "medium"
          ? 10
          : 20,
      tone: selectedToneOverride,
    };

    const response = await fetch(
      "https://ca-texttovideo-prod-use2-1.jollygrass-c5390b44.eastus2.azurecontainerapps.io/api/v1/script/scene/regenerate",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      toast({
        title: "Generation failed",
        description: "The AI could not regenerate this scene.",
        variant: "destructive",
      });
      return;
    }

    const newText =
      result?.data?.regenerated_content ||
      result?.data?.regenerated_scene_content ||
      "";

    // Update only one scene
    setScenes(
      scenes.map((s) =>
        s.id === sceneId
          ? {
              ...s,
              text: newText,
              duration: Math.ceil(newText.split(" ").length * 0.4),
            }
          : s
      )
    );

    toast({
      title: "Scene regenerated!",
      description: "AI updated this scene successfully.",
    });
  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Something went wrong while regenerating the scene.",
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
                        Scene {index + 1}
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
                                  <SelectValue placeholder={uploadedTone} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={uploadedTone}>Use uploaded tone ({uploadedTone})</SelectItem>
                                  <SelectItem value="professional">Professional</SelectItem>
                                  <SelectItem value="casual">Casual</SelectItem>
                                  <SelectItem value="energetic">Energetic</SelectItem>
                                  <SelectItem value="calm">Calm</SelectItem>
                                  <SelectItem value="humorous">Humorous</SelectItem>
                                  <SelectItem value="inspirational">Inspirational</SelectItem>
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
                                  <SelectItem value="short">Short (~4s)</SelectItem>
                                  <SelectItem value="medium">Medium (~8s)</SelectItem>
                                  <SelectItem value="long">Long (~12s)</SelectItem>
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
                    <div className="text-sm text-muted-foreground mb-1">Length</div>
                    <div className="text-2xl font-bold">{location.state?.duration}s</div>
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
            <Button 
  size="lg" 
  onClick={handleNextPreview} 
  className="px-8"
  disabled={isGenerating}
>
  {isGenerating ? (
    <div className="flex items-center gap-2">
      <svg
        className="animate-spin h-5 w-5"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
        ></path>
      </svg>
      Generating Video...
    </div>
  ) : (
    "Next: Preview Video"
  )}
</Button>



          </div>
        </div>
      </div>
    </div>
  );
};

export default Script;
