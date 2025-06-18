"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { fileSystem, type File, type Directory } from "./fileSystem";
import { useIsMobile } from "@/hooks/useIsMobile";

// ===== Types =====
type HistoryItem = {
  command: string;
  output: string | React.JSX.Element;
  prompt: string;
};

// ===== Component =====
export default function Terminal() {
  // ===== State Management =====
  // Terminal state
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: "",
      output: `░█▀█░█▀█
░█▀█░█▀█
░▀░▀░▀░▀`,
      prompt: "",
    },
    {
      command: "",
      output: "Welcome to astnai terminal v0.0.1",
      prompt: "",
    },
    {
      command: "",
      output: "Type 'help' to see available commands",
      prompt: "",
    },
  ]);
  const [currentPath, setCurrentPath] = useState("/");
  const [username, setUsername] = useState("user@computer");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Media state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [videoDuration, setVideoDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isHandlingVideoControl, setIsHandlingVideoControl] = useState(false);

  // ===== Refs =====
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isMobile = useIsMobile();

  // ===== File System Utilities =====
  /**
   * Gets sorted items from a directory
   * @param dir - The directory to get items from
   * @returns Array of sorted item names
   */
  const getSortedItems = (dir: Directory) => {
    return Object.entries(dir.children)
      .map(([name, item]) => ({
        name: item.type === "directory" ? `${name}/` : name,
        type: item.type,
        sortKey: name,
      }))
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;

        const aName = a.sortKey.split(".")[0];
        const bName = b.sortKey.split(".")[0];

        const nameCompare = aName.localeCompare(bName, undefined, {
          sensitivity: "case",
          caseFirst: "lower",
        });

        if (nameCompare !== 0) return nameCompare;

        return a.sortKey.localeCompare(b.sortKey, undefined, {
          sensitivity: "case",
          caseFirst: "lower",
        });
      })
      .map((item) => item.name);
  };

  /**
   * Gets the current directory object
   * @returns The current directory or null if not found
   */
  const getCurrentDirectory = () => {
    const pathParts = currentPath.split("/").filter(Boolean);
    let current = fileSystem["/"] as Directory;

    for (const part of pathParts) {
      if (
        current.type === "directory" &&
        current.children &&
        current.children[part]
      ) {
        current = current.children[part] as Directory;
      } else {
        return null;
      }
    }
    return current;
  };

  /**
   * Gets a file or directory at the specified path
   * @param path - The path to get the file/directory from
   * @returns The file/directory object or null if not found
   */
  const getFileAtPath = (path: string) => {
    if (path.startsWith("/")) {
      const pathParts = path.split("/").filter(Boolean);
      let current = fileSystem["/"] as Directory;

      for (const part of pathParts) {
        if (
          current.type === "directory" &&
          current.children &&
          current.children[part]
        ) {
          current = current.children[part] as Directory;
        } else {
          return null;
        }
      }
      return current;
    }

    const currentDir = getCurrentDirectory();
    if (
      !currentDir ||
      currentDir.type !== "directory" ||
      !currentDir.children
    ) {
      return null;
    }
    return currentDir.children[path] || null;
  };

  // ===== Terminal Utilities =====
  /**
   * Gets the display path for the terminal prompt
   * @returns The formatted path string
   */
  const getDisplayPath = () => (currentPath === "/" ? "/" : currentPath);

  /**
   * Gets the current terminal prompt
   * @returns The formatted prompt string
   */
  const getCurrentPrompt = () => `${username}:${getDisplayPath()}$`;

  /**
   * Formats time in seconds to MM:SS format
   * @param timeInSeconds - Time in seconds to format
   * @returns Formatted time string
   */
  const formatTime = (timeInSeconds: number) => {
    if (!isFinite(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // ===== Media Handlers =====
  /**
   * Plays the terminal output sound
   */
  const playOutputSound = () => {
    if (audioRef.current && !isMobile) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  /**
   * Handles video time updates
   */
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    if (isFinite(currentTime)) {
      setCurrentTime(formatTime(currentTime));
    }
  };

  /**
   * Handles video load events
   */
  const handleVideoLoad = () => {
    if (!videoRef.current) return;

    // Reset states
    setCurrentTime("00:00");
    setVideoDuration("00:00");

    // Set initial duration if available
    if (isFinite(videoRef.current.duration)) {
      setVideoDuration(formatTime(videoRef.current.duration));
    }

    // Start playback
    videoRef.current.play().catch((error) => {
      console.error("Error auto-playing video:", error);
    });
  };

  /**
   * Handles video duration changes
   */
  const handleDurationChange = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    if (isFinite(duration)) {
      setVideoDuration(formatTime(duration));
    }
  };

  // ===== Tab Completion =====
  /**
   * Gets available items for tab completion
   * @returns Array of available item names
   */
  const getAvailableItems = () => {
    const currentDir = getCurrentDirectory();
    if (currentDir && currentDir.type === "directory" && currentDir.children) {
      return Object.keys(currentDir.children).sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return [];
  };

  /**
   * Handles tab completion for commands
   */
  const handleTabCompletion = () => {
    const parts = input.trim().split(" ");
    const command = parts[0].toLowerCase();
    if (!["cd", "cat", "viu", "ls", "play", "copy"].includes(command)) return;

    const lastArg = parts[parts.length - 1] || "";
    const currentDir = getCurrentDirectory();

    // Special handling for cd command
    if (command === "cd") {
      if (
        currentDir &&
        currentDir.type === "directory" &&
        currentDir.children
      ) {
        const directories = Object.entries(currentDir.children)
          .filter(([, item]) => item.type === "directory")
          .map(([name]) => `${name}/`)
          .sort((a, b) => a.localeCompare(b));

        if (parts.length === 1) {
          if (directories.length > 0) {
            const currentPrompt = getCurrentPrompt();
            setHistory((prev) => [
              ...prev,
              {
                command: input,
                output: (
                  <div className=" ">
                    {directories.join("  ")}
                  </div>
                ),
                prompt: currentPrompt,
              },
            ]);
          }
          return;
        }

        const matches = directories.filter((dir) =>
          dir.toLowerCase().startsWith(lastArg.toLowerCase())
        );

        if (matches.length === 1) {
          const newParts = [...parts];
          newParts[newParts.length - 1] = matches[0];
          setInput(newParts.join(" "));
        } else if (matches.length > 1) {
          const currentPrompt = getCurrentPrompt();
          setHistory((prev) => [
            ...prev,
            {
              command: input,
              output: (
                <div className=" ">
                  {matches.join("  ")}
                </div>
              ),
              prompt: currentPrompt,
            },
          ]);

          const commonPrefix = matches.reduce((prefix, match) => {
            let common = "";
            for (let i = 0; i < Math.min(prefix.length, match.length); i++) {
              if (prefix[i].toLowerCase() === match[i].toLowerCase()) {
                common += match[i];
              } else {
                break;
              }
            }
            return common;
          }, matches[0]);

          if (commonPrefix.length > lastArg.length) {
            const newParts = [...parts];
            newParts[newParts.length - 1] = commonPrefix;
            setInput(newParts.join(" "));
          }
        }
      }
      return;
    }

    // Handle file-related commands (cat, viu, play)
    if (["cat", "viu", "play"].includes(command)) {
      if (
        currentDir &&
        currentDir.type === "directory" &&
        currentDir.children
      ) {
        const items = getSortedItems(currentDir);

        if (parts.length === 1) {
          if (items.length > 0) {
            const currentPrompt = getCurrentPrompt();
            const isMediaPhotos = currentPath === "/media/photos";
            const isMediaVideos = currentPath === "/media/videos";

            if (isMediaPhotos || isMediaVideos) {
              const gridItems = items.map((name) => (
                <div
                  key={name}
                  className=" "
                >
                  {name}
                </div>
              ));

              setHistory((prev) => [
                ...prev,
                {
                  command: input,
                  output: (
                    <div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                        {gridItems}
                      </div>
                    </div>
                  ),
                  prompt: currentPrompt,
                },
              ]);
            } else {
              setHistory((prev) => [
                ...prev,
                {
                  command: input,
                  output: (
                    <div className=" ">
                      {items.join("  ")}
                    </div>
                  ),
                  prompt: currentPrompt,
                },
              ]);
            }
          }
          return;
        }

        const matches = items.filter((item) =>
          item.toLowerCase().startsWith(lastArg.toLowerCase())
        );

        if (matches.length === 1) {
          const newParts = [...parts];
          newParts[newParts.length - 1] = matches[0];
          setInput(newParts.join(" "));
        } else if (matches.length > 1) {
          const currentPrompt = getCurrentPrompt();
          const isMediaPhotos = currentPath === "/media/photos";
          const isMediaVideos = currentPath === "/media/videos";

          if (isMediaPhotos || isMediaVideos) {
            const gridItems = matches.map((name) => (
              <div
                key={name}
                className=" "
              >
                {name}
              </div>
            ));

            setHistory((prev) => [
              ...prev,
              {
                command: input,
                output: (
                  <div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
                      {gridItems}
                    </div>
                  </div>
                ),
                prompt: currentPrompt,
              },
            ]);
          } else {
            setHistory((prev) => [
              ...prev,
              {
                command: input,
                output: (
                  <div className=" ">
                    {matches.join("  ")}
                  </div>
                ),
                prompt: currentPrompt,
              },
            ]);
          }

          const commonPrefix = matches.reduce((prefix, match) => {
            let common = "";
            for (let i = 0; i < Math.min(prefix.length, match.length); i++) {
              if (prefix[i].toLowerCase() === match[i].toLowerCase()) {
                common += match[i];
              } else {
                break;
              }
            }
            return common;
          }, matches[0]);

          if (commonPrefix.length > lastArg.length) {
            const newParts = [...parts];
            newParts[newParts.length - 1] = commonPrefix;
            setInput(newParts.join(" "));
          }
        }
      }
      return;
    }

    // Handle ls command
    const availableItems = getAvailableItems();
    const matches = availableItems.filter((item) =>
      item.toLowerCase().startsWith(lastArg.toLowerCase())
    );

    if (matches.length === 1) {
      const newParts = [...parts];
      newParts[newParts.length - 1] = matches[0];
      setInput(newParts.join(" "));
    } else if (matches.length > 1) {
      const currentPrompt = getCurrentPrompt();
      setHistory((prev) => [
        ...prev,
        {
          command: input,
          output: (
            <div className=" ">
              {matches.join("  ")}
            </div>
          ),
          prompt: currentPrompt,
        },
      ]);

      const commonPrefix = matches.reduce((prefix, match) => {
        let common = "";
        for (let i = 0; i < Math.min(prefix.length, match.length); i++) {
          if (prefix[i].toLowerCase() === match[i].toLowerCase()) {
            common += match[i];
          } else {
            break;
          }
        }
        return common;
      }, matches[0]);

      if (commonPrefix.length > lastArg.length) {
        const newParts = [...parts];
        newParts[newParts.length - 1] = commonPrefix;
        setInput(newParts.join(" "));
      }
    }
  };

  // ===== Command Execution =====
  /**
   * Executes a terminal command
   * @param cmd - The command to execute
   */
  const executeCommand = (cmd: string) => {
    let output: string | React.JSX.Element = "";
    const parts = cmd.trim().split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const currentPrompt = getCurrentPrompt();

    if (cmd.trim()) {
      setCommandHistory((prev) => [...prev, cmd.trim()]);
      setHistoryIndex(-1);
    }

    // Command handling
    if (command === "help") {
      if (args.length === 0) {
        output = `Available commands:

ls          - List files and directories
cd          - Change directory
pwd         - Show current directory
cat         - Show file contents
viu         - View images
rename      - Change username
clear       - Clear screen
echo        - Print text
date        - Show date and time
whoami      - Show username
cowsay      - Make a cow say something
copy        - Copy text file to clipboard
help        - Show this help message

Tip: Use TAB to autocomplete files and directories`;
      } else {
        const helpCommand = args[0].toLowerCase();
        switch (helpCommand) {
          case "ls":
            output =
              "ls - List directory contents\nShows files and directories in the current location. Directories are marked with '/'.";
            break;
          case "cd":
            output =
              "cd - Change directory\nUsage: cd [directory] | cd .. | cd\n- cd [dir]: Move to specified directory\n- cd ..: Move up one directory level\n- cd: Return to root directory";
            break;
          case "pwd":
            output =
              "pwd - Print working directory\nDisplays the full path of your current location in the file system.";
            break;
          case "cat":
            output =
              "cat - Display file contents\nUsage: cat [filename]\nShows the contents of text files. Use 'viu' for image files.";
            break;
          case "viu":
            output =
              "viu - View image files\nUsage: viu [image-file]\nDisplays the actual image directly in the terminal.";
            break;
          case "rename":
            output =
              "rename - Change username\nUsage: rename [new-username]\nChanges your username displayed in the terminal prompt.";
            break;
          case "clear":
            output =
              "clear - Clear terminal screen\nRemoves all previous commands and output from the terminal display.";
            break;
          case "echo":
            output =
              "echo - Display text\nUsage: echo [text]\nPrints the specified text to the terminal.";
            break;
          case "date":
            output =
              "date - Show current date and time\nDisplays the current system date and time.";
            break;
          case "whoami":
            output =
              "whoami - Display current username\nShows the current username (without the @invite part).";
            break;
          case "cowsay":
            output =
              "cowsay - Make a cow say something\nUsage: cowsay [message]\nDisplays an ASCII art cow with a speech bubble containing your message.";
            break;
          case "copy":
            output =
              "copy - Copy text file to clipboard\n\nUsage: copy filename.txt\n\nCopies the contents of a text file to your clipboard.\nOnly works with .txt files.";
            break;
          case "help":
            output =
              "help - Show help information\nUsage: help | help [command]\n- help: Show all available commands\n- help [command]: Show detailed help for a specific command";
            break;
          default:
            output = `help: no help available for '${helpCommand}'\nType 'help' to see all available commands.`;
        }
      }
    } else if (command === "clear") {
      playOutputSound();
      setHistory([]);
      setInput("");
      return;
    } else if (command === "rename") {
      if (args.length === 0) {
        output = "rename: missing username";
      } else {
        const newUsername = args[0];
        setUsername(newUsername);
        localStorage.setItem("terminal_username", newUsername);
        output = `Username changed to: ${newUsername}`;
      }
    } else if (command.startsWith("echo")) {
      const args = cmd.substring(5).trim();
      if (!args) {
        output = "";
        return;
      }

      let processedOutput = args;
      if (
        (args.startsWith('"') && args.endsWith('"')) ||
        (args.startsWith("'") && args.endsWith("'"))
      ) {
        processedOutput = args.slice(1, -1);
      }

      processedOutput = processedOutput
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, "\\")
        .replace(/\$(\w+)/g, (match, variable) => {
          switch (variable) {
            case "USER":
              return username.split("@")[0];
            case "PATH":
              return currentPath;
            case "HOME":
              return "/";
            case "PWD":
              return currentPath;
            default:
              return match;
          }
        });

      output = processedOutput;
    } else if (command === "date") {
      const now = new Date();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const day = days[now.getDay()];
      const month = months[now.getMonth()];
      const date = now.getDate().toString().padStart(2, "0");
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const year = now.getFullYear();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      output = `${day} ${month} ${date} ${hours}:${minutes}:${seconds} ${timezone} ${year}`;
    } else if (command === "whoami") {
      const [user, host] = username.split("@");
      const now = new Date();
      const hours = now.getHours();
      const timeOfDay =
        hours < 12 ? "morning" : hours < 18 ? "afternoon" : "evening";

      output = `User: ${user}
Host: ${host || "localhost"}
Login: ${username}
Time: ${timeOfDay}
Path: ${currentPath}`;
    } else if (command === "pwd") {
      output = currentPath;
    } else if (command === "ls") {
      const currentDir = getCurrentDirectory();
      if (
        currentDir &&
        currentDir.type === "directory" &&
        currentDir.children
      ) {
        const items = getSortedItems(currentDir);
        const isMediaPhotos = currentPath === "/media/photos";
        const isMediaVideos = currentPath === "/media/videos";

        if (isMediaPhotos || isMediaVideos) {
          const gridItems = items.map((name) => (
            <div key={name} className=" ">
              {name}
            </div>
          ));

          output = (
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2">
              {gridItems}
            </div>
          );
        } else {
          output =
            items.length > 0
              ? items.join("  ")
              : "Directory is empty. Use 'cd' to navigate to another directory.";
        }
      } else {
        output = "Cannot list directory";
      }
    } else if (command === "cd") {
      if (args.length === 0) {
        setCurrentPath("/");
        output = "";
      } else if (args[0] === "..") {
        const pathParts = currentPath.split("/").filter(Boolean);
        if (pathParts.length > 0) {
          pathParts.pop();
          setCurrentPath("/" + pathParts.join("/"));
        }
        output = "";
      } else {
        const targetPath = args[0].replace(/\/$/, "");
        const target = getFileAtPath(targetPath);

        if (target && target.type === "directory") {
          if (args[0].startsWith("/")) {
            setCurrentPath(args[0]);
          } else {
            const newPath =
              currentPath === "/"
                ? `/${targetPath}`
                : `${currentPath}/${targetPath}`;
            setCurrentPath(newPath);
          }
          output = "";
        } else {
          output = `No such directory: ${args[0]}`;
        }
      }
    } else if (command === "cat") {
      if (args.length === 0) {
        output = "Missing file operand";
      } else {
        const file = getFileAtPath(args[0]) as File;
        if (file && file.type === "file") {
          if (file.content === "image") {
            output = `Is a binary file (use 'viu' to view images)`;
          } else if (file.content === "video") {
            output = `Is a video file (use 'play' command to view videos)`;
          } else {
            output = file.content;
          }
        } else {
          output = `No such file: ${args[0]}`;
        }
      }
    } else if (command === "viu") {
      if (args.length === 0) {
        output = "Missing file operand";
      } else {
        const file = getFileAtPath(args[0]) as File;
        if (
          file &&
          file.type === "file" &&
          file.content === "image" &&
          file.imageUrl
        ) {
          output = (
            <div className="mt-2 mb-3">
              <img
                src={file.imageUrl}
                alt={args[0]}
                className="max-w-full rounded-none"
                style={{ maxHeight: "250px" }}
                onLoad={() => setImageLoaded((prev) => !prev)}
              />
            </div>
          );
        } else if (file && file.type === "file") {
          if (file.content === "video") {
            output = `Is a video file (use 'play' command to view videos)`;
          } else {
            output = `Not an image file (only .png, .jpg, .webp files are supported)`;
          }
        } else {
          output = `No such file: ${args[0]}`;
        }
      }
    } else if (command === "play") {
      if (args.length === 0) {
        output = "Missing file operand";
      } else {
        const file = getFileAtPath(args[0]) as File;
        if (
          file &&
          file.type === "file" &&
          file.content === "video" &&
          file.videoUrl
        ) {
          // Reset states before starting new video
          setCurrentTime("00:00");
          setVideoDuration("00:00");
          setIsVideoMode(true);

          output = (
            <div className="mt-2 mb-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-neutral-500">
                  {currentTime} / {videoDuration}
                </span>
                <span className="text-neutral-500">REPRODUCER MODE</span>
              </div>
              <video
                ref={videoRef}
                src={file.videoUrl}
                className="max-w-full rounded-none bg-black"
                style={{ maxHeight: "250px", width: "100%" }}
                controls={false}
                autoPlay
                onTimeUpdate={handleTimeUpdate}
                onLoadedData={handleVideoLoad}
                onDurationChange={handleDurationChange}
                onPlay={handleTimeUpdate}
                onPause={handleTimeUpdate}
                onSeeked={handleTimeUpdate}
                playsInline
                preload="auto"
              />
              <div className="mt-2 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-neutral-500">
                  Q[QUIT] K[VOLUME DOWN] L[VOLUME UP] P[PAUSE/PLAY]
                </span>
              </div>
            </div>
          );
        } else if (file && file.type === "file") {
          if (file.content === "image") {
            output = `Is an image file (use 'viu' to view images)`;
          } else {
            output = `Not a video file (only .mp4 files are supported)`;
          }
        } else {
          output = `No such file: ${args[0]}`;
        }
      }
    } else if (command === "cowsay") {
      if (args.length === 0) {
        output = "What should the cow say?";
      } else {
        const message = args.join(" ");
        const maxWidth = 40;
        const words = message.split(" ");
        const lines: string[] = [];
        let currentLine = "";

        words.forEach((word) => {
          if (currentLine.length + word.length + 1 <= maxWidth) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        });
        if (currentLine) lines.push(currentLine);

        const maxLineLength = Math.max(...lines.map((line) => line.length));
        const bubble = [
          " " + "_".repeat(maxLineLength + 2),
          ...lines.map(
            (line) =>
              "| " + line + " ".repeat(maxLineLength - line.length) + " |"
          ),
          " " + "-".repeat(maxLineLength + 2),
        ].join("\n");

        const cow = `
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

        output = bubble + cow;
      }
    } else if (command === "copy") {
      if (args.length === 0) {
        output = "Missing file operand";
      } else {
        const file = getFileAtPath(args[0]) as File;
        if (file && file.type === "file") {
          if (file.content === "image" || file.content === "video") {
            output = `copy: ${args[0]}: Is a binary file`;
          } else if (!args[0].toLowerCase().endsWith(".txt")) {
            output = `copy: ${args[0]}: Only .txt files are supported`;
          } else {
            const content = file.content as string;
            try {
              navigator.clipboard
                .writeText(content)
                .then(() => {
                  output = `Contents of ${args[0]} copied to clipboard`;
                })
                .catch(() => {
                  output = `Failed to copy to clipboard. Please check if you have granted clipboard permissions.`;
                });
            } catch (error) {
              output = `Failed to copy to clipboard: ${error}`;
            }
          }
        } else {
          output = `copy: ${args[0]}: No such file`;
        }
      }
    } else if (command === "") {
      output = "";
    } else {
      output = `Command not found: ${command}`;
    }

    setHistory((prev) => [
      ...prev,
      { command: cmd, output, prompt: currentPrompt },
    ]);
    if (cmd.trim()) playOutputSound();
    setInput("");
  };

  // ===== Event Handlers =====
  /**
   * Handles form submission
   * @param e - Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  /**
   * Handles keyboard events
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isVideoMode) {
      e.preventDefault();
      switch (e.key.toUpperCase()) {
        case "L":
          if (videoRef.current) {
            videoRef.current.volume = Math.min(
              1,
              videoRef.current.volume + 0.1
            );
          }
          break;
        case "K":
          if (videoRef.current) {
            videoRef.current.volume = Math.max(
              0,
              videoRef.current.volume - 0.1
            );
          }
          break;
        case "P":
          if (videoRef.current && !isHandlingVideoControl) {
            setIsHandlingVideoControl(true);
            videoRef.current.focus();
            if (videoRef.current.paused) {
              setTimeout(() => {
                videoRef.current?.play().catch((error) => {
                  console.error("Error playing video:", error);
                });
                setIsHandlingVideoControl(false);
              }, 0);
            } else {
              setTimeout(() => {
                videoRef.current?.pause();
                setIsHandlingVideoControl(false);
              }, 0);
            }
          }
          break;
        case "Q":
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsVideoMode(false);
            setInput("");
            setHistory((prev) => prev.slice(0, -1));
          }
          break;
      }
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  // ===== Effects =====
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/terminal/output-sound.mp3");
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, imageLoaded]);

  // Focus management
  useEffect(() => {
    const handleFocus = () => {
      if (!isMobile) {
        inputRef.current?.focus();
      }
    };

    if (!isMobile) {
      inputRef.current?.focus();
    }

    document.addEventListener("click", handleFocus);
    document.addEventListener("focus", handleFocus);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("click", handleFocus);
      document.removeEventListener("focus", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isMobile]);

  // Video controls
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isVideoMode && !isHandlingVideoControl) {
        e.preventDefault();
        switch (e.key.toUpperCase()) {
          case "L":
            if (videoRef.current) {
              videoRef.current.volume = Math.min(
                1,
                videoRef.current.volume + 0.1
              );
            }
            break;
          case "K":
            if (videoRef.current) {
              videoRef.current.volume = Math.max(
                0,
                videoRef.current.volume - 0.1
              );
            }
            break;
          case "P":
            if (videoRef.current && !isHandlingVideoControl) {
              setIsHandlingVideoControl(true);
              videoRef.current.focus();
              if (videoRef.current.paused) {
                setTimeout(() => {
                  videoRef.current?.play().catch((error) => {
                    console.error("Error playing video:", error);
                  });
                  setIsHandlingVideoControl(false);
                }, 0);
              } else {
                setTimeout(() => {
                  videoRef.current?.pause();
                  setIsHandlingVideoControl(false);
                }, 0);
              }
            }
            break;
          case "Q":
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
              setIsVideoMode(false);
              setInput("");
              setHistory((prev) => prev.slice(0, -1));
            }
            break;
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isVideoMode, isHandlingVideoControl]);

  // Load saved username
  useEffect(() => {
    const savedUsername = localStorage.getItem("terminal_username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // ===== Render =====
  return (
    <div className="flex items-center justify-center leading-normal">
      <div className="max-w-screen-sm w-full">
        <div
          className="bg-neutral-100 dark:bg-neutral-900 shadow-xs dark:shadow-white/10 ring ring-neutral-800/10 dark:ring-neutral-200/10 rounded-xl h-[450px] md:h-[560px] lg:h-[620px] overflow-hidden flex flex-col text-xs sm:text-sm tracking-tight"
          onClick={() => !isMobile && inputRef.current?.focus()}
        >
          {/* Terminal header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-neutral-500 absolute left-1/2 -translate-x-1/2">
              Terminal
            </div>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="flex-1 p-4 overflow-auto font-mono  "
          >
            {history.map((item, index) => (
              <div key={index} className="mb-2">
                {item.command !== "" && (
                  <div className="flex">
                    <span className="text-neutral-500 mr-2">{item.prompt}</span>
                    <span className="">{item.command}</span>
                  </div>
                )}
                {item.output && (
                  <div className="  ml-4 whitespace-pre-wrap">
                    {item.output}
                  </div>
                )}
              </div>
            ))}

            {/* Current input line */}
            <form onSubmit={handleSubmit} className="flex">
              <span className="text-neutral-500 mr-2">
                {getCurrentPrompt()}
              </span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent outline-none font-mono  "
                  autoFocus
                />
              </div>
            </form>
          </div>
        </div>
        <div>
          <p className="text-[11px] text-neutral-500 mt-4 text-center sm:hidden">
            Desktop version recommended for a better experience.
          </p>
        </div>
      </div>
    </div>
  );
}
