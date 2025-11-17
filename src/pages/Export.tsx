import { useState } from "react";
import { Download, Share2, Youtube, Linkedin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

const FORMATS = [
  { id: "square", label: "Square (1:1)", description: "Perfect for LinkedIn, Instagram" },
  { id: "vertical", label: "Vertical (9:16)", description: "Perfect for TikTok, Stories" },
  { id: "horizontal", label: "Horizontal (16:9)", description: "Perfect for YouTube, presentations" },
];

const PLATFORMS = [
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "tiktok", label: "TikTok", icon: Video },
];

const Export = () => {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["horizontal"]);
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [includeThumbnail, setIncludeThumbnail] = useState(true);

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev =>
      prev.includes(formatId)
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  const handleDownload = () => {
    toast.success("Your video is being prepared for download!");
  };

  const handlePublish = (platform: string) => {
    toast.success(`Publishing to ${platform}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={6} steps={STEPS} />

        <div className="max-w-5xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-3">Export and Share</h1>
          <p className="text-muted-foreground mb-12">
            Download your video or publish directly to social media
          </p>

          {/* Download Options */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Download Options</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="subtitles" 
                    checked={includeSubtitles}
                    onCheckedChange={(checked) => setIncludeSubtitles(checked as boolean)}
                  />
                  <label htmlFor="subtitles" className="text-sm font-medium cursor-pointer">
                    Include .srt subtitle file
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <Checkbox 
                    id="thumbnail" 
                    checked={includeThumbnail}
                    onCheckedChange={(checked) => setIncludeThumbnail(checked as boolean)}
                  />
                  <label htmlFor="thumbnail" className="text-sm font-medium cursor-pointer">
                    Include thumbnail image
                  </label>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button size="lg" className="w-full gap-2" onClick={handleDownload}>
                  <Download className="w-5 h-5" />
                  Download All
                </Button>
              </div>
            </Card>
          </div>

          {/* Action Button */}
          <div className="mt-12 flex justify-center">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="px-8"
            >
              Create Another Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Export;
