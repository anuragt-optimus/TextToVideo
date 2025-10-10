export interface Scenario {
  id: string;
  name: string;
  description: string;
  placeholder: string;
  tone: string;
  duration: number;
  icon: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "memorial",
    name: "Memorial/Obituary Video",
    description: "Create a respectful tribute video",
    placeholder: "Example: Create a memorial video for John Smith, who passed away on March 15th. He was a loving father, dedicated teacher for 30 years, and passionate about community service...",
    tone: "narrative",
    duration: 90,
    icon: "Heart"
  },
  {
    id: "product",
    name: "Product Marketing",
    description: "Showcase your product or service",
    placeholder: "Example: Introduce our new AI-powered task manager that helps teams collaborate 3x faster. Features include smart scheduling, automated reminders, and team analytics...",
    tone: "promotional",
    duration: 60,
    icon: "ShoppingBag"
  },
  {
    id: "ai-demo",
    name: "AI Tool Demo",
    description: "Explain your AI agent or software",
    placeholder: "Example: Our AI agent automates customer support by understanding natural language, providing instant responses, and learning from interactions to improve over time...",
    tone: "professional",
    duration: 90,
    icon: "Bot"
  },
  {
    id: "training",
    name: "Training/Educational",
    description: "Create instructional content",
    placeholder: "Example: Learn how to use our project management platform. This tutorial covers creating projects, assigning tasks, tracking progress, and generating reports...",
    tone: "friendly",
    duration: 120,
    icon: "GraduationCap"
  },
  {
    id: "announcement",
    name: "Company Announcement",
    description: "Share important company news",
    placeholder: "Example: We're excited to announce our Series A funding of $10M, led by XYZ Ventures. This investment will help us expand our team and accelerate product development...",
    tone: "professional",
    duration: 60,
    icon: "Megaphone"
  }
];

export const DURATION_OPTIONS = [
  { value: 30, label: "30 seconds", words: "~75 words" },
  { value: 60, label: "1 minute", words: "~150 words" },
  { value: 90, label: "1.5 minutes", words: "~225 words" },
  { value: 120, label: "2 minutes", words: "~300 words" },
  { value: 180, label: "3 minutes", words: "~450 words" }
];
