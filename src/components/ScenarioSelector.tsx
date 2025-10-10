import { Heart, ShoppingBag, Bot, GraduationCap, Megaphone, LucideIcon } from "lucide-react";
import { SCENARIOS, Scenario } from "@/data/scenarios";
import { Card } from "@/components/ui/card";

interface ScenarioSelectorProps {
  onSelect: (scenario: Scenario) => void;
}

const iconMap: Record<string, LucideIcon> = {
  Heart,
  ShoppingBag,
  Bot,
  GraduationCap,
  Megaphone
};

export const ScenarioSelector = ({ onSelect }: ScenarioSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Start with a Template</h3>
        <p className="text-sm text-muted-foreground">
          Choose a scenario to get example content and recommended settings
        </p>
      </div>
      
      <div className="grid gap-3 max-h-[400px] overflow-y-auto">
        {SCENARIOS.map((scenario) => {
          const Icon = iconMap[scenario.icon];
          
          return (
            <Card
              key={scenario.id}
              className="p-4 cursor-pointer hover:border-primary transition-all hover:shadow-md"
              onClick={() => onSelect(scenario)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium mb-1">{scenario.name}</h4>
                  <p className="text-sm text-muted-foreground">{scenario.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
