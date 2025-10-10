import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressSteps } from "@/components/ProgressSteps";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Voice" },
  { number: 4, label: "Avatar" },
  { number: 5, label: "Preview" },
  { number: 6, label: "Export" },
];

const PRESET_AVATARS = [
  { id: "1", name: "Sarah", style: "Professional", gender: "Female", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4" },
  { id: "2", name: "Michael", style: "Casual", gender: "Male", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c0aede" },
  { id: "3", name: "Elena", style: "Formal", gender: "Female", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc" },
  { id: "4", name: "James", style: "Professional", gender: "Male", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=d1d4f9" },
  { id: "5", name: "Priya", style: "Casual", gender: "Female", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffeaa7" },
  { id: "6", name: "David", style: "Formal", gender: "Male", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=fab1a0" },
];

const Avatar = () => {
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedAvatar(null);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <ProgressSteps currentStep={4} steps={STEPS} />

        <div className="max-w-6xl mx-auto mt-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Step 4 of 6</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Choose Your Avatar
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select from our professionally designed avatars or upload your own photo for a personalized experience
            </p>
          </div>

          <Tabs defaultValue="preset" className="mb-16">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 h-14 p-1 bg-muted/50 backdrop-blur">
              <TabsTrigger value="preset" className="text-base font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Preset Avatars
              </TabsTrigger>
              <TabsTrigger value="upload" className="text-base font-medium">
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="mt-10">
              <div className="grid md:grid-cols-3 gap-6">
                {PRESET_AVATARS.map((avatar) => (
                  <Card
                    key={avatar.id}
                    className={`group relative p-6 cursor-pointer transition-all duration-300 hover:shadow-medium hover:-translate-y-1 ${
                      selectedAvatar === avatar.id && !uploadedImage 
                        ? 'ring-2 ring-primary shadow-medium shadow-primary/20' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedAvatar(avatar.id);
                      setUploadedImage(null);
                      toast.success(`${avatar.name} selected`);
                    }}
                  >
                    {selectedAvatar === avatar.id && !uploadedImage && (
                      <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl mb-4 overflow-hidden shadow-soft">
                      <img 
                        src={avatar.image} 
                        alt={`${avatar.name} avatar`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{avatar.name}</h3>
                        <Badge variant="secondary" className="text-xs">{avatar.gender}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{avatar.style}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-10">
              <div className="max-w-xl mx-auto">
                {uploadedImage ? (
                  <div className="space-y-6 animate-fade-in">
                    <Card className="relative p-8 ring-2 ring-primary shadow-medium shadow-primary/20">
                      <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden shadow-soft mb-4">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-base font-semibold text-center">Your Custom Avatar</p>
                      <p className="text-sm text-muted-foreground text-center mt-1">Ready to use in your video</p>
                    </Card>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full gap-2"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Different Image
                    </Button>
                  </div>
                ) : (
                  <Card 
                    className="group p-16 border-2 border-dashed cursor-pointer hover:border-primary hover:bg-muted/30 transition-all duration-300 hover:shadow-medium"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-xl font-semibold mb-2">Upload Your Photo</p>
                      <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">
                        Click to browse your files or drag and drop your image here
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline">JPG</Badge>
                        <Badge variant="outline">PNG</Badge>
                        <span className="text-muted-foreground/70">•</span>
                        <span>Max 10MB</span>
                      </div>
                    </div>
                  </Card>
                )}
                
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png"
                  onChange={handleImageUpload}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Preview Section */}
          {(selectedAvatar || uploadedImage) && (
            <Card className="p-8 mb-16 bg-gradient-to-br from-muted/50 to-muted/30 border-primary/20 shadow-soft animate-fade-in">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Avatar Ready</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your selected avatar will be lip-synced with the voice you chose in the previous step, creating a natural and engaging video presentation.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/voice")}
              className="px-8"
            >
              Back
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/preview")} 
              disabled={!selectedAvatar && !uploadedImage}
              className="px-10 shadow-medium disabled:shadow-none"
            >
              Continue to Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
