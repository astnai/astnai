import Image from "next/image";
import { Book } from "@/lib/types/book";

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  return (
    <div className="relative w-full aspect-[2/3]">
      <a
        href={book.bookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          relative
          h-full
          overflow-hidden
          rounded-r-2xl rounded-l-sm
          shadow-xl
          ring ring-neutral-800/10
          dark:ring-neutral-200/10
          dark:shadow-white/10
          group
          hover:shadow-none
          transition-all duration-200 ease-in-out
          cursor-pointer
          block
        "
        aria-label={`View details for ${book.name}`}
      >
        <div
          className="
            absolute inset-0
            z-10
            bg-white
            dark:bg-black
            opacity-0
            group-hover:opacity-40
            ease-in-out
            transition-all duration-200
          "
        />
        <Image
          src={book.coverUrl}
          alt={`Book cover of ${book.name}`}
          fill
          className="
            object-cover
            object-center
            scale-[1.04]
          "
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </a>
    </div>
  );
};
