import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Image, RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ProgressSteps } from "@/components/ProgressSteps";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";


const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Preview" },
  { number: 4, label: "Export" },
];

const Preview = () => {
  const navigate = useNavigate();
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [backgroundUploaded, setBackgroundUploaded] = useState(false);
  const location = useLocation();
  const videoId = location.state?.videoId;
  const scenes = location.state?.scenes || [];
  const content = location.state?.content || "";
  const tone = location.state?.tone || "Professional";
  const files = location.state?.files || [];
  const duration = location.state?.duration || 0;
  const format = location.state?.format || "16:9";

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!videoId) return;

      const response = await fetch(
        `https://ca-texttovideo-prod-use2-1.jollygrass-c5390b44.eastus2.azurecontainerapps.io/api/v1/video/download/${videoId}`,
        { method: "GET", headers: { accept: "application/json" } }
      );

      // The API sends a binary video file → convert to blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    };

    fetchVideo();
  }, [videoId]);





  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setLogoUploaded(true);
    }
  };
  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setBackgroundUploaded(true);
    }
  };

  const handleBrandingSubmit = () => {
    // You can later send these files to backend or handle branding logic
    console.log("Branding submitted!");
    alert("Branding submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={3} steps={STEPS} />

        <div className="max-w-6xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-3">Video Preview & Edit</h1>
          <p className="text-muted-foreground mb-12">
            Review your video and make final adjustments
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Video Preview */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden mb-6">
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  {videoUrl ? (
                    <video src={videoUrl} controls className="w-full h-full" />
                  ) : (
                    <div className="text-muted-foreground">Loading video...</div>
                  )}
                </div>
              </Card>

            </div>

            {/* Sidebar Controls */}
            <div className="space-y-6">

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>

                <div className="space-y-3">


                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate("/script", {
                        state: {
                          scenes,
                          content,
                          tone,
                          files,
                          duration,
                          format,
                        },
                      })
                    }
                  >
                    Edit Script
                  </Button>


                </div>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-between">
            <Button variant="outline" onClick={() => navigate("/script", {
                        state: {
                          scenes,
                          content,
                          tone,
                          files,
                          duration,
                          format,
                        },
                      })}>
              Back
            </Button>
            <Button
  size="lg"
  onClick={() =>
    navigate("/export", {
      state: { videoId },
    })
  }
  className="px-8"
>
  Confirm and Export
</Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
