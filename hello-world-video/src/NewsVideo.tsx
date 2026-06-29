import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import { newsVideoData } from "./data/news-video-data";
import { BriefingVideo } from "./templates/BriefingVideo";
import { DataVideo } from "./templates/DataVideo";
import { OpinionVideo } from "./templates/OpinionVideo";

loadFont("normal", {
  weights: ["400", "700", "900"],
  ignoreTooManyRequestsWarning: true,
});

export const NewsVideo = () => {
  if (newsVideoData.template === "data") {
    return <DataVideo data={newsVideoData} />;
  }

  if (newsVideoData.template === "opinion") {
    return <OpinionVideo data={newsVideoData} />;
  }

  return <BriefingVideo data={newsVideoData} />;
};
