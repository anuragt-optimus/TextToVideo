import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

export const ProgressSteps = ({ currentStep, steps }: ProgressStepsProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 mb-8">
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-6 md:p-8">
        <div className="flex items-center justify-between relative">
          {/* Progress line background */}
          <div className="absolute left-0 right-0 top-[22px] h-1 bg-muted/50 rounded-full" 
               style={{ marginLeft: '40px', marginRight: '40px' }} />
          
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1 relative z-10">
              <div className="flex flex-col items-center w-full">
                <div
                  className={cn(
                    "w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-lg",
                    currentStep > step.number
                      ? "bg-primary text-primary-foreground scale-100"
                      : currentStep === step.number
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-primary/30"
                      : "bg-card border-2 border-muted text-muted-foreground scale-95"
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                  ) : (
                    <span className="text-sm md:text-base">{step.number}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs md:text-sm mt-3 text-center transition-all duration-300 px-1",
                    currentStep >= step.number
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground font-medium"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-1 mx-1 md:mx-2 transition-all duration-500 rounded-full relative z-0",
                    currentStep > step.number
                      ? "bg-primary shadow-sm"
                      : "bg-transparent"
                  )}
                  style={{ marginTop: '-34px' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
