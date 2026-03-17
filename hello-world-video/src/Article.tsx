import { loadFont } from "@remotion/google-fonts/NotoSansSC";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TitleScene } from "./scenes/TitleScene";
import { CPIScene } from "./scenes/CPIScene";
import { CorePointScene } from "./scenes/CorePointScene";
import { MoneyScene } from "./scenes/MoneyScene";
import { SupplyScene } from "./scenes/SupplyScene";
import { GlobalScene } from "./scenes/GlobalScene";
import { ConclusionScene } from "./scenes/ConclusionScene";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  ignoreTooManyRequestsWarning: true,
});

const TRANSITION_FRAMES = 15;

const scenes = [
  { component: TitleScene, durationInFrames: 120 },     // 4s
  { component: CPIScene, durationInFrames: 210 },       // 7s
  { component: CorePointScene, durationInFrames: 180 }, // 6s
  { component: MoneyScene, durationInFrames: 240 },     // 8s
  { component: SupplyScene, durationInFrames: 210 },    // 7s
  { component: GlobalScene, durationInFrames: 180 },    // 6s
  { component: ConclusionScene, durationInFrames: 150 },// 5s
];

export const ARTICLE_DURATION =
  scenes.reduce((sum, s) => sum + s.durationInFrames, 0) -
  (scenes.length - 1) * TRANSITION_FRAMES;

export const Article = () => {
  return (
    <div style={{ fontFamily }}>
      <TransitionSeries>
        {scenes.map((scene, i) => {
          const Scene = scene.component;
          const elements = [
            <TransitionSeries.Sequence
              key={`scene-${i}`}
              durationInFrames={scene.durationInFrames}
            >
              <Scene />
            </TransitionSeries.Sequence>,
          ];
          if (i < scenes.length - 1) {
            elements.push(
              <TransitionSeries.Transition
                key={`transition-${i}`}
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            );
          }
          return elements;
        })}
      </TransitionSeries>
    </div>
  );
};
