import { getSpecialAnnoucements } from "../api/keystatic/lib/keystatic";
import SpecialAnnouncementModal from "./SpecialAnnouncementModal";

const SpecialAnnouncement = async () => {
  const specialAnnouncement = await getSpecialAnnoucements();

  if (!specialAnnouncement?.showAnnouncement) return null;

  // This component renders from the root layout, so a document Keystatic can't
  // parse (a loose markdown list is the usual culprit) would otherwise throw on
  // every page of the site. Drop the announcement instead of taking down the
  // site with it.
  let content;
  try {
    content = await specialAnnouncement.content();
  } catch (error) {
    console.error("Could not parse the special announcement content:", error);
    return null;
  }

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
