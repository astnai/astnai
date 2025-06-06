import { Metadata } from "next";

export const metadata: Metadata = {
  title: "projects",
  description: "A collection of projects built by Agustín Arias.",
};


interface Project {
  title: string;
  url: string;
  status: string;
  description: string;
}

const projects: Project[] = [
  {
    title: "Buen Valley",
    url: "https://x.com/buenvalley",
    status: "soon",
    description:
      "Open-source community created to contribute to the startup ecosystem in Buenos Aires, AR.",
  },
];

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="group">
      <div className="flex items-center gap-1">
        <a
          href={project.url}
          className="hover:text-neutral-800 dark:hover:text-neutral-200 underline underline-offset-2 decoration-2 decoration-neutral-200 hover:decoration-neutral-300 dark:decoration-neutral-800 dark:hover:decoration-neutral-700"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={0}
        >
          {project.title}
        </a>
        <span className="italic text-blue-600/70 dark:text-blue-500/70">
          ─ {project.status}
        </span>
      </div>
      <p className="mt-0.5 text-balance sm:max-w-[40ch] text-neutral-500">
        {project.description}
      </p>
    </div>
  );
};

export default function ProjectsPage() {
  return (
    <div className="">
      <div className="space-y-8">
        <div className="space-y-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-12">
        <a
          href="https://github.com/astnai"
          className="flex items-center gap-0.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline underline-offset-2 decoration-2 decoration-neutral-200 hover:decoration-neutral-300 dark:decoration-neutral-800 dark:hover:decoration-neutral-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          more things on github
        </a>
      </div>
    </div>
  );
}
