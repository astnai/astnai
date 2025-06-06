import Terminal from "@/components/terminal/Terminal"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "terminal",
  description: "a terminal",
};

export default function TermianlPage() {
  return <Terminal />
}