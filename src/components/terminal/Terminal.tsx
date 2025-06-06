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

type NanoCursor = {
  x: number;
  y: number;
};

export default function Terminal() {
  // ===== State Management =====
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
      output: "Type 'help' for available commands.",
      prompt: "",
    },
  ]);
  const [currentPath, setCurrentPath] = useState("/");
  const [username, setUsername] = useState("user@computer");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [videoDuration, setVideoDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [isHandlingVideoControl, setIsHandlingVideoControl] = useState(false);
  const [isNanoMode, setIsNanoMode] = useState(false);
  const [nanoContent, setNanoContent] = useState<string[]>([]);
  const [nanoCursor, setNanoCursor] = useState<NanoCursor>({ x: 0, y: 0 });

  // ===== Refs =====
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const nanoRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // ===== Utility Functions =====
  const getSortedItems = (dir: Directory) => {
    return Object.entries(dir.children)
      .map(([name, item]) => ({
        name: item.type === "directory" ? `${name}/` : name,
        type: item.type,
        sortKey: name.toLowerCase(),
      }))
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.sortKey.localeCompare(b.sortKey);
      })
      .map((item) => item.name);
  };

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

  const getDisplayPath = () => (currentPath === "/" ? "/" : currentPath);
  const getCurrentPrompt = () => `${username}:${getDisplayPath()}$`;

  const formatTime = (timeInSeconds: number) => {
    if (!isFinite(timeInSeconds) || timeInSeconds < 0) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // ===== Media Functions =====
  const playOutputSound = () => {
    if (audioRef.current && !isMobile) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    if (isFinite(currentTime)) {
      setCurrentTime(formatTime(currentTime));
    }
  };

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

  const handleDurationChange = () => {
    if (!videoRef.current) return;
    const duration = videoRef.current.duration;
    if (isFinite(duration)) {
      setVideoDuration(formatTime(duration));
    }
  };

  // ===== Tab Completion Functions =====
  const getAvailableItems = () => {
    const currentDir = getCurrentDirectory();
    if (currentDir && currentDir.type === "directory" && currentDir.children) {
      return Object.keys(currentDir.children).sort((a, b) =>
        a.localeCompare(b)
      );
    }
    return [];
  };

  const handleTabCompletion = () => {
    const parts = input.trim().split(" ");
    const command = parts[0].toLowerCase();
    if (!["cd", "cat", "viu", "ls", "play", "nano"].includes(command)) return;

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
                  <div className="text-neutral-800 dark:text-neutral-200">
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
                <div className="text-neutral-800 dark:text-neutral-200">
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

    // Handle file-related commands (cat, viu, play, nano)
    if (["cat", "viu", "play", "nano"].includes(command)) {
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
                  className="text-neutral-800 dark:text-neutral-200"
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
                    <div className="text-neutral-800 dark:text-neutral-200">
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
                className="text-neutral-800 dark:text-neutral-200"
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
                  <div className="text-neutral-800 dark:text-neutral-200">
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
            <div className="text-neutral-800 dark:text-neutral-200">
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

ls          - List directory contents
cd          - Change directory (cd [dir], cd .., cd)
pwd         - Print working directory
cat         - Display file contents
viu         - View image files directly in terminal
rename      - Change username (rename [username])
clear       - Clear terminal screen
echo        - Display text (echo [text])
date        - Show current date and time
whoami      - Display current username
cowsay      - Make a cow say something (cowsay [message])
nano        - View and navigate text files (nano [filename])
help        - Show this help message (help [command] for details)

Tip: Use TAB for autocompletion of files and directories`;
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
          case "nano":
            output =
              "nano - View and navigate text files\nUsage: nano [filename]\nOpens a read-only text editor with cursor navigation.\nControls:\n- Arrow keys or WASD to move cursor\n- X to exit";
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
            <div key={name} className="text-neutral-800 dark:text-neutral-200">
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
              <div className="mt-2 flex items-center justify-between text-sm">
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
    } else if (command === "nano") {
      if (args.length === 0) {
        output = "Usage: nano [filename]";
      } else {
        const file = getFileAtPath(args[0]) as File;
        if (file && file.type === "file") {
          if (file.content === "image" || file.content === "video") {
            output = `nano: ${args[0]}: Is a binary file`;
          } else {
            const content = file.content as string;
            const lines = content.split("\n");
            setNanoContent(lines);
            setIsNanoMode(true);
            setNanoCursor({ x: 0, y: 0 });

            output = (
              <div key="nano-editor" className="mt-2 mb-3">
                <div
                  ref={nanoRef}
                  className="bg-white border border-neutral-200 dark:border-neutral-800 dark:bg-neutral-950 rounded-none p-2 font-mono text-sm outline-none max-h-[300px] overflow-hidden"
                  tabIndex={0}
                  onFocus={() => {
                    if (nanoRef.current) {
                      nanoRef.current.focus();
                    }
                  }}
                  onBlur={() => {
                    if (isNanoMode && nanoRef.current) {
                      nanoRef.current.focus();
                    }
                  }}
                >
                  <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-1 mb-2">
                    <span className="text-neutral-500">
                      GNU nano (read-only)
                    </span>
                    <span className="text-neutral-500">{args[0]}</span>
                  </div>
                  <div className="flex overflow-hidden">
                    <div className="text-neutral-500 pr-2 select-none shrink-0">
                      {lines
                        .map((_, i) => (i + 1).toString().padStart(3, " "))
                        .join("\n")}
                    </div>
                    <div className="relative overflow-y-auto max-h-[250px] w-full">
                      {lines.map((line, y) => (
                        <div
                          key={y}
                          className="relative break-words whitespace-pre-wrap"
                        >
                          {line.split("").map((char, x) => (
                            <span
                              key={x}
                              className={`
                                ${
                                  nanoCursor.x === x && nanoCursor.y === y
                                    ? "bg-neutral-200 dark:bg-neutral-800"
                                    : ""
                                }
                                ${char === " " ? "invisible" : ""}
                              `}
                            >
                              {char}
                            </span>
                          ))}
                          {nanoCursor.x === line.length &&
                            nanoCursor.y === y && (
                              <span className="bg-neutral-200 dark:bg-neutral-800">
                                &nbsp;
                              </span>
                            )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-neutral-500 text-xs mt-1">
                  [ Read-only mode - Press X to exit ]
                </div>
              </div>
            );
          }
        } else {
          output = `nano: ${args[0]}: No such file`;
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

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
  useEffect(() => {
    audioRef.current = new Audio("/terminal/output-sound.mp3");
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
    }
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, imageLoaded]);

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

  useEffect(() => {
    const savedUsername = localStorage.getItem("terminal_username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    if (isNanoMode && nanoRef.current) {
      setTimeout(() => {
        nanoRef.current?.focus();
      }, 0);
    }
  }, [isNanoMode]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isNanoMode) return;

      const lines = nanoContent;
      const maxY = lines.length - 1;
      const maxX = lines[nanoCursor.y]?.length || 0;

      if (
        [
          "arrowup",
          "arrowdown",
          "arrowleft",
          "arrowright",
          "w",
          "a",
          "s",
          "d",
          "x",
        ].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
        e.stopPropagation();
      }

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          setNanoCursor((prev) => ({
            x: Math.min(prev.x, lines[Math.max(0, prev.y - 1)]?.length || 0),
            y: Math.max(0, prev.y - 1),
          }));
          break;
        case "arrowdown":
        case "s":
          setNanoCursor((prev) => ({
            x: Math.min(prev.x, lines[Math.min(maxY, prev.y + 1)]?.length || 0),
            y: Math.min(maxY, prev.y + 1),
          }));
          break;
        case "arrowleft":
        case "a":
          setNanoCursor((prev) => ({
            x: Math.max(0, prev.x - 1),
            y: prev.y,
          }));
          break;
        case "arrowright":
        case "d":
          setNanoCursor((prev) => ({
            x: Math.min(maxX, prev.x + 1),
            y: prev.y,
          }));
          break;
        case "x":
          setIsNanoMode(false);
          setNanoContent([]);
          setNanoCursor({ x: 0, y: 0 });
          setHistory((prev) => prev.slice(0, -1));
          inputRef.current?.focus();
          break;
      }
    };

    if (isNanoMode) {
      window.addEventListener("keydown", handleGlobalKeyDown, true);
      return () =>
        window.removeEventListener("keydown", handleGlobalKeyDown, true);
    }
  }, [isNanoMode, nanoContent, nanoCursor]);

  // ===== Render =====
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-sm w-full">
        <div
          className="bg-neutral-100 dark:bg-neutral-900 shadow-xs dark:shadow-white/10 ring ring-neutral-800/10 dark:ring-neutral-200/10 rounded-xl h-[500px] overflow-hidden flex flex-col text-xs sm:text-sm tracking-tight"
          onClick={() => !isMobile && inputRef.current?.focus()}
        >
          {/* Terminal header */}
          <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-neutral-500">Terminal</div>
            <div className="w-[72px]"></div>
          </div>

          {/* Terminal content */}
          <div
            ref={terminalRef}
            className="flex-1 p-4 overflow-auto font-mono text-neutral-800 dark:text-neutral-200"
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
                  <div className="text-neutral-800 dark:text-neutral-200 ml-4 whitespace-pre-wrap">
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
                  className="w-full bg-transparent outline-none font-mono text-neutral-800 dark:text-neutral-200"
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
