import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import GuestList from "@/components/GuestList";
import ExpenseTracker from "@/components/ExpenseTracker";
import WeddingTips from "@/components/WeddingTips";

const sections: Record<string, React.FC> = {
  home: HeroSection,
  milestones: MilestoneTimeline,
  guests: GuestList,
  expenses: ExpenseTracker,
  tips: WeddingTips,
};

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const Section = sections[activeSection];

  return (
    <div className="min-h-screen bg-background">
      <Section />
      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
    </div>
  );
};

export default Index;
