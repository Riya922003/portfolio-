import { cn } from "@/lib/utils";
import React from "react";
import Image from 'next/image'
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import ContestRatings from '@/components/ContestRatings';
import {
  Clipboard as IconClipboardCopy,
  FileText as IconFileBroken,
  PenTool as IconSignature,
  Columns as IconTableColumn,
  ArrowUpRight as IconArrowWaveRightUp,
  Box as IconBoxAlignTopLeft,
  AlignJustify as IconBoxAlignRightFilled,
} from "lucide-react";

export default function BentoGridDemo() {
  // show exactly 5 cards
  const showItems = items.slice(0, 5);

  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {showItems.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);
const items = [
  {
    title: "Github Statstics",
    description: "An overview of my code contributions, stars, and pull requests on GitHub.",
    header: (
      <div className="h-40 w-full overflow-hidden rounded-md">
        <Image
          src={"https://github-readme-stats.vercel.app/api?username=Riya922003&show_icons=true&theme=transparent"}
          alt="stats"
          width={800}
          height={160}
          unoptimized
          className="object-fill w-full h-5/6"
        />
      </div>
    ),
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "LeetCode Profile",
    description: "A summary of my problem-solving progress, including total problems solved by difficulty.",
    header: (
      <div className="h-40 w-full overflow-hidden rounded-md">
        <Image
          src={"https://leetcard.jacoblin.cool/riyagupta4079"}
          alt="leetcard"
          width={800}
          height={160}
          unoptimized
          className="object-fill w-full h-5/6"
        />
      </div>
    ),
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Contribution Streak",
    description: "A testament to my daily commitment and consistency in coding.",
    header: (
      <div className="h-40 w-full overflow-hidden rounded-md">
        
        <Image
          src={"https://streak-stats.demolab.com/?user=Riya922003&account_private=true&theme=dark&border_radius=10"}
          alt="activity"
          width={800}
          height={160}
          unoptimized
          className="object-fill  w-full h-full"
        />
      </div>
    ),
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Contribution Graph",
    description:"A visual representation of my coding activity and contributions over the past year.",
    header: (
      <div className="h-40 w-full overflow-hidden rounded-md">
        <Image
          src={"https://github-readme-activity-graph.vercel.app/graph?username=Riya922003&theme=react-dark"}
          alt="trophies"
          width={800}
          height={160}
          unoptimized
          className="object-fill w-full h-full"
        />
      </div>
    ),
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "The Pursuit of Knowledge",
    description: "Join the quest for understanding and enlightenment.",
    header: (
      <div className="h-40 w-full overflow-hidden rounded-md">
        <ContestRatings className="object-fill w-full h-5/6" />
        {/* <Image
          src={"https://raw.githubusercontent.com/Riya922003/portfolio-/main/public/assets/images/profile.jpg"}
          alt="profile"
          width={800}
          height={160}
          unoptimized
          className="object-cover w-full h-full"
        /> */}
      </div>
    ),
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-neutral-500" />,
  },
 
];
