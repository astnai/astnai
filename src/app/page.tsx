import Link from "next/link";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

interface NavItem {
  title: string;
  url: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    title: "astnai/polaroids",
    url: "/polaroids",
    description:
      "Features a polaroid-style photo collection from daily life moments",
  },
  {
    title: "astnai/terminal",
    url: "/terminal",
    description: "Presents an interactive terminal for exploring a file system",
  },
  {
    title: "astnai/projects",
    url: "/projects",
    description:
      "Showcases various projects, products, and technical contributions",
  },
  // {
  //   title: "astnai/playlist",
  //   url: "/playlist",
  //   description: "Presents a curated collection of favorite musical tracks",
  // },
  {
    title: "astnai/books",
    url: "/books",
    description: "Displays a collection of completed book readings",
  },
  {
    title: "astnai/talks",
    url: "/talks",
    description: "Presents a collection of technical presentations and talks",
  },
  {
    title: "astnai/links",
    url: "/links",
    description: "Provides access to social media profiles and related content",
  },
];

const NavLink = ({ title, url, description }: NavItem) => (
  <li>
    <Link
      href={url}
      className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 inline-flex items-center hover:underline hover:underline-offset-2 decoration-2 decoration-neutral-300 dark:decoration-neutral-700"
      aria-label={`${title} - ${description}`}
    >
      <span>{title}</span>
      <ArrowTopRightIcon className="ml-0.5" aria-hidden="true" />
    </Link>
  </li>
);

export default function Home() {
  return (
    <nav aria-label="Personal content navigation">
      <ul className="space-y-8">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            title={item.title}
            url={item.url}
            description={item.description}
          />
        ))}
      </ul>
    </nav>
  );
}
