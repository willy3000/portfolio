import { DiAndroid, DiNodejs, DiPython, DiReact, DiTerminal } from "react-icons/di";
import { SiJava, SiFirebase, SiGit, SiPython, SiGithub, SiSpring } from "react-icons/si";
import { RiFlutterFill } from "react-icons/ri";
import { SiNextDotJs } from "react-icons/si";

export const Skills = [
  {
    slug: "ReactJs",
    Component: DiReact,
    title: "ReactJs",
    Description: () => <>I have worked with react in my early stages of development but switched to NextJs due to added advantages such as included routing.</>,
  },
  {
    slug: "NextJs",
    Component: SiNextDotJs,
    title: "NextJs",
    Description: () => <>Currently working with NextJs & MaterialUI on my current projects. </>,
  },
  {
    slug: "Python",
    Component: SiPython,
    title: "Python",
    Description: () => <>I mainly use Python for automation and scripting.</>,
  },
  {
    slug: "NodeJs",
    Component: DiNodejs,
    title: "NodeJs",
    Description: () => <>I have use NodeJs with express for backend development in conjunction with MongoDB to store data.</>,
  },
  // {
  //   slug: "Express",
  //   Component: SiFirebase,
  //   title: "Firebase",
  //   Description: () => <>I have used Firebase for auth, database & analytics in my apps.</>,
  // },
  {
    slug: "Firebase",
    Component: SiFirebase,
    title: "Firebase",
    Description: () => <>I have used Firebase for authentication, database & file storage in some of my applications.</>,
  },
  {
    slug: "Git",
    Component: SiGit,
    title: "Git",
    Description: () => <>Git is a tool that I use every day for version control.</>,
  },
  {
    slug: "Git",
    Component: SiGithub,
    title: "Github",
    Description: () => <>I use github as an every-day tool together with git to version and store my code.</>,
  },
  {
    slug: "Git",
    Component: SiSpring,
    title: "SpringBoot",
    Description: () => <>One of my most recent technologies which I'm still perfecting.</>,
  },
];
