import HeaderLink from "./HeaderPathname";
import { ExternalLinkIcon } from "@radix-ui/react-icons";

const Header = () => {
  return (
    <div className="mx-auto flex py-12 mt-8 max-w-screen-sm items-center justify-between">
      <HeaderLink />
      <div className="flex items-center gap-4">
        <a
          href="https://agustinarias.com"
          target="_self"
          rel="noopener noreferrer"
          className="hover:text-neutral-800 dark:hover:text-neutral-200 hover:underline decoration-2 underline-offset-2 decoration-neutral-300 dark:decoration-neutral-700 flex items-center gap-0.5"
          aria-label="Visit the personal website of Agustin Arias (opens in new tab)"
        >
          <span className="flex items-center gap-0.5 font-medium">
            agustinarias.com
            <ExternalLinkIcon className="w-4 h-4" />
          </span>
        </a>
      </div>
    </div>
  );
};

export default Header;
