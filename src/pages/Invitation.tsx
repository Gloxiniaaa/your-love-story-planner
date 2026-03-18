import { useLocation } from "react-router-dom";
import HeroSection, { WeddingInfo } from "@/components/HeroSection";
import MilestoneTimelineReadOnly from "@/components/MilestoneTimelineReadOnly";

const defaultInfo: WeddingInfo = {
  name1: "Minh",
  name2: "Anh",
  date: "15/12/2025",
  location: "Hà Nội",
  tagline: "Cuộc phiêu lưu vĩ đại nhất bắt đầu từ một tiếng 'Dạ'",
};

const Invitation = () => {
  const location = useLocation();
  const info: WeddingInfo = location.state?.weddingInfo || defaultInfo;

  return (
    <div className="min-h-screen bg-background">
      <HeroSection info={info} readOnly />
      <MilestoneTimelineReadOnly />
    </div>
  );
};

export default Invitation;
