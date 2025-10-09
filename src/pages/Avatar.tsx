import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressSteps } from "@/components/ProgressSteps";
import { toast } from "sonner";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Voice" },
  { number: 4, label: "Avatar" },
  { number: 5, label: "Preview" },
  { number: 6, label: "Export" },
];

const PRESET_AVATARS = [
  { id: "1", name: "Sarah", style: "Professional", gender: "Female" },
  { id: "2", name: "Michael", style: "Casual", gender: "Male" },
  { id: "3", name: "Elena", style: "Formal", gender: "Female" },
  { id: "4", name: "James", style: "Professional", gender: "Male" },
  { id: "5", name: "Priya", style: "Casual", gender: "Female" },
  { id: "6", name: "David", style: "Formal", gender: "Male" },
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={4} steps={STEPS} />

        <div className="max-w-5xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-3">Add or Generate Avatar</h1>
          <p className="text-muted-foreground mb-12">
            Choose a preset avatar or upload your own image
          </p>

          <Tabs defaultValue="preset" className="mb-12">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="preset">Preset Avatars</TabsTrigger>
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                {PRESET_AVATARS.map((avatar) => (
                  <Card
                    key={avatar.id}
                    className={`p-6 cursor-pointer transition-all hover:shadow-medium ${
                      selectedAvatar === avatar.id && !uploadedImage ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setSelectedAvatar(avatar.id);
                      setUploadedImage(null);
                    }}
                  >
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-1">{avatar.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{avatar.style}</p>
                    <p className="text-xs text-muted-foreground">{avatar.gender}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-8">
              <div className="max-w-md mx-auto">
                {uploadedImage ? (
                  <div className="space-y-6">
                    <Card className="p-6 ring-2 ring-primary">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded avatar" 
                        className="w-full aspect-square object-cover rounded-lg mb-4"
                      />
                      <p className="text-sm font-medium text-center">Your Custom Avatar</p>
                    </Card>
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Different Image
                    </Button>
                  </div>
                ) : (
                  <Card 
                    className="p-12 border-2 border-dashed cursor-pointer hover:border-primary transition-all"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-center font-medium mb-2">Upload Your Photo</p>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Click to browse or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      JPG, PNG (max 10MB)
                    </p>
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
            <Card className="p-6 mb-12 bg-muted/30">
              <h3 className="font-semibold mb-3">Avatar Preview</h3>
              <p className="text-sm text-muted-foreground">
                Your avatar will be lip-synced with the selected voice
              </p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/voice")}>
              Back
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/preview")} 
              disabled={!selectedAvatar && !uploadedImage}
              className="px-8"
            >
              Next: Generate Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
