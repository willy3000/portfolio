import Dive from '../components/Dive/Dive';
import Finale from '../components/Finale/Finale';
import Intro from '../components/Intro/Intro';
import Journey from '../components/Journey/Journey';
import Showcase from '../components/Showcase/Showcase';
import Skills from '../components/Skills/Skills';
import Stacks from '../components/Stacks/Stacks';
import Experience from '../experience/Experience';
import { LAST } from '../experience/timeline';
import { Layout } from '../layout/Layout';
import { Stage, Track } from '../styles/GlobalComponents';

// One continuous journey: intro → into the laptop → projects → skills →
// other stacks → career → contact. Every section is real HTML; the 3D layer
// stages it, one stop at a time.
const Home = () => (
  <Layout>
    <Experience />
    <Track data-journey $scroll={LAST * 70}>
      <Stage>
        <Intro />
        <Dive />
        <Showcase />
        <Skills />
        <Stacks />
        <Journey />
        <Finale />
      </Stage>
    </Track>
  </Layout>
);

export default Home;
