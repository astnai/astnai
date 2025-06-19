"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { unstable_ViewTransition as ViewTransition } from "react";

const HeaderLink = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <Link
      href="/"
      className="group inline-flex items-center font-medium"
      aria-label="Go to homepage"
      tabIndex={0}
    >
      <h1
        className="group-hover:text-neutral-500"
      >
        astnai
      </h1>
      {!isHome && (
        <ViewTransition name="pathname">
          <span
            className=" "
            aria-label={`Current page: ${pathname.slice(1)}`}
          >
            {pathname}
          </span>
        </ViewTransition>
      )}
    </Link>
  );
};

export default HeaderLink;
