import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection, { WeddingInfo } from "@/components/HeroSection";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import GuestList from "@/components/GuestList";
import ExpenseTracker from "@/components/ExpenseTracker";
import WeddingTips from "@/components/WeddingTips";
import PhotoGallery from "@/components/PhotoGallery";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [weddingInfo, setWeddingInfo] = useState<WeddingInfo>({
    name1: "Minh",
    name2: "Anh",
    date: "15/12/2025",
    location: "Hà Nội",
    tagline: "Cuộc phiêu lưu vĩ đại nhất bắt đầu từ một tiếng 'Dạ'",
  });

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HeroSection info={weddingInfo} onInfoChange={setWeddingInfo} />;
      case "milestones":
        return <MilestoneTimeline />;
      case "guests":
        return <GuestList />;
      case "photos":
        return <PhotoGallery />;
      case "expenses":
        return <ExpenseTracker />;
      case "tips":
        return <WeddingTips />;
      default:
        return <HeroSection info={weddingInfo} onInfoChange={setWeddingInfo} />;
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
