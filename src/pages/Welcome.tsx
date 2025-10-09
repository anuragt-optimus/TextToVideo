import { useNavigate } from "react-router-dom";
import { FileText, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBg from "@/assets/hero-bg.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="relative flex-1 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Transform Content into Videos
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Turn any text, PDF, or document into engaging talking-head videos with AI-powered voices and avatars
          </p>

          {/* Main CTAs */}
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <Button
              size="lg"
              onClick={() => navigate("/upload")}
              className="h-32 flex flex-col gap-3 text-lg group hover:shadow-medium transition-all"
            >
              <FileText className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <span>Create from Text or File</span>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/script")}
              className="h-32 flex flex-col gap-3 text-lg group hover:border-primary hover:bg-primary/5 transition-all"
            >
              <FileCode className="w-10 h-10 group-hover:scale-110 transition-transform" />
              <span>Start with a Script</span>
            </Button>
          </div>

          {/* Search-style Input */}
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Make a video from my PDF..."
              className="h-14 text-lg bg-card border-2 focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate("/upload");
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">90s</div>
              <p className="text-muted-foreground">Average video length</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <p className="text-muted-foreground">File formats supported</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <p className="text-muted-foreground">Aspect ratios available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
