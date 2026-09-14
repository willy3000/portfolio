import Capabilities from '../components/Capabilities/Capabilities';
import Contact from '../components/Contact/Contact';
import Experience from '../components/Experience/Experience';
import Hero from '../components/Hero/Hero';
import Projects from '../components/Projects/Projects';
import { Layout } from '../layout/Layout';

const Home = () => (
  <Layout>
    <Hero />
    <Projects />
    <Experience />
    <Capabilities />
    <Contact />
  </Layout>
);

export default Home;
