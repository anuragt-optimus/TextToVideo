import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paperclip, FileText, Upload as UploadIcon, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
    const validTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.txt', '.md'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      toast.error("Invalid file type. Please upload a PDF, Word doc, PowerPoint, or text file.");
      return;
    }
    
    // Read file content
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTextInput(content || "File content extracted");
      setUploadedFileName(file.name);
      toast.success(`File "${file.name}" uploaded successfully!`);
    };
    reader.readAsText(file);
  };

  const handleNext = () => {
    if (!textInput.trim()) {
      toast.error("Please upload a file or enter some text to continue.");
      return;
    }
    navigate("/script", { 
      state: { 
        content: textInput, 
        tone: selectedTone,
        fileName: uploadedFileName
      } 
    });
  };

  const triggerFileUpload = () => {
    document.getElementById('file-input')?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Transform any idea into a compelling video</h1>
          <p className="text-muted-foreground text-lg">
            Generate professional videos from simple prompts.
          </p>
        </div>

        {/* Main Input Area */}
        <div 
          className={`
            relative bg-card rounded-2xl border-2 transition-all
            ${dragActive ? 'border-primary bg-primary/5' : 'border-border'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex items-start gap-4 p-6">
            {/* Attachment Icon */}
            <button
              onClick={triggerFileUpload}
              className="flex-shrink-0 p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              title="Upload file"
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Text Input */}
            <Textarea
              placeholder="Describe your video or paste your content here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 min-h-[180px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-base"
            />

            {/* Get Started Button */}
            <Button 
              size="lg" 
              onClick={handleNext}
              className="flex-shrink-0 px-8 h-auto py-4"
            >
              Get Started
            </Button>
          </div>

          {/* File Upload Status */}
          {uploadedFileName && (
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{uploadedFileName}</span>
              </div>
            </div>
          )}

          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            onClick={triggerFileUpload}
            className="px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors flex items-center gap-2"
          >
            <UploadIcon className="w-4 h-4" />
            Upload File
          </button>
          <button
            onClick={() => document.querySelector('textarea')?.focus()}
            className="px-5 py-2.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Paste Text
          </button>
        </div>

        {/* Tone Selector */}
        <div className="mt-12">
          <label className="text-sm font-medium mb-4 block text-center">Select Tone</label>
          <div className="flex flex-wrap justify-center gap-2">
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

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Script Generation</h3>
            <p className="text-sm text-muted-foreground">
              Our AI automatically transforms your content into an engaging video script optimized for your chosen tone
            </p>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Voice & Avatar</h3>
            <p className="text-sm text-muted-foreground">
              Choose from professional voices and avatars to bring your script to life with realistic AI presenters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
