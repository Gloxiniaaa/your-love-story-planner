import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import GuestList from "@/components/GuestList";
import ExpenseTracker from "@/components/ExpenseTracker";
import WeddingTips from "@/components/WeddingTips";
import { useState } from "react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("tips");

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HeroSection />;
      case "milestones":
        return <MilestoneTimeline />;
      case "guests":
        return <GuestList />;
      case "expenses":
        return <ExpenseTracker />;
      case "tips":
        return <WeddingTips />;
      default:
        return <WeddingTips />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderSection()}
      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
    </div>
  );
};

export default Index;
