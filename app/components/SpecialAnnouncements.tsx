import { getSpecialAnnoucements } from "../api/keystatic/lib/keystatic";
import SpecialAnnouncementModal from "./SpecialAnnouncementModal";

const SpecialAnnouncement = async () => {
  const specialAnnouncement = await getSpecialAnnoucements();

  if (!specialAnnouncement?.showAnnouncement) return null;

  const content = await specialAnnouncement.content();

  return (
    <SpecialAnnouncementModal
      announcement={specialAnnouncement.announcement}
      content={content}
      image={specialAnnouncement.image}
      linkLabel={specialAnnouncement.linkLabel}
      linkUrl={specialAnnouncement.linkUrl}
      showAnnouncement={specialAnnouncement.showAnnouncement}
    />
  );
};

export default SpecialAnnouncement;
