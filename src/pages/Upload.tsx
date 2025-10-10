import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip, FileText, Upload as UploadIcon, Sparkles, Mic, Clock, HelpCircle, Image as ImageIcon, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { DURATION_OPTIONS, Scenario } from "@/data/scenarios";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TONE_OPTIONS = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "narrative", label: "Narrative" },
  { id: "promotional", label: "Promotional" },
];

const Upload = () => {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState("professional");
  const [textInput, setTextInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [activeTab, setActiveTab] = useState("type");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.md', '.jpg', '.jpeg', '.png', '.mp4', '.xlsx', '.csv'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      toast.error("Invalid file type. Please upload a supported file (PDF, Word, PowerPoint, text, image, video, or spreadsheet).");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 100);
    
    // Check if file is binary (image/video) or text-based
    const binaryExtensions = ['.jpg', '.jpeg', '.png', '.mp4'];
    const isBinaryFile = binaryExtensions.includes(fileExt);
    
    if (isBinaryFile) {
      // For binary files (images/videos), don't try to read as text
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadedFileName(file.name);
        // Don't set textInput for binary files - prevents garbled data
        setIsUploading(false);
        setUploadProgress(0);
        toast.success(`File "${file.name}" uploaded successfully!`);
        setActiveTab("type");
      }, 300);
    } else {
      // For text-based files, read the content
      const reader = new FileReader();
      reader.onload = (e) => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setTimeout(() => {
          const content = e.target?.result as string;
          setTextInput(content || "File content extracted");
          setUploadedFileName(file.name);
          setIsUploading(false);
          setUploadProgress(0);
          toast.success(`File "${file.name}" uploaded successfully!`);
          setActiveTab("type");
        }, 300);
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFileName("");
    setTextInput("");
    toast.info("File removed");
  };

  const handleScenarioSelect = (scenario: Scenario) => {
    setTextInput(scenario.placeholder);
    setSelectedTone(scenario.tone);
    setSelectedDuration(scenario.duration);
    setActiveTab("type");
    toast.success(`Template "${scenario.name}" loaded!`);
  };

  const handleNext = () => {
    if (!textInput.trim()) {
      toast.error("Please describe your idea or upload a file to continue.");
      return;
    }
    navigate("/script", { 
      state: { 
        content: textInput, 
        tone: selectedTone,
        fileName: uploadedFileName,
        duration: selectedDuration
      } 
    });
  };

  const triggerFileUpload = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl">
          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">Transform any idea into a compelling video</h1>
            <p className="text-muted-foreground text-lg">
              Type your idea, upload content, or start with a template
            </p>
          </div>

          {/* Main Tabbed Input Area */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="type">Type Your Idea</TabsTrigger>
              <TabsTrigger value="upload">Upload Content</TabsTrigger>
              <TabsTrigger value="template">Use Template</TabsTrigger>
            </TabsList>

            <TabsContent value="type" className="space-y-4">
              <div 
                className="relative bg-card rounded-2xl border-2 border-border"
              >
                <div className="flex items-start gap-4 p-6">
                  <Textarea
                    placeholder="Example: Create a 1-minute video introducing my AI-powered scheduling assistant that helps teams save 10 hours per week..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="flex-1 min-h-[180px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-base"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HelpCircle className="w-4 h-4" />
                <span>Tip: Describe what you want the video to explain or showcase</span>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div 
                className={`
                  relative bg-card rounded-2xl border-2 transition-all min-h-[240px] flex flex-col items-center justify-center p-8
                  ${dragActive ? 'border-primary bg-primary/5' : 'border-border border-dashed'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <UploadIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Your Content</h3>
                <p className="text-sm text-muted-foreground text-center mb-2 max-w-md">
                  Drop files here or click to upload. We'll automatically extract the content to generate your script.
                </p>
                <p className="text-xs text-muted-foreground text-center mb-4 max-w-lg">
                  Supported formats: <span className="font-medium">PDF, Word (DOC/DOCX), PowerPoint (PPT/PPTX), Excel (XLSX/CSV), Text (TXT/MD), Images (JPEG/PNG), Video (MP4)</span>
                </p>
                
                <Button onClick={triggerFileUpload} variant="outline" disabled={isUploading}>
                  Choose File
                </Button>

                {isUploading && (
                  <div className="mt-4 w-full max-w-md">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {uploadedFileName && !isUploading && (
                  <div className="mt-4 flex items-center gap-3 bg-primary/10 px-4 py-3 rounded-lg border border-primary/20">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground flex-1 truncate">{uploadedFileName}</span>
                    <button
                      onClick={handleRemoveFile}
                      className="flex-shrink-0 w-6 h-6 rounded-full bg-muted hover:bg-destructive/20 flex items-center justify-center transition-colors group"
                      aria-label="Remove file"
                    >
                      <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                    </button>
                  </div>
                )}

                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.mp4,.xlsx,.csv"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Supported file types:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>PDF, Word, PowerPoint</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>TXT, Markdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" />
                    <span>JPEG, PNG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3 h-3" />
                    <span>MP4 (video)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    <span>Excel, CSV</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="template">
              <ScenarioSelector onSelect={handleScenarioSelect} />
            </TabsContent>
          </Tabs>

          {/* Video Settings */}
          <div className="mt-8 space-y-6">
            {/* Duration Selector */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" />
                <label className="text-sm font-medium">Video Duration</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose your target video length. We'll optimize the script accordingly.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDuration(option.value)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${selectedDuration === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    <div>{option.label}</div>
                    <div className="text-xs opacity-75">{option.words}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4" />
                <label className="text-sm font-medium">Video Tone</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the style and mood for your video narration</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                {TONE_OPTIONS.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`
                      px-5 py-2 rounded-full text-sm font-medium transition-all
                      ${selectedTone === tone.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }
                    `}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Script Button */}
          <div className="mt-8 flex justify-center">
            <Button 
              size="lg" 
              onClick={handleNext}
              className="px-12 h-12 text-base"
            >
              Generate Script
              <Sparkles className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* How It Works */}
          <div className="mt-16">
            <h3 className="text-center text-sm font-medium text-muted-foreground mb-6">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1 text-sm">1. Your Content</h4>
                <p className="text-xs text-muted-foreground">Upload files or describe your idea</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1 text-sm">2. AI Script</h4>
                <p className="text-xs text-muted-foreground">We generate an optimized script</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1 text-sm">3. Voice & Avatar</h4>
                <p className="text-xs text-muted-foreground">Choose your presenter style</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-medium mb-1 text-sm">4. Export</h4>
                <p className="text-xs text-muted-foreground">Download in multiple formats</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Upload;
