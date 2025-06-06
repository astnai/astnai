// File system types
export type FileContent = string | "image" | "video";

export interface File {
  type: "file";
  content: FileContent;
  imageUrl?: string;
  videoUrl?: string;
}

export interface Directory {
  type: "directory";
  children: FileSystemNode;
}

export type FileSystemNode = {
  [key: string]: File | Directory;
};

// File system structure
export const fileSystem: FileSystemNode = {
  "/": {
    type: "directory",
    children: {
      about: {
        type: "directory",
        children: {
          "bio.txt": {
            type: "file",
            content:
              "Software engineer passionate about minimalist design and efficient systems. Currently exploring the intersection of technology and human experience.",
          },
          manifesto: {
            type: "directory",
            children: {
              "astnai.txt": {
                type: "file",
                content:
                  "Artificial intelligence should augment human creativity, not replace it. The future lies in symbiotic relationships between humans and machines.",
              },
              "philosophy.txt": {
                type: "file",
                content:
                  "Simplicity is the ultimate sophistication. Every line of code should serve a purpose. Every design decision should enhance the user experience.",
              },
            },
          },
        },
      },
      media: {
        type: "directory",
        children: {
          photos: {
            type: "directory",
            children: {
              "argentina.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/argentina.webp",
              },
              "steve-jobs-stanford.mp4": {
                type: "file",
                content: "video",
                videoUrl: "/terminal/steve-jobs-stanford.mp4",
              },
              "steve-jobs.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/steve-jobs.webp",
              },
              "zelda-quote.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/zelda-quote.webp",
              },
              "sama-tweet.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/sama-tweet.webp",
              },
              "puerto-madryn.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/puerto-madryn.webp",
              },
              "golden-gate.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/golden-gate.webp",
              },
              "marcos-galperin.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/marcos-galperin.webp",
              },
              "seneca-meme.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/seneca-meme.webp",
              },
              "luis-borges.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/luis-borges.webp",
              },
              "luffy.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/luffy.webp",
              },
              "imac-g4.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/imac-g4.webp",
              },
              "hideo-kojima.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/hideo-kojima.webp",
              },
              "brian-chesky.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/brian-chesky.webp",
              },
              "pg-tweet.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/pg-tweet.webp",
              },
            },
          },
          videos: {
            type: "directory",
            children: {
              "steve-jobs-stanford.mp4": {
                type: "file",
                content: "video",
                videoUrl: "/terminal/steve-jobs-stanford.mp4",
              },
            },
          },
        },
      },
      notes: {
        type: "directory",
        children: {
          "ideas.md": {
            type: "file",
            content:
              "# Ideas\n\n- Build a minimalist terminal interface\n- Explore generative art with code\n- Create a personal knowledge base\n- Design a meditation app",
          },
          "quotes.txt": {
            type: "file",
            content:
              '"The best way to predict the future is to invent it." - Alan Kay\n\n"Simplicity is prerequisite for reliability." - Edsger Dijkstra\n\n"Code is poetry." - Anonymous',
          },
        },
      },
      ascii: {
        type: "directory",
        children: {
          "README.md": {
            type: "file",
            content:
              "# ASCII Art Collection\n\nThis folder contains various ASCII art files in .txt format.\n\nAvailable ASCII art files:\n- vercel.txt - Vercel logo\n- heart.txt - Heart symbol\n- cat.txt - ASCII cat\n- rocket.txt - Rocket ship\n- tree.txt - Simple tree\n\nUse 'cat [filename]' to display the ASCII art.",
          },
          "vercel.txt": {
            type: "file",
            content: `
██╗   ██╗███████╗██████╗  ██████╗███████╗██╗     
██║   ██║██╔════╝██╔══██╗██╔════╝██╔════╝██║     
██║   ██║█████╗  ██████╔╝██║     █████╗  ██║     
╚██╗ ██╔╝██╔══╝  ██╔══██╗██║     ██╔══╝  ██║     
 ╚████╔╝ ███████╗██║  ██║╚██████╗███████╗███████╗
  ╚═══╝  ╚══════╝╚═╝  ╚═╝ ╚═════╝╚══════╝╚══════╝
                                                  
                    ▲ Vercel
      `,
          },
          "heart.txt": {
            type: "file",
            content: `
    ♥♥♥♥♥♥♥     ♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥   ♥♥♥♥♥♥♥♥♥
 ♥♥♥♥♥♥♥♥♥♥♥ ♥♥♥♥♥♥♥♥♥♥♥
♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
 ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
  ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
   ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
    ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
     ♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥
      ♥♥♥♥♥♥♥♥♥♥♥♥♥
       ♥♥♥♥♥♥♥♥♥♥♥
        ♥♥♥♥♥♥♥♥♥
         ♥♥♥♥♥♥♥
          ♥♥♥♥♥
           ♥♥♥
            ♥
      `,
          },
          "cat.txt": {
            type: "file",
            content: `
    /\\_/\\  
   (  o.o  ) 
    > ^ <
   
 ╭─────────╮
 │ Meow!   │
 ╰─────────╯
      `,
          },
          "rocket.txt": {
            type: "file",
            content: `
           /\\
          /  \\
         /____\\
        |      |
        | FUEL |
        |______|
        |  /\\  |
        | /  \\ |
        |/____\\|
       /        \\
      /__________\\
     /            \\
    /______________\\
   /                \\
  /                  \\
 /____________________\\
        🔥🔥🔥🔥
      `,
          },
          "tree.txt": {
            type: "file",
            content: `
         🌟
        /|\\
       /*|O\\
      /*/|\\*\\
     /X/O|*\\X\\
    /*/X/|\\X\\*\\
   /O/*/X|*\\O\\X\\
  /*/O/X/|\\X\\O\\*\\
 /X/O/*/X|O\\X\\*\\O\\
/O/X/*/O/|\\X\\*\\O\\X\\
        |X|
        |X|
      `,
          },
        },
      },
      "README.txt": {
        type: "file",
        content:
          "Welcome to my personal terminal!\n\nAvailable commands:\n- ls: list directory contents\n- cd: change directory\n- pwd: print working directory\n- cat: display file contents\n- viu: view image files\n- rename: change username\n- help: show all commands\n- clear: clear terminal\n\nExplore the file system and discover what's inside!",
      },
    },
  },
}; 