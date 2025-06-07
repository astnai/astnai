import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "talks",
  description: "Agustín Arias's talks and presentations",
};

export default function TalksPage() {
  // DATA-TALKS
  const talks = [
    {
      title: "AI and the web",
      date: "September 15, 2024",
      description:
        "The new copy + paste. How Tailwind made styling more accessible and became a standard in code generation. AI in IDE (Cursor). The distinction between programming and coding. How AI facilitates coding, but not programming. For AI-assisted coding to be efficient, there must be an aligned workflow. AI is a means to amplify inputs.",
      imageUrl: "/talks/ai-and-the-web.webp",
    },
  ];

  return (
    <section aria-label="List of talks" className="space-y-16">
      {talks.map((talk, index) => (
        <article
          key={index}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-start group"
        >
          <div>
            <header className="mb-4 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="font-medium tracking-tight">{talk.title}</h2>
              <time
                dateTime={talk.date}
                className="mb-4 flex justify-between text-xs md:text-sm text-neutral-500"
              >
                {talk.date}
              </time>
            </header>
            <p>{talk.description}</p>
          </div>
          <figure className="relative aspect-[4/6] w-full overflow-hidden rounded-sm">
            <Image
              src={talk.imageUrl || "/placeholder.svg"}
              alt={`Presentation slide for ${talk.title}`}
              fill
              priority={index < 2}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover rounded-sm"
            />
          </figure>
        </article>
      ))}
    </section>
  );
}
