import { useLocation, useParams } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import MilestoneTimelineReadOnly from "@/components/MilestoneTimelineReadOnly";
import { useInvitation } from "@/api/Invitation/queries";

const Invitation = () => {
  const location = useLocation();
  const { weddingId } = useParams<{ weddingId: string }>();
  const invitationQuery = useInvitation(weddingId);

  const fallbackInfo = location.state?.weddingInfo;
  const wedding = invitationQuery.data?.wedding ?? fallbackInfo;
  const milestones = invitationQuery.data?.milestones;

  return (
    <div className="min-h-screen bg-background">
      {wedding ? (
        <HeroSection info={wedding} readOnly />
      ) : invitationQuery.isLoading ? (
        <div className="min-h-screen paper-texture flex items-center justify-center">
          <p className="font-body text-muted-foreground">Đang tải thiệp mời…</p>
        </div>
      ) : (
        <div className="min-h-screen paper-texture flex items-center justify-center">
          <p className="font-body text-destructive">Không tìm thấy thiệp mời.</p>
        </div>
      )}

      <MilestoneTimelineReadOnly milestones={milestones} />
    </div>
  );
};

export default Invitation;
