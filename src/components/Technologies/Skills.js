import { DiAndroid, DiTerminal } from "react-icons/di";
import { SiJava, SiFirebase, SiGit } from "react-icons/si";
import { RiFlutterFill } from "react-icons/ri";

export const Skills = [
  {
    slug: "ReactJs",
    Component: DiAndroid,
    title: "ReactJs",
    Description: () => <>I have worked with react in my early stages of development but swutched to NextJs due to added advantages such as routing, already included proxy and other advantages.</>,
  },
  {
    slug: "NextJs",
    Component: RiFlutterFill,
    title: "NextJs",
    Description: () => <>Currently working with NextJs & MaterialUI on my current projects. </>,
  },
  {
    slug: "Python",
    Component: SiJava,
    title: "Python",
    Description: () => <>I can code in Python. But I mainly use it for automation and scripting.</>,
  },
  {
    slug: "NodeJs",
    Component: DiTerminal,
    title: "NodeJs",
    Description: () => <>I have use NodeJs with express for backend development in conjustion with MongoDB to store data.</>,
  },
  {
    slug: "Express",
    Component: SiFirebase,
    title: "Firebase",
    Description: () => <>I have used Firebase for auth, database & analytics in my apps.</>,
  },
  {
    slug: "Git",
    Component: SiGit,
    title: "Git",
    Description: () => <>Git is a tool that I use every day fro version control. I use GitHub for pushing my code and keeping track of new feature updates.</>,
  },
];
