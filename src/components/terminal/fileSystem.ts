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
          "about-me.txt": {
            type: "file",
            content: "i'm a developer from patagonia, argentina. i was born in puerto madryn, chubut. i started freelancing websites at 15, finished high school, then moved to buenos aires where i grew my career through work, skipping university.\n\ni see myself as a generalist, and philosophically i relate more to existentialism than stoicism, though i respect the resilience of a stoic a lot",
          },
          "why-astnai.txt": {
            type: "file",
            content: "astnai comes from a mix of my first and last name. i was looking for a global handle and an easier way for people to say my name since agustin doesn't sound great in english. after playing with a few combinations i came up with \"astnai\" and saw it was available on almost every social platform so i kept it.\n\nthe abbreviation preview would look like this:\n\n[a]gu[s][t]in [a]r[i]as",
          },
          "things-i-like": {
            type: "directory",
            children: {
              "README.txt": {
                type: "file",
                content: "mainly computers, or anything that fits into general tech. computers are my gateway to entertainment. i really like listening to soundtracks, especially from games and anime.\n\nsince i was a kid i've been into silicon valley, the whole scene really. even the drama is kind of entertaining. i love tea and during the day i mix it up with mate—caffeine in the morning, mateine in the afternoon",
              },
              "anime-top.txt": {
                type: "file",
                content: "i like anime, probably because of how curious i am about japan. the stories, the direction, and all the unique elements like music and animation really pulled me in\n\n- one piece, shingeki no kyojin, hxh\n- sonny boy, madoka magica, evangelion\n- kaguya-sama, nichijou, bocchi the rock\n- frieren, made in abyss, violet evergarden\n- all studio ghibli movies",
              },
              "games-top.txt": {
                type: "file",
                content: "consoles and video games were a big part of my childhood. my first console was the nintendo ds and my favorite is the nintendo wii. i prefer chill games and avoid competitive stuff.\n\n- breath of the wild and tears of the kingdom\n- super mario galaxy\n- hollow knight\n- minecraft\n- celeste\n- league of legends (good product, bad game)",
              },
              "music-top.txt": {
                type: "file",
                content: "by preference, i like listening to music without lyrics—ambient stuff, soundtracks, orchestras. or if there are lyrics, i kinda enjoy not understanding them, so i listen to a lot of city pop (japanese music).\n\n- the legend of zelda: zelda's lullaby, gerudo valley, ocarina of time title theme, \n- breath of the wild and tears of the kingdom main theme\n- howl's moving castle, princess mononoke, violet evergarden, kimi no na wa\n- minecraft, super mario galaxy, outer wilds main theme",
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
              "argentina.png": {
                type: "file",
                content: "image",
                imageUrl: "/terminal/argentina.webp",
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
          "best-marketing.txt": {
            type: "file",
            content: "the best marketing is at the core of a product's exponential growth, and it's the organic word of mouth from users. if the product is truly good, it'll naturally get shared around",
          },
          "gsaas.txt": {
            type: "file",
            content: "generative software as a service is the new saas. it goes beyond being just an ai lab offering a model—it's about delivering software that creates value for the user and selling it as a subscription",
          },
        },
      },
      ascii: {
        type: "directory",
        children: {
          "README.txt": {
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
        content: "welcome to astnai terminal!\n\nthis terminal is read-only, made just for exploring the file system. shoot me a dm at @astnai (twitter) if you have feedback or suggestions.\n\nbuilt with cursor and inspired by @ryolu_ os",
      },
    },
  },
}; 