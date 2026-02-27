import { getSpecialAnnoucements } from "../api/keystatic/lib/keystatic";
import SpecialAnnouncementModal from "./SpecialAnnouncementModal";

const SpecialAnnouncement = async () => {
  const specialAnnouncement = await getSpecialAnnoucements();
  console.log("🚀 ~ SpecialAnnouncement ~ specialAnnouncement:", specialAnnouncement);
  const announcement = specialAnnouncement?.announcement;
  const content = await specialAnnouncement?.content();
  const showAnnouncement = specialAnnouncement?.showAnnouncement;
  return <SpecialAnnouncementModal announcement={announcement} content={content} showAnnouncement={showAnnouncement} />;
};

export default SpecialAnnouncement;
