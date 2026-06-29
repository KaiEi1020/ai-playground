import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Article, ARTICLE_DURATION } from "./Article";
import { NewsVideo } from "./NewsVideo";
import {
  VIDEO_DURATION_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./templates/shared";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Article"
        component={Article}
        durationInFrames={ARTICLE_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NewsVideo"
        component={NewsVideo}
        durationInFrames={VIDEO_DURATION_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
