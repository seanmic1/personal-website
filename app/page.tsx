import Intro from "./components/Intro";
import Timeline from "./components/Timeline";
import TimelineDocument from "./components/TimelineDocument";
import { timeline } from "./data/timeline";

export default function Home() {
  return (
    <>
      <Intro />
      {/* The accessible, crawlable version. Rendered on the server, always present. */}
      <TimelineDocument nodes={timeline} />
      <Timeline nodes={timeline} />
    </>
  );
}
