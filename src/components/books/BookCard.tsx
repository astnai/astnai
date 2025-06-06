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
          rounded-r-xl 
          shadow-lg 
          ring ring-neutral-900/10
          dark:ring-neutral-100/10 
          dark:shadow-white/14
          group 
          hover:shadow-none
          ease-in-out
          transition-all duration-200
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
            rounded-r-xl 
            scale-[1.04]
          "
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </a>
    </div>
  );
};
