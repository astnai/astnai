import Link from "next/link";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "links",
  description: "Social links and profiles of a Agustín Arias",
};


interface SocialLink {
  title: string;
  url: string;
  description: string;
}

const socialLinks: SocialLink[] = [
  // {
  //   title: "astnai/instagram",
  //   url: "https://instagram.astnai.com",
  //   description: "Instagram profile of Agustin Arias",
  // },
  {
    title: "astnai/twitter",
    url: "https://twitter.astnai.com",
    description: "Twitter profile of Agustin Arias",
  },
];

const LinkCard = ({ linkItem }: { linkItem: SocialLink }) => {
  const isExternalLink = !linkItem.url.startsWith("mailto:");

  return (
    <article className="group">
      <Link
        href={linkItem.url}
        className="flex items-center gap-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:underline hover:underline-offset-2 decoration-2 decoration-neutral-300 dark:decoration-neutral-700"
        target={isExternalLink ? "_blank" : undefined}
        rel={isExternalLink ? "noopener noreferrer" : undefined}
        aria-label={linkItem.description}
      >
        {linkItem.title}
        <ExternalLinkIcon className="w-4 h-4" aria-hidden="true" />
      </Link>
    </article>
  );
};

const LinksPage = () => {
  return (
    <>
      <section aria-labelledby="social-links-heading" className="space-y-8">
        <h2 id="social-links-heading" className="sr-only">
          Social Media Links
        </h2>
        <div className="space-y-6">
          {socialLinks.map((linkItem) => (
            <LinkCard key={linkItem.title} linkItem={linkItem} />
          ))}
        </div>
      </section>

      <section aria-labelledby="social-note-heading" className="mt-12">
        <h2 id="social-note-heading" className="sr-only">
          Social Media Note
        </h2>
        <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-200 text-balance">
          <span className="text-blue-600 dark:text-blue-500" aria-hidden="true">
            *
          </span>
          personally, i don&apos;t use social media much. i&apos;m only active
          on{" "}
          <span className="bg-neutral-200 dark:bg-neutral-800 py-0.5 px-1 md:py-1 rounded-md text-xs md:text-sm">
            twitter
          </span>{" "}
          — the <span className="italic">everything</span> app
        </p>
      </section>
    </>
  );
};

export default LinksPage;
