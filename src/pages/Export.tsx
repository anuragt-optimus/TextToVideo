import { useState } from "react";
import { Download, Share2, Youtube, Linkedin, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressSteps } from "@/components/ProgressSteps";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Preview" },
  { number: 4, label: "Export" },
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
  const location = useLocation();
const videoId = location.state?.videoId;

const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);

useEffect(() => {
  const fetchVideo = async () => {
    if (!videoId) return;

    const response = await fetch(
      `https://ca-texttovideo-prod-use2-1.jollygrass-c5390b44.eastus2.azurecontainerapps.io/api/v1/video/download/${videoId}`,
      { method: "GET", headers: { accept: "application/json" } }
    );

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setVideoBlobUrl(url);
  };

  fetchVideo();
}, [videoId]);

  const [selectedFormats, setSelectedFormats] = useState<string[]>(["horizontal"]);
  const [includeSubtitles, setIncludeSubtitles] = useState(true);
  const [includeThumbnail, setIncludeThumbnail] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);


  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev =>
      prev.includes(formatId)
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  const handleDownload = () => {
  if (!videoBlobUrl) return;

  setIsDownloading(true);

  const link = document.createElement("a");
  link.href = videoBlobUrl;
  link.download = "generated-video.mp4";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    setIsDownloading(false);
  }, 1500);

  toast.success("Download started!");
};

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={4} steps={STEPS} />

        <div className="max-w-5xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-3">Export and Share</h1>
          <p className="text-muted-foreground mb-12">
            Download your video or publish directly to social media
          </p>

          {/* Download Options */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Download Option</h2>
            <Card className="p-6">              
              
             <Button
  onClick={handleDownload}
  disabled={!videoBlobUrl || isDownloading}
>
  {!videoBlobUrl
    ? "please wait"
    : isDownloading
      ? "Downloading..."
      : "Download Video"}
</Button>



              
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
