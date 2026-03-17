import { Composition } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Article, ARTICLE_DURATION } from "./Article";

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
    </>
  );
};
