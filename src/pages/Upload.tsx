import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProgressSteps } from "@/components/ProgressSteps";
import { toast } from "sonner";

const TONE_OPTIONS = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "narrative", label: "Narrative" },
  { id: "promotional", label: "Promotional" },
];

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Script" },
  { number: 3, label: "Voice" },
  { number: 4, label: "Avatar" },
  { number: 5, label: "Preview" },
  { number: 6, label: "Export" },
];

const Upload = () => {
  const navigate = useNavigate();
  const [selectedTone, setSelectedTone] = useState("professional");
  const [textInput, setTextInput] = useState("");
  const [dragActive, setDragActive] = useState(false);

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
    
    toast.success(`File "${file.name}" uploaded successfully!`);
    setTimeout(() => navigate("/script"), 1500);
  };

  const handleNext = () => {
    if (!textInput.trim()) {
      toast.error("Please upload a file or enter some text to continue.");
      return;
    }
    navigate("/script");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <ProgressSteps currentStep={1} steps={STEPS} />

        <div className="max-w-5xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-3">Upload or Input Content</h1>
          <p className="text-muted-foreground mb-12">
            Start by uploading a file or pasting your content directly
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: File Upload */}
            <div>
              <label className="text-sm font-medium mb-3 block">Upload File</label>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
                  ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                `}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <UploadIcon className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="font-medium mb-2">
                  {dragActive ? 'Drop your file here' : 'Drag and drop your file here'}
                </p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <p className="text-xs text-muted-foreground">
                  Supported: PDF, Word, PowerPoint, TXT, MD
                </p>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* Right: Text Input */}
            <div>
              <label className="text-sm font-medium mb-3 block">Or Paste Content</label>
              <Textarea
                placeholder="Paste your content here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[280px] resize-none"
              />
            </div>
          </div>

          {/* Tone Selector */}
          <div className="mt-12">
            <label className="text-sm font-medium mb-4 block">Select Tone</label>
            <div className="flex flex-wrap gap-3">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`
                    px-6 py-3 rounded-full font-medium transition-all
                    ${selectedTone === tone.id
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-12 flex justify-end">
            <Button size="lg" onClick={handleNext} className="px-8">
              Next: Generate Script
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
